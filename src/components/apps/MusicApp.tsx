import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function MusicApp({ c }: { c: ThemeColors }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tracks = [
    { name: "Focus Flow", artist: "Ambient AI", dur: "3:42" },
    { name: "Deep Work", artist: "Neural Beats", dur: "4:15" },
    { name: "Code Session", artist: "Synthwave", dur: "5:01" },
    { name: "Creative Space", artist: "Lo-Fi Engine", dur: "3:58" },
    { name: "Night Coding", artist: "Chill Pulse", dur: "4:33" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {tracks.map((t, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setPlaying(true); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
            style={{ background: i === current ? c.accentSoft : "transparent" }}
            onMouseEnter={(e) => { if (i !== current) e.currentTarget.style.background = c.cardAlt; }}
            onMouseLeave={(e) => { if (i !== current) e.currentTarget.style.background = "transparent"; }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: i === current ? c.accent : c.cardAlt }}>
              <I d={ic.music} s={14} c={i === current ? "#fff" : c.textMuted} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: i === current ? c.accentText : c.text }}>{t.name}</p>
              <p className="text-[10px]" style={{ color: c.textMuted }}>{t.artist}</p>
            </div>
            <span className="text-[10px]" style={{ color: c.textMuted }}>{t.dur}</span>
          </button>
        ))}
      </div>
      <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
        <p className="text-xs font-medium mb-1" style={{ color: c.text }}>{tracks[current].name}</p>
        <p className="text-[10px] mb-3" style={{ color: c.textMuted }}>{tracks[current].artist}</p>
        <div className="w-full h-1 rounded-full mb-3" style={{ background: c.cardAlt }}>
          <div className="h-full rounded-full" style={{ background: c.accent, width: playing ? "45%" : "0%", transition: "width 0.3s" }} />
        </div>
        <div className="flex items-center justify-center gap-6">
          <button style={{ color: c.textSec }} onClick={() => setCurrent((p) => p > 0 ? p - 1 : tracks.length - 1)}><I d={ic.skip} s={14} /></button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: c.accent }} onClick={() => setPlaying(!playing)}>
            <I d={playing ? ic.pause : ic.play} s={14} c="#fff" />
          </button>
          <button style={{ color: c.textSec }} onClick={() => setCurrent((p) => p < tracks.length - 1 ? p + 1 : 0)}><I d={ic.skip} s={14} /></button>
        </div>
      </div>
    </div>
  );
}
