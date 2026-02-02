"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TerminalNavbar from "../components/ui/TerminalNavbar";
import ShapeBlur from "../components/ui/ShapeBlur";

type TerminalEntryMap = {
  input: { text: string };
  output: { text: string };
  profile: { revealKey?: number };
};

type TerminalEntry = {
  [Key in keyof TerminalEntryMap]: { id: number; type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];

type TerminalEntryInput = {
  [Key in keyof TerminalEntryMap]: { type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];

const COMMAND_LIST = [
  "help",
  "clear",
  "exit",
  "shutdown",
  "about",
  "cat about.profile",
  "ls",
  "man",
];

const HELP_TEXT = [
  "Available commands:",
  "  help   - show this help message",
  "  clear  - clear the terminal",
  "  exit   - return to GUI",
  "  shutdown - return to bootloader",
  "  about  - short system info",
  "  cat about.profile - show profile card",
  "  ls     - list commands",
  "  man [command] - show command help",
].join("\n");

export default function ShellPage() {
  const router = useRouter();
  const [commandLine, setCommandLine] = useState("");
  const [history, setHistory] = useState<TerminalEntry[]>([
    { id: 1, type: "output", text: "Booting Shell Mode..." },
    { id: 2, type: "output", text: "Type 'help' to list commands." },
    { id: 3, type: "profile", revealKey: 1 },
  ]);
  const [nextId, setNextId] = useState(4);
  const [hasMounted, setHasMounted] = useState(false);
  const [profileRevealKey, setProfileRevealKey] = useState(1);
  const [isProfileImageReady, setIsProfileImageReady] = useState(false);
  const [showPixelCanvas, setShowPixelCanvas] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const pixelCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelBufferRef = useRef<HTMLCanvasElement | null>(null);
  const cursorInnerRef = useRef<HTMLDivElement | null>(null);
  const cursorOuterRef = useRef<HTMLDivElement | null>(null);
  const cursorTargetRef = useRef({ x: 0, y: 0 });
  const cursorOuterPosRef = useRef({ x: 0, y: 0 });
  const profileFrameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      cursorTargetRef.current = { x: clientX, y: clientY };

      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }
    };

    let rafId = 0;
    const follow = () => {
      const target = cursorTargetRef.current;
      const current = cursorOuterPosRef.current;
      const lerp = 0.14;

      const nextX = current.x + (target.x - current.x) * lerp;
      const nextY = current.y + (target.y - current.y) * lerp;

      cursorOuterPosRef.current = { x: nextX, y: nextY };
      if (cursorOuterRef.current) {
        cursorOuterRef.current.style.transform = `translate(${nextX}px, ${nextY}px)`;
      }

      rafId = window.requestAnimationFrame(follow);
    };

    window.addEventListener("mousemove", handleMove);
    rafId = window.requestAnimationFrame(follow);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  useEffect(() => {
    if (profileRevealKey === 0 || !isProfileImageReady) return;

    const image = profileImageRef.current;
    const canvas = pixelCanvasRef.current;
    if (!image || !canvas) return;

    const buffer = pixelBufferRef.current ?? document.createElement("canvas");
    pixelBufferRef.current = buffer;

    const drawPixelated = (pixelSize: number, tintAlpha: number) => {
      const width = image.naturalWidth || image.width || 176;
      const height = image.naturalHeight || image.height || 176;
      if (!width || !height) return;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const scaledWidth = Math.max(1, Math.floor(width / pixelSize));
      const scaledHeight = Math.max(1, Math.floor(height / pixelSize));
      buffer.width = scaledWidth;
      buffer.height = scaledHeight;

      const bufferCtx = buffer.getContext("2d");
      const ctx = canvas.getContext("2d");
      if (!bufferCtx || !ctx) return;

      bufferCtx.imageSmoothingEnabled = false;
      bufferCtx.clearRect(0, 0, scaledWidth, scaledHeight);
      bufferCtx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(buffer, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);

      if (tintAlpha > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = `rgba(16,185,129,${tintAlpha})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }
      ctx.restore();
    };

    let rafId = 0;
    let startTime: number | null = null;
    const duration = 1700;
    const maxPixel = 32;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const pixelSize = Math.max(1, Math.round(maxPixel * (1 - Math.pow(eased, 0.8))));
      const tintAlpha = 0.65 * (1 - eased * 0.75);

      drawPixelated(pixelSize, tintAlpha);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        setShowPixelCanvas(false);
      }
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [profileRevealKey, isProfileImageReady]);

  const appendEntry = (entry: TerminalEntryInput) => {
    setHistory((prev) => [...prev, { ...entry, id: nextId }]);
    setNextId((value) => value + 1);
  };

  const handleCommand = (rawCommand: string) => {
    const command = rawCommand.trim();

    appendEntry({ type: "input", text: `guest@boot:~$ ${rawCommand}` });

    if (!command) {
      return;
    }

    const normalizedCommand = command.toLowerCase();
    switch (normalizedCommand) {
      case "help":
        appendEntry({ type: "output", text: HELP_TEXT });
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        appendEntry({ type: "output", text: "Exiting to GUI..." });
        setTimeout(() => router.push("/"), 450);
        break;
      case "shutdown":
        appendEntry({ type: "output", text: "Shutting down to bootloader..." });
        setTimeout(() => router.push("/grub-bootloader"), 150);
        break;
      case "about":
        appendEntry({
          type: "output",
          text: "Sakai Shell v1.0 • Minimal boot console environment.",
        });
        break;
      case "ls":
        appendEntry({
          type: "output",
          text: COMMAND_LIST.join("\n"),
        });
        break;
      case "cat about.profile": {
        const nextRevealKey = profileRevealKey + 1;
        setShowPixelCanvas(true);
        setProfileRevealKey(nextRevealKey);
        appendEntry({ type: "profile", revealKey: nextRevealKey });
        break;
      }
      default:
        if (normalizedCommand.startsWith("man")) {
          const target = normalizedCommand.replace(/^man\s*/, "").trim();
          if (!target) {
            appendEntry({
              type: "output",
              text: "Usage: man [command]. Example: man help",
            });
            break;
          }

          const manPages: Record<string, string> = {
            help: "help - show the list of commands",
            clear: "clear - clear the terminal output",
            exit: "exit - return to GUI",
            shutdown: "shutdown - return to bootloader",
            about: "about - short system info",
            "cat about.profile": "cat about.profile - show profile card",
            ls: "ls - list all available commands",
            man: "man [command] - show command help",
          };

          const resolvedKey =
            manPages[target]
              ? target
              : manPages[normalizedCommand.slice(4)]
                ? normalizedCommand.slice(4)
                : "";

          if (resolvedKey && manPages[resolvedKey]) {
            appendEntry({ type: "output", text: manPages[resolvedKey] });
          } else {
            appendEntry({
              type: "output",
              text: `No manual entry for ${target}. Try 'ls' for commands.`,
            });
          }
          break;
        }
        appendEntry({
          type: "output",
          text: `Command not found: ${command}. Type 'help' for options.`,
        });
        break;
    }
  };

  return (
    <main
      className="h-screen overflow-hidden text-emerald-100 cursor-none"
      style={{
        backgroundImage: "url('/images/terminal_images/terminal_dark_inverted.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={cursorOuterRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/70 bg-emerald-300/5 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
      />
      <div
        ref={cursorInnerRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
      />
      <div className="h-full bg-black/70">
        <div className="flex h-full w-full flex-col px-6 py-6 font-mono">
          <div
            className={
              "transition-all duration-500 ease-out " +
              (hasMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")
            }
          >
            <TerminalNavbar
              className="mb-5"
              onClose={() => router.push("/grub-bootloader")}
            />
          </div>

          <div
            ref={scrollRef}
            className={
              "terminal-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto border border-emerald-200/20 bg-black/60 p-4 text-[15px] transition-all duration-500 ease-out " +
              (hasMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")
            }
          >
            {history.length === 0 ? (
              <div className="text-emerald-200/60">Console cleared.</div>
            ) : (
              history.map((entry) => {
                if (entry.type === "profile") {
                  return (
                    <div
                      key={entry.id}
                      className="terminal-pop relative overflow-hidden rounded-lg border border-emerald-200/20 bg-black/70 p-6 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_55%)]" />
                      <div className="relative flex flex-col gap-6 lg:flex-row">
                        <div className="flex w-full justify-center lg:w-64">
                          <div
                            ref={profileFrameRef}
                            className="relative h-52 w-52 overflow-hidden rounded-lg border border-emerald-200/30 bg-emerald-200/10"
                            style={{
                              ["--cursor-x" as never]: "50%",
                              ["--cursor-y" as never]: "50%",
                              ["--cursor-alpha" as never]: "0",
                            }}
                            onMouseMove={(event) => {
                              const rect = event.currentTarget.getBoundingClientRect();
                              const x = event.clientX - rect.left;
                              const y = event.clientY - rect.top;
                              event.currentTarget.style.setProperty("--cursor-x", `${x}px`);
                              event.currentTarget.style.setProperty("--cursor-y", `${y}px`);
                            }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.setProperty("--cursor-alpha", "1");
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.setProperty("--cursor-alpha", "0");
                            }}
                          >
                            <Image
                              src="/jhered-image.jpg"
                              alt="Jhered profile portrait"
                              width={208}
                              height={208}
                              className={
                                "h-full w-full object-cover transition-opacity duration-500 " +
                                (showPixelCanvas ? "opacity-0" : "opacity-100")
                              }
                              priority
                              onLoad={(event) => {
                                const image = event.currentTarget;
                                profileImageRef.current = image;
                                setIsProfileImageReady(true);
                              }}
                              onLoadingComplete={(image) => {
                                profileImageRef.current = image;
                                setIsProfileImageReady(true);
                              }}
                            />
                            <canvas
                              ref={pixelCanvasRef}
                              className={
                                "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 " +
                                (showPixelCanvas ? "opacity-100" : "opacity-0")
                              }
                              style={{ imageRendering: "pixelated" }}
                            />
                            <div
                              className="pointer-events-none absolute inset-0 opacity-[var(--cursor-alpha)] transition-opacity duration-150"
                            >
                              <ShapeBlur
                                className="h-full w-full"
                                variation={0}
                                shapeSize={2.1}
                                roundness={0.9}
                                borderSize={0.03}
                                circleSize={0.18}
                                circleEdge={1}
                              />
                            </div>
                            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0.2)_0px,rgba(0,0,0,0.2)_1px,rgba(0,0,0,0)_3px,rgba(0,0,0,0)_4px)]" />
                            <div className="absolute inset-0 rounded-lg border border-emerald-200/10" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-4 flex flex-col gap-2 text-xs uppercase tracking-[0.45em] text-emerald-200/70 sm:flex-row sm:items-center">
                            <span className="text-emerald-300">jhered_republica@portfolio</span>
                            <span className="h-px flex-1 bg-emerald-200/30" />
                            <span className="rounded-full border border-emerald-200/20 px-3 py-1 text-[10px] text-emerald-200/70">
                              online
                            </span>
                          </div>

                          <div className="grid gap-x-6 gap-y-3 text-[15px] sm:grid-cols-[130px_1fr]">
                            <span className="text-cyan-300">OS</span>
                            <span className="text-emerald-100">SakaiOS 24.05 (Gnome) x86_64</span>
                            <span className="text-cyan-300">Host</span>
                            <span className="text-emerald-100">Jhered&apos;s Portfolio</span>
                            <span className="text-cyan-300">Kernel</span>
                            <span className="text-emerald-100">React 19.0.0 (Fiber)</span>
                            <span className="text-cyan-300">Uptime</span>
                            <span className="text-amber-200">Active Development</span>
                            <span className="text-cyan-300">Packages</span>
                            <span className="text-emerald-100">20+ Projects (npm)</span>
                            <span className="text-cyan-300">Shell</span>
                            <span className="text-emerald-100">zsh 5.9</span>
                            <span className="text-cyan-300">Resolution</span>
                            <span className="text-emerald-100">3840x2160 (4K)</span>
                            <span className="text-cyan-300">DE</span>
                            <span className="text-emerald-100">Holographic UI</span>
                            <span className="text-cyan-300">WM</span>
                            <span className="text-emerald-100">Figma</span>
                            <span className="text-cyan-300">Theme</span>
                            <span className="text-emerald-100">Japanese Tidal Wave</span>
                            <span className="text-cyan-300">Terminal</span>
                            <span className="text-emerald-100">Alacritty</span>
                            <span className="text-cyan-300">CPU</span>
                            <span className="text-purple-200">Software Development & Cybersecurity @ 100%</span>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-7 flex flex-col gap-3 border-t border-emerald-200/15 pt-5">
                        <div className="text-xs uppercase tracking-[0.35em] text-emerald-200/60">
                          Current Role
                        </div>
                        <div className="text-3xl font-semibold text-emerald-300">
                          Aspiring Cybersecurity Professional
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "bg-slate-400",
                            "bg-rose-300",
                            "bg-amber-300",
                            "bg-emerald-300",
                            "bg-cyan-300",
                            "bg-blue-300",
                            "bg-indigo-300",
                            "bg-purple-300",
                            "bg-fuchsia-300",
                          ].map((color) => (
                            <span key={color} className={`h-3 w-6 rounded-sm ${color}`} />
                          ))}
                        </div>
                        <div className="text-sm text-emerald-200/60">Try these commands:</div>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="text-emerald-300">cat skills.db</span>
                          <span className="text-cyan-300">cd projects</span>
                          <span className="text-emerald-300">cat resume.pdf</span>
                          <span className="text-cyan-300">./contact.sh</span>
                          <span className="text-emerald-300">ls</span>
                          <span className="text-cyan-300">help</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={entry.id}
                    className={entry.type === "input" ? "text-emerald-100" : "text-emerald-200/80"}
                  >
                    {entry.text.split("\n").map((line, index) => (
                      <div key={`${entry.id}-${index}`}>{line}</div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          <div
            className={
              "mt-4 flex items-center gap-2 border border-emerald-200/20 bg-black/70 px-3 py-2 text-sm transition-all duration-500 ease-out " +
              (hasMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")
            }
          >
            <span className="text-emerald-200/80">guest@boot:~$</span>
            <input
              ref={inputRef}
              value={commandLine}
              onChange={(event) => setCommandLine(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const value = commandLine;
                  setCommandLine("");
                  handleCommand(value);
                }
              }}
              className="w-full bg-transparent text-emerald-100 outline-none placeholder:text-emerald-200/40"
              placeholder="Type a command..."
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
