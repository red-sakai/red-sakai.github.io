"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TerminalNavbar from "../components/ui/TerminalNavbar";

type TerminalEntryMap = {
  input: { text: string };
  output: { text: string };
  profile: object;
};

type TerminalEntry = {
  [Key in keyof TerminalEntryMap]: { id: number; type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];

type TerminalEntryInput = {
  [Key in keyof TerminalEntryMap]: { type: Key } & TerminalEntryMap[Key];
}[keyof TerminalEntryMap];

const HELP_TEXT = [
  "Available commands:",
  "  help   - show this help message",
  "  clear  - clear the terminal",
  "  exit   - return to GUI",
  "  shutdown - return to bootloader",
  "  about  - short system info",
].join("\n");

export default function ShellPage() {
  const router = useRouter();
  const [commandLine, setCommandLine] = useState("");
  const [history, setHistory] = useState<TerminalEntry[]>([
    { id: 1, type: "output", text: "Booting Shell Mode..." },
    { id: 2, type: "output", text: "Type 'help' to list commands." },
    { id: 3, type: "profile" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [hasMounted, setHasMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

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

    switch (command.toLowerCase()) {
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
      case "cat about.profile":
        appendEntry({ type: "profile" });
        break;
      default:
        appendEntry({
          type: "output",
          text: `Command not found: ${command}. Type 'help' for options.`,
        });
        break;
    }
  };

  return (
    <main
      className="h-screen overflow-hidden text-emerald-100"
      style={{
        backgroundImage: "url('/images/terminal_images/terminal_dark.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => inputRef.current?.focus()}
    >
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
                        <div className="flex w-full justify-center lg:w-56">
                          <div className="relative h-44 w-44 overflow-hidden rounded-lg border border-emerald-200/30 bg-emerald-200/10">
                            <Image
                              src="/jhered-image.jpg"
                              alt="Jhered profile portrait"
                              width={176}
                              height={176}
                              className="h-full w-full object-cover"
                              priority
                            />
                            <div className="absolute inset-0 rounded-lg border border-emerald-200/10" />
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200/80">
                              Identity Verified
                            </div>
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
                            <span className="text-emerald-100">NixOS 24.05 (Gnome) x86_64</span>
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
