import { useRef } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";
import type { WinState } from "../../os/types";
import { TitleBar } from "./TitleBar";

interface AppWindowProps {
  win: WinState;
  c: ThemeColors;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize?: (w: number, h: number) => void;
  onSnap?: (side: "left" | "right") => void;
  onForceQuit?: () => void;
}

export function AppWindow({ win, c, children, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, onSnap, onForceQuit }: AppWindowProps) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    dragging.current = true;
    offset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    onFocus();

    const move = (ev: MouseEvent) => {
      if (dragging.current) {
        onMove(ev.clientX - offset.current.x, ev.clientY - offset.current.y);
      }
    };
    const up = (ev: MouseEvent) => {
      dragging.current = false;
      if (onSnap) {
        if (ev.clientX <= 5) onSnap("left");
        else if (ev.clientX >= window.innerWidth - 5) onSnap("right");
      }
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.w;
    const startH = win.h;
    const startPosX = win.x;
    const startPosY = win.y;

    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW, newH = startH, newX = startPosX, newY = startPosY;
      if (corner.includes("r")) newW = Math.max(280, startW + dx);
      if (corner.includes("b")) newH = Math.max(200, startH + dy);
      if (corner.includes("l")) { newW = Math.max(280, startW - dx); newX = startPosX + dx; }
      if (corner.includes("t")) { newH = Math.max(200, startH - dy); newY = startPosY + dy; }
      if (onResize) onResize(newW, newH);
      if (corner.includes("l") || corner.includes("t")) onMove(newX, newY);
    };
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  if (!win.isOpen || win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: win.zIndex }
    : { position: "absolute", top: win.y, left: win.x, width: win.w, height: win.h, zIndex: win.zIndex };

  return (
    <div
      style={{
        ...style,
        background: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: win.isMaximized ? 0 : 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onClick={onFocus}
    >
      <TitleBar
        title={win.title}
        c={c}
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onMouseDown={handleMouseDown}
        isFrozen={win.isFrozen}
        onForceQuit={onForceQuit}
      />
      <div style={{ flex: 1, overflow: "hidden", position: "relative", padding: 6 }}>
        <div style={{ width: "100%", height: "100%", overflow: "auto", borderRadius: 6 }}>
        {children}
        </div>
        {win.isFrozen && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 999 }}>
            <div className="text-center p-6 rounded-xl" style={{ background: c.surface, border: `1px solid ${c.border}` }}>
              <I d={ic.alertTriangle} s={32} c={c.warning} />
              <p className="text-sm font-medium mt-3" style={{ color: c.text }}>Application Not Responding</p>
              <p className="text-xs mt-1 mb-4" style={{ color: c.textMuted }}>{win.title} has stopped responding</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => { if (onForceQuit) onForceQuit(); }} className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.danger, color: "#fff" }}>Force Quit</button>
                <button className="px-4 py-1.5 rounded-lg text-xs" style={{ background: c.cardAlt, color: c.text }}>Wait</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {!win.isMaximized && (
        <>
          <div onMouseDown={(e) => handleResizeMouseDown(e, "r")} className="absolute top-2 right-0 bottom-2 w-1.5 cursor-ew-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "b")} className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "l")} className="absolute top-2 left-0 bottom-2 w-1.5 cursor-ew-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "br")} className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "bl")} className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "tr")} className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize" />
          <div onMouseDown={(e) => handleResizeMouseDown(e, "tl")} className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize" />
        </>
      )}
    </div>
  );
}
