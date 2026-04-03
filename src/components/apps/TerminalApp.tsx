import { useState, useEffect, useRef } from "react";
import type { ThemeColors } from "../../os/theme";

export function TerminalApp({ c: _c }: { c: ThemeColors }) {
  const [lines, setLines] = useState(["Alternus OS Terminal v1.0", "Type 'help' for commands.", ""]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const exec = () => {
    const cmd = input.trim();
    setInput("");
    if (!cmd) return;
    const output = [`$ ${cmd}`];
    const l = cmd.toLowerCase();
    if (l === "help") output.push("Commands: help, clear, date, whoami, ls, echo <text>, neofetch");
    else if (l === "clear") { setLines([]); return; }
    else if (l === "date") output.push(new Date().toString());
    else if (l === "whoami") output.push("admin@alternus-os");
    else if (l === "ls") output.push("Documents/  Projects/  Downloads/  Desktop/  .config/");
    else if (l === "neofetch") output.push("Alternus OS v1.0\nKernel: AlternusCore 6.1\nShell: atsh 1.0\nResolution: " + window.innerWidth + "x" + window.innerHeight + "\nTheme: Alternus Dark\nCPU: Virtual (AI-Powered)\nMemory: Unlimited");
    else if (l.startsWith("echo ")) output.push(cmd.slice(5));
    else output.push(`Command not found: ${cmd}`);
    setLines((p) => [...p, ...output]);
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs" style={{ background: "#1a1a1a" }}>
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.startsWith("$") ? "#34D399" : "#ccc" }} className="leading-relaxed">
            <pre className="whitespace-pre-wrap">{l}</pre>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: "1px solid #333" }}>
        <span style={{ color: "#34D399" }}>$</span>
        <input
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: "#fff" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && exec()}
          autoFocus
        />
      </div>
    </div>
  );
}
