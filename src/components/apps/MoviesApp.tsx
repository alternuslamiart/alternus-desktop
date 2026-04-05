import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

const sidebarTabs = [
  { id: "foryou", label: "For You", icon: ic.sparkle },
  { id: "movies", label: "Movies", icon: ic.film },
  { id: "series", label: "Series", icon: ic.monitor },
  { id: "new", label: "New", icon: ic.sparkle },
];

const trending = [
  { name: "Digital Dreams", genre: "Drama", year: "2024", rating: "7.9", color: "#A78BFA" },
  { name: "Code Runner", genre: "Action", year: "2025", rating: "8.2", color: "#F87171" },
  { name: "Neural Path", genre: "Thriller", year: "2024", rating: "8.5", color: "#60A5FA" },
  { name: "Pixel World", genre: "Animation", year: "2025", rating: "9.1", color: "#34D399" },
];

const topRated = [
  { name: "Binary Love", genre: "Romance", year: "2025", rating: "8.8" },
  { name: "Kernel Panic", genre: "Horror", year: "2024", rating: "7.6" },
  { name: "Cloud Atlas II", genre: "Sci-Fi", year: "2025", rating: "8.9" },
];

export function MoviesApp({ c }: { c: ThemeColors }) {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[130px] flex-shrink-0 p-3 space-y-1 border-r" style={{ borderColor: c.border }}>
        {sidebarTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: activeTab === tab.id ? c.accent : "transparent",
              color: activeTab === tab.id ? "#fff" : c.textSec,
            }}
          >
            <I d={tab.icon} s={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollbarWidth: "none" }}>
        {/* Featured */}
        <div className="rounded-xl p-5" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#4ADE80", color: "#fff" }}>9.2</span>
            <span className="text-[10px]" style={{ color: c.textMuted }}>Sci-Fi · 2025</span>
          </div>
          <p className="text-base font-semibold mb-1" style={{ color: c.text }}>The Last Algorithm</p>
          <p className="text-[11px] mb-4" style={{ color: c.textMuted }}>In a world run by AI, one programmer discovers the code that controls reality.</p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.accent, color: "#fff" }}>
              <I d={ic.sparkle} s={12} /> Watch
            </button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.surface, color: c.textSec, border: `1px solid ${c.border}` }}>
              + Watchlist
            </button>
          </div>
        </div>

        {/* Trending Now */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: c.text }}>Trending Now</p>
            <span className="text-[10px] cursor-pointer" style={{ color: c.accent }}>See All</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trending.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = c.cardAlt)}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.purpleSoft, color: m.color }}>
                  <I d={ic.film} s={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: c.text }}>{m.name}</p>
                  <p className="text-[9px]" style={{ color: c.textMuted }}>{m.genre} · {m.year}</p>
                </div>
                <span className="text-[10px] font-medium" style={{ color: c.warning }}>★ {m.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: c.text }}>Top Rated</p>
            <span className="text-[10px] cursor-pointer" style={{ color: c.accent }}>See All</span>
          </div>
          <div className="space-y-1.5">
            {topRated.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors" style={{ background: c.cardAlt }}
                onMouseEnter={(e) => (e.currentTarget.style.background = c.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = c.cardAlt)}>
                <span className="text-xs font-medium w-4 text-center" style={{ color: c.textMuted }}>{i + 1}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.purpleSoft, color: c.purple }}>
                  <I d={ic.film} s={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: c.text }}>{m.name}</p>
                  <p className="text-[9px]" style={{ color: c.textMuted }}>{m.genre} · {m.year}</p>
                </div>
                <span className="text-[10px] font-medium" style={{ color: c.warning }}>★ {m.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
