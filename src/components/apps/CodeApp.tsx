import { useState } from "react";
import type { ThemeColors } from "../../os/theme";

export function CodeApp({ c: _c }: { c: ThemeColors }) {
  const [code, setCode] = useState(`// Alternus Code Editor\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconst result = greet("World");\nconsole.log(result);`);
  return (
    <div className="flex flex-col h-full" style={{ background: "#1e1e1e" }}>
      <div className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0" style={{ background: "#252526", borderBottom: "1px solid #333" }}>
        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "#1e1e1e", color: "#ccc" }}>main.js</span>
      </div>
      <div className="flex flex-1">
        <div className="w-10 flex-shrink-0 pt-3 text-right pr-3" style={{ color: "#555" }}>
          {code.split("\n").map((_, i) => <div key={i} className="text-[11px] leading-5">{i + 1}</div>)}
        </div>
        <textarea
          className="flex-1 p-3 bg-transparent outline-none resize-none text-[13px] leading-5 font-mono"
          style={{ color: "#d4d4d4" }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
