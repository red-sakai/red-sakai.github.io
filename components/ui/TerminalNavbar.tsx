"use client";

import { useState } from "react";

type TerminalNavbarProps = {
  className?: string;
  commands?: string[];
  onCommandClick?: (command: string) => void;
  onClose?: () => void;
};

export default function TerminalNavbar({
  className,
  commands = [
    "$ cd ~/about",
    "$ cat skills.db",
    "$ ls ./projects",
    "$ ./contact.sh",
    "$ curl resume.pdf",
  ],
  onCommandClick,
  onClose,
}: TerminalNavbarProps) {
  const [activeCommand, setActiveCommand] = useState<string | null>(null);

  return (
    <div className={`mx-auto w-fit max-w-full ${className ?? ""}`.trim()}>
      <div className="rounded-lg border border-white/10 bg-black/70 px-5 py-3 shadow-[0_0_22px_rgba(0,0,0,0.45)]">
        <div className="inline-flex items-center justify-start gap-2 text-[14px] tracking-[0.08em] text-emerald-200/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close terminal"
              className="h-3 w-3 rounded-full bg-red-400/80 transition-shadow hover:shadow-[0_0_8px_rgba(248,113,113,0.7)]"
            />
            <span className="h-3 w-3 rounded-full bg-amber-300/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-300/80" />
          </div>
          <span className="h-4 w-px bg-white/10" />
          {commands.map((command, index) => (
            <span key={`${command}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
              <button
                type="button"
                onClick={() => {
                  setActiveCommand(command);
                  onCommandClick?.(command);
                }}
                className={
                  "relative rounded-md border border-transparent px-2.5 py-1 text-emerald-300 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-100 hover:shadow-[0_0_12px_rgba(16,185,129,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
                }
              >
                {command}
                {activeCommand === command && (
                  <span className="absolute inset-x-2 -bottom-1 h-[2px] rounded-full bg-emerald-300/90" />
                )}
              </button>
              {index < commands.length - 1 && <span className="h-4 w-px bg-white/10" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
