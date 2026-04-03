import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

interface LockScreenProps {
  c: ThemeColors;
  time: Date;
  onUnlock: () => void;
}

function fmt(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function LockScreen({ c, time, onUnlock }: LockScreenProps) {
  return (
    <div style={{ background: c.bg }} className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="text-[10px] font-medium" style={{ color: c.textMuted }}>Alternus OS</span>
        <div className="flex items-center gap-3">
          <span style={{ color: c.textMuted }}><I d={ic.wifi} s={14} /></span>
          <span style={{ color: c.textMuted }}><I d={ic.battery} s={14} /></span>
          <span className="text-[10px]" style={{ color: c.textMuted }}>{fmt(time)}</span>
        </div>
      </div>
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p style={{ color: c.text }} className="text-8xl font-bold tracking-wide mb-2">{fmt(time)}</p>
        <p style={{ color: c.textMuted }} className="text-base">{time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      </div>
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: c.accentSoft, border: `2px solid ${c.border}`, color: c.accentText }}>
          <I d={ic.user} s={28} />
        </div>
        <p className="text-sm font-medium mb-0.5" style={{ color: c.text }}>Admin</p>
        <p className="text-[11px] mb-6" style={{ color: c.textMuted }}>admin@alternus.art</p>
        <button
          onClick={onUnlock}
          className="flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm font-medium transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer mb-4"
          style={{ background: c.accent, color: "#fff", boxShadow: `0 4px 20px ${c.accent}40` }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#2563EB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = c.accent; }}
        >
          <I d={ic.monitor} s={16} />
          Open Desktop
        </button>
        <p className="text-xs" style={{ color: c.textMuted }}>Welcome back. Your desktop is ready.</p>
      </div>
    </div>
  );
}
