import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

interface TitleBarProps {
  title: string;
  c: ThemeColors;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isFrozen?: boolean;
  onForceQuit?: () => void;
}

export function TitleBar({ title, c, onClose, onMinimize, onMaximize, onMouseDown, isFrozen }: TitleBarProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="flex items-center justify-between h-10 px-4 select-none cursor-move flex-shrink-0"
      style={{ background: c.titlebar, borderBottom: `1px solid ${c.titlebarBorder}` }}
    >
      <span style={{ color: isFrozen ? c.warning : c.textSec }} className="text-xs font-medium">
        {title}{isFrozen ? " (Not Responding)" : ""}
      </span>
      <div className="flex items-center gap-1">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMinimize}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          style={{ color: c.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <I d={ic.minimize} s={12} />
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onMaximize}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          style={{ color: c.textMuted }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <I d={ic.maximize} s={11} />
        </button>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
          onMouseEnter={(e) => { e.currentTarget.style.background = c.danger; (e.currentTarget.firstChild as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; (e.currentTarget.firstChild as HTMLElement).style.color = c.textMuted; }}
        >
          <span style={{ color: c.textMuted }}><I d={ic.close} s={12} /></span>
        </button>
      </div>
    </div>
  );
}
