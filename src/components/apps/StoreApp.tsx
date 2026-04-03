import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function StoreApp({ c }: { c: ThemeColors }) {
  return (
    <div className="p-5 space-y-4 overflow-y-auto h-full">
      <p className="text-lg font-semibold" style={{ color: c.text }}>Alternus Store</p>
      <p className="text-xs" style={{ color: c.textMuted }}>Discover apps for Alternus OS</p>
      {[{ name: "Alternus Paint", desc: "Digital art & drawing", cat: "Creative" }, { name: "Alternus Docs", desc: "Document editor", cat: "Productivity" }, { name: "Alternus Chat", desc: "Messaging app", cat: "Social" }, { name: "Alternus Maps", desc: "Navigation & maps", cat: "Utilities" }, { name: "Alternus Photos", desc: "Photo gallery & editor", cat: "Creative" }].map((app, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl transition-colors" style={{ background: c.cardAlt }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = c.cardAlt)}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.accentSoft, color: c.accentText }}><I d={ic.sparkle} s={20} /></div>
          <div className="flex-1"><p className="text-sm font-medium" style={{ color: c.text }}>{app.name}</p><p className="text-[10px]" style={{ color: c.textMuted }}>{app.desc}</p></div>
          <span className="text-[10px] px-3 py-1 rounded-full" style={{ background: c.accent, color: "#fff" }}>Get</span>
        </div>
      ))}
    </div>
  );
}
