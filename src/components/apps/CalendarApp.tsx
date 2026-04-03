import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function CalendarApp({ c }: { c: ThemeColors }) {
  const now = new Date();
  const [sel, setSel] = useState(now.getDate());
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const fd = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days: (number | null)[] = [...Array.from({ length: fd }, () => null as null), ...Array.from({ length: dim }, (_, i) => i + 1)];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button style={{ color: c.textMuted }} className="p-1"><I d={ic.chevL} s={14} /></button>
        <p className="text-sm font-semibold" style={{ color: c.text }}>{now.toLocaleString("default", { month: "long" })} {now.getFullYear()}</p>
        <button style={{ color: c.textMuted }} className="p-1"><I d={ic.chevR} s={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} className="text-center text-[10px] font-medium py-1" style={{ color: c.textMuted }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <button key={i} onClick={() => d && setSel(d)} className="aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all"
            style={{ background: d === sel ? c.accent : d === now.getDate() && d !== sel ? c.accentSoft : "transparent", color: d === sel ? "#fff" : d === now.getDate() ? c.accentText : d ? c.text : "transparent" }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
