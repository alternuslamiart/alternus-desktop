import { useState, useEffect, useRef } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function AIChat({ c }: { c: ThemeColors }) {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Welcome to Alternus OS. I'm your AI assistant. Ask me to create apps, write code, or design anything." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const m = input.trim();
    setInput("");
    setMsgs((p) => [...p, { role: "user", text: m }]);
    setTimeout(() => {
      let r = "I understand. Let me work on that for you.";
      const l = m.toLowerCase();
      if (l.includes("create") || l.includes("build")) r = "I can build that. Let me generate the code. Which framework: React, Python, or something else?";
      else if (l.includes("code") || l.includes("function")) r = "Here's an approach:\n\n```js\nfunction solve(data) {\n  return data.map(process);\n}\n```\n\nShall I expand this?";
      else if (l.includes("hello") || l.includes("hi")) r = "Hello! I'm Alternus AI. What would you like to build today?";
      setMsgs((p) => [...p, { role: "ai", text: r }]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
              style={m.role === "user" ? { background: c.accent, color: "#fff" } : { background: c.cardAlt, color: c.text, border: `1px solid ${c.border}` }}
            >
              <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3" style={{ borderTop: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}>
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: c.text }}
            placeholder="Ask AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} className="p-1.5 rounded-lg" style={{ background: c.accent }}>
            <I d={ic.send} s={14} c="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
