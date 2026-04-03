import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function MoviesApp({ c }: { c: ThemeColors }) {
  return (
    <div className="p-5 space-y-4 overflow-y-auto h-full">
      <p className="text-lg font-semibold" style={{ color: c.text }}>Movies</p>
      <p className="text-xs" style={{ color: c.textMuted }}>Watch & discover</p>
      {[{ name: "The Last Algorithm", genre: "Sci-Fi", year: "2025", rating: "8.7" }, { name: "Digital Dreams", genre: "Drama", year: "2024", rating: "7.9" }, { name: "Code Runner", genre: "Action", year: "2025", rating: "8.2" }, { name: "Neural Path", genre: "Thriller", year: "2024", rating: "8.5" }, { name: "Pixel World", genre: "Animation", year: "2025", rating: "9.1" }].map((m, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl transition-colors" style={{ background: c.cardAlt }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = c.cardAlt)}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.purpleSoft, color: c.purple }}><I d={ic.film} s={20} /></div>
          <div className="flex-1"><p className="text-sm font-medium" style={{ color: c.text }}>{m.name}</p><p className="text-[10px]" style={{ color: c.textMuted }}>{m.genre} \u00b7 {m.year}</p></div>
          <span className="text-xs font-medium" style={{ color: c.warning }}>{m.rating}</span>
        </div>
      ))}
    </div>
  );
}
