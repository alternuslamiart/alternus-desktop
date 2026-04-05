import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

const topTabs = [
  { id: "featured", label: "Featured" },
  { id: "top", label: "Top" },
  { id: "myapps", label: "My Apps" },
  { id: "updates", label: "Updates", dot: true },
  { id: "settings", label: "Settings" },
];

const sidebarTabs = [
  { id: "discover", label: "Discover", icon: ic.sparkle },
  { id: "games", label: "Games", icon: ic.sparkle },
  { id: "apps", label: "Apps", icon: ic.monitor },
  { id: "categories", label: "Categories", icon: ic.settings },
];

const bestApps = [
  { name: "Alternus Paint", desc: "Digital art & illustration", icon: ic.fileText, color: "#FBBF24", price: "Free" },
  { name: "CloudSync Pro", desc: "Sync files across devices", icon: ic.cloud, color: "#34D399", price: "$4.99" },
  { name: "Alternus Chat", desc: "Encrypted messaging", icon: ic.sparkle, color: "#34D399", price: "Free" },
  { name: "MindMap AI", desc: "AI brainstorming tool", icon: ic.sparkle, color: "#A78BFA", price: "$2.99" },
  { name: "Pixel Quest", desc: "Retro platformer", icon: ic.sparkle, color: "#F87171", price: "Free" },
  { name: "Neural Racer", desc: "AI racing game", icon: ic.settings, color: "#60A5FA", price: "$9.99" },
];

const trendingApps = [
  { name: "Code Breaker", desc: "Logic puzzle game", icon: ic.lock, color: "#60A5FA", price: "Free" },
  { name: "Galaxy Wars", desc: "Space strategy", icon: ic.sparkle, color: "#FBBF24", price: "$5.99" },
  { name: "AlternusTV", desc: "Stream movies", icon: ic.film, color: "#F87171", price: "Free" },
  { name: "Alternus Photos", desc: "AI photo editor", icon: ic.monitor, color: "#A78BFA", price: "Free" },
];

function AppCard({ app, c }: { app: typeof bestApps[0]; c: ThemeColors }) {
  const isFree = app.price === "Free";
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
      onMouseEnter={(e) => (e.currentTarget.style.background = c.accentSoft)} onMouseLeave={(e) => (e.currentTarget.style.background = c.cardAlt)}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${app.color}22`, color: app.color }}>
        <I d={app.icon} s={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: c.text }}>{app.name}</p>
        <p className="text-[9px]" style={{ color: c.textMuted }}>{app.desc}</p>
      </div>
      <span className="text-[10px] font-medium px-3 py-1 rounded-full flex-shrink-0" style={{
        background: isFree ? c.accent : "transparent",
        color: isFree ? "#fff" : c.accent,
        border: isFree ? "none" : `1px solid ${c.accent}`,
      }}>
        {app.price}
      </span>
    </div>
  );
}

export function StoreApp({ c }: { c: ThemeColors }) {
  const [activeTopTab, setActiveTopTab] = useState("featured");
  const [activeSideTab, setActiveSideTab] = useState("discover");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top tabs + search */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0" style={{ borderColor: c.border }}>
        <div className="flex items-center gap-1">
          {topTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTopTab(tab.id)}
              className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors"
              style={{
                background: activeTopTab === tab.id ? c.danger : "transparent",
                color: activeTopTab === tab.id ? "#fff" : c.textSec,
              }}
            >
              {tab.label}
              {tab.dot && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: "#4ADE80" }} />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]" style={{ background: c.cardAlt, border: `1px solid ${c.border}`, color: c.textMuted }}>
          <I d={ic.search} s={12} />
          Search
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[130px] flex-shrink-0 p-3 space-y-1 border-r" style={{ borderColor: c.border }}>
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSideTab(tab.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: activeSideTab === tab.id ? c.accent : "transparent",
                color: activeSideTab === tab.id ? "#fff" : c.textSec,
              }}
            >
              <I d={tab.icon} s={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollbarWidth: "none" }}>
          {/* Best Apps and Games */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: c.text }}>Best Apps and Games</p>
              <span className="text-[10px] cursor-pointer" style={{ color: c.accent }}>See All</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {bestApps.map((app, i) => (
                <AppCard key={i} app={app} c={c} />
              ))}
            </div>
          </div>

          {/* Trending Now */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: c.text }}>Trending Now</p>
              <span className="text-[10px] cursor-pointer" style={{ color: c.accent }}>See All</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {trendingApps.map((app, i) => (
                <AppCard key={i} app={app} c={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
