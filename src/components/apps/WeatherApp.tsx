import type { ThemeColors } from "../../os/theme";

export function WeatherApp({ c }: { c: ThemeColors }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-light" style={{ color: c.text }}>17°</p>
          <p className="text-xs" style={{ color: c.textMuted }}>Partly Cloudy</p>
        </div>
        <span className="text-4xl">⛅</span>
      </div>
      <div className="flex gap-2 mb-4">
        {["Mon","Tue","Wed","Thu","Fri"].map((d,i) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl" style={{ background: i === 2 ? c.accentSoft : "transparent" }}>
            <span className="text-[10px] font-medium" style={{ color: i === 2 ? c.accentText : c.textMuted }}>{d}</span>
            <span className="text-sm">{["☀️","⛅","🌤","⛅","☀️"][i]}</span>
            <span className="text-[11px] font-medium" style={{ color: i === 2 ? c.accentText : c.text }}>{[15,14,17,16,19][i]}°</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[{l:"Humidity",v:"62%"},{l:"Wind",v:"12 km/h"},{l:"UV Index",v:"3 Low"},{l:"Pressure",v:"1013 hPa"}].map((s,i) => (
          <div key={i} className="p-3 rounded-xl" style={{ background: c.cardAlt }}>
            <p className="text-[10px]" style={{ color: c.textMuted }}>{s.l}</p>
            <p className="text-sm font-semibold" style={{ color: c.text }}>{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
