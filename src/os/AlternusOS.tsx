import { useEffect, useRef } from "react";
import { palette } from "./theme";
import { I, ic } from "./icons";
import { useOSStore, openWinWithAI, closeWinWithAI, handleDesktopSearch } from "./store";
import type { WinId } from "./types";
import { AppWindow } from "../components/window/AppWindow";
import { BootScreen } from "../components/desktop/BootScreen";
import { LockScreen } from "../components/desktop/LockScreen";

// Apps
import { AIChat } from "../components/apps/AIChat";
import { TerminalApp } from "../components/apps/TerminalApp";
import { CodeApp } from "../components/apps/CodeApp";
import { FilesApp } from "../components/apps/FilesApp";
import { SettingsApp } from "../components/apps/SettingsApp";
import { MusicApp } from "../components/apps/MusicApp";
import { WeatherApp } from "../components/apps/WeatherApp";
import { CalendarApp } from "../components/apps/CalendarApp";
import { NotesApp } from "../components/apps/NotesApp";
import { BrowserApp } from "../components/apps/BrowserApp";
import { WordApp } from "../components/apps/WordApp";
import { StoreApp } from "../components/apps/StoreApp";
import { MoviesApp } from "../components/apps/MoviesApp";

function fmt(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function AlternusOS() {
  const store = useOSStore();
  const c = palette[store.mode];
  const lastMouseMove = useRef(Date.now());

  // Clock
  useEffect(() => {
    const iv = setInterval(() => store.setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Boot animation
  useEffect(() => {
    if (!store.isBooting) return;
    store.setBootPhase("bios");
    store.setBootProgress(0);
    const start = Date.now();
    const duration = 4500;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      store.setBootProgress(progress);
      if (progress < 0.15) store.setBootPhase("bios");
      else if (progress < 0.35) store.setBootPhase("hardware");
      else if (progress < 0.6) store.setBootPhase("kernel");
      else if (progress < 0.85) store.setBootPhase("services");
      else if (progress < 1) store.setBootPhase("desktop");
      else store.setBootPhase("done");
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => store.setIsBooting(false), 400);
      }
    };
    requestAnimationFrame(animate);
  }, [store.isBooting]);

  // AI Adaptive Authentication
  useEffect(() => {
    if (store.isLocked || store.isBooting) return;
    const hour = new Date().getHours();
    if (hour >= 1 && hour <= 5) {
      const timer = setTimeout(() => {
        if (!store.smartDND) {
          store.addAINotification("security", "Adaptive Security", `It's ${hour}:${new Date().getMinutes().toString().padStart(2, "0")} AM. Unusual activity detected. AI is monitoring this session.`, ic.shield);
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [store.isLocked, store.isBooting]);

  // Smart DND
  useEffect(() => {
    if (store.isLocked || store.isBooting) return;
    const handler = () => { lastMouseMove.current = Date.now(); };
    window.addEventListener("mousemove", handler);
    const interval = setInterval(() => {
      const idle = Date.now() - lastMouseMove.current;
      if (idle > 30000 && !store.smartDND) {
        store.setSmartDND(true);
        store.addAINotification("system", "Focus Mode", "AI detected you're focused. Do Not Disturb enabled. All non-critical notifications paused.", ic.shield);
      } else if (idle < 5000 && store.smartDND) {
        store.setSmartDND(false);
      }
    }, 10000);
    return () => { window.removeEventListener("mousemove", handler); clearInterval(interval); };
  }, [store.isLocked, store.isBooting, store.smartDND]);

  // Alt+Tab
  useEffect(() => {
    const openWins = store.wins.filter((w) => w.isOpen && !w.isMinimized);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        if (openWins.length === 0) return;
        if (!store.showTaskSwitcher) {
          store.setShowTaskSwitcher(true);
          store.setTaskSwitcherIdx(0);
        } else {
          store.setTaskSwitcherIdx((store.taskSwitcherIdx + 1) % openWins.length);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt" && store.showTaskSwitcher) {
        store.setShowTaskSwitcher(false);
        const openW = store.wins.filter((w) => w.isOpen && !w.isMinimized);
        if (openW[store.taskSwitcherIdx]) {
          store.focusWin(openW[store.taskSwitcherIdx].id);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("keyup", handleKeyUp); };
  }, [store.wins, store.showTaskSwitcher, store.taskSwitcherIdx]);

  // Win content map
  const winContent: Record<WinId, React.ReactNode> = {
    ai: <AIChat c={c} />,
    terminal: <TerminalApp c={c} />,
    code: <CodeApp c={c} />,
    files: <FilesApp c={c} onOpenApp={store.openWin} />,
    settings: <SettingsApp c={c} mode={store.mode} setMode={store.setMode} />,
    music: <MusicApp c={c} />,
    weather: <WeatherApp c={c} />,
    calendar: <CalendarApp c={c} />,
    notes: <NotesApp c={c} />,
    browser: <BrowserApp c={c} />,
    word: <WordApp c={c} />,
    store: <StoreApp c={c} />,
    movies: <MoviesApp c={c} />,
  };

  const dockApps: { id: WinId; icon: string; label: string; color: string }[] = [
    { id: "terminal", icon: ic.terminal, label: "Terminal", color: c.success },
    { id: "code", icon: ic.code, label: "Code", color: c.purple },
    { id: "files", icon: ic.folder, label: "Files", color: c.warning },
    { id: "browser", icon: ic.globe, label: "Browser", color: c.accentText },
    { id: "store", icon: ic.store, label: "Store", color: c.accent },
    { id: "movies", icon: ic.film, label: "Movies", color: c.purple },
    { id: "music", icon: ic.music, label: "Music", color: "#F472B6" },
    { id: "calendar", icon: ic.calendar, label: "Calendar", color: "#60A5FA" },
    { id: "weather", icon: ic.cloud, label: "Weather", color: "#22D3EE" },
    { id: "word", icon: ic.fileText, label: "Word", color: c.accentText },
    { id: "notes", icon: ic.note, label: "Notes", color: "#FBBF24" },
    { id: "settings", icon: ic.settings, label: "Settings", color: c.textSec },
  ];

  // ━━━━ BOOT SCREEN ━━━━
  if (store.isBooting) {
    return <BootScreen bootProgress={store.bootProgress} bootPhase={store.bootPhase} />;
  }

  // ━━━━ LOCK SCREEN ━━━━
  if (store.isLocked) {
    return <LockScreen c={c} time={store.time} onUnlock={() => store.setIsLocked(false)} />;
  }

  // ━━━━ DESKTOP ━━━━
  return (
    <div style={{ background: c.bg }} className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-9 flex-shrink-0" style={{ background: c.surface, borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-2">
          <span style={{ color: c.text }} className="text-[11px] font-bold tracking-wider">ALTERNUS</span>
          <span style={{ color: c.textMuted }} className="text-[10px]">OS</span>
        </div>
        <span style={{ color: c.textSec }} className="text-xs font-medium">{fmt(store.time)} · {store.time.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        <div className="flex items-center gap-1">
          {(() => { const ic_ = store.mode === "dark" ? "#FFFFFF" : "#444444"; return (<>
            <button onClick={() => store.openWin("browser")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.globe} s={13} /></button>
            <button onClick={() => store.openWin("settings")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.settings} s={13} /></button>
            <button onClick={() => store.openWin("code")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.code} s={13} /></button>
            <button onClick={() => store.openWin("terminal")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.terminal} s={13} /></button>
            <button onClick={() => store.openWin("weather")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.cloud} s={13} /></button>
            <button onClick={() => store.openWin("calendar")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.calendar} s={13} /></button>
            <button onClick={() => store.openWin("store")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.store} s={13} /></button>
            <button onClick={() => store.openWin("movies")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}><I d={ic.film} s={13} /></button>
            <div className="w-px h-4 mx-1" style={{ background: c.border }} />
            <button onClick={() => store.setShowNotifications(!store.showNotifications)} className="p-1.5 rounded-md hover:opacity-70 transition-opacity relative" style={{ color: ic_ }}>
              <I d={ic.bell} s={13} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: c.danger }} />
            </button>
            <span className="p-1.5" style={{ color: ic_ }}><I d={ic.wifi} s={13} /></span>
            <button onClick={() => store.setMode(store.mode === "dark" ? "light" : "dark")} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}>
              <I d={store.mode === "dark" ? ic.sun : ic.moon} s={13} />
            </button>
            <div className="w-px h-4 mx-1" style={{ background: c.border }} />
            <button onClick={() => store.setIsLocked(true)} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}>
              <I d={ic.user} s={13} />
            </button>
            <button onClick={() => { store.setIsBooting(true); store.setIsLocked(true); }} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: ic_ }}>
              <I d={ic.power} s={13} />
            </button>
          </>); })()}
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Apps button */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center">
          <button
            onClick={() => store.setShowApps(!store.showApps)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: store.showApps ? c.accent : c.surface,
              border: `1px solid ${store.showApps ? c.accent : c.border}`,
              color: store.showApps ? "#fff" : c.textSec,
            }}
            onMouseEnter={(e) => { if (!store.showApps) { e.currentTarget.style.background = c.accent; e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.color = "#fff"; } }}
            onMouseLeave={(e) => { if (!store.showApps) { e.currentTarget.style.background = c.surface; e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSec; } }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: store.showApps ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <div className="mt-3 overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: store.showApps ? 100 : 0, opacity: store.showApps ? 1 : 0 }}>
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl overflow-x-auto"
              style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: store.mode === "dark" ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.1)", scrollbarWidth: "none" }}
              onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}>
              {dockApps.map((app) => (
                <button key={app.id} onClick={() => { openWinWithAI(app.id); store.setShowApps(false); }}
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = c.accent; e.currentTarget.style.borderColor = c.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = c.cardAlt; e.currentTarget.style.borderColor = c.border; }}>
                  <I d={app.icon} s={20} c={app.color} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center branding + AI Search */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[0]">
          <h1
            style={{
              fontSize: "clamp(5rem, 10vw, 9rem)",
              fontWeight: 600,
              marginBottom: 16,
              userSelect: "none",
              backgroundImage: `linear-gradient(90deg, ${c.textMuted} 0%, ${c.text} 50%, ${c.textMuted} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              lineHeight: 1,
            }}>
            Alternus<span style={{ fontSize: "1.25rem", verticalAlign: "super", WebkitTextFillColor: c.textMuted }}>&copy;</span>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, marginBottom: 40, color: c.textSec }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}. What would you like to create today?
          </p>
          <div style={{ width: "100%", maxWidth: 672, padding: "0 16px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 20,
              paddingRight: 8,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 16,
              background: c.surface,
              border: `1px solid ${c.border}`,
              boxShadow: store.mode === "dark" ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(0,0,0,0.08)",
            }}>
              <I d={ic.search} s={20} c={c.textMuted} />
              <input
                style={{ flex: 1, background: "transparent", outline: "none", fontSize: 16, padding: "8px 0", color: c.text, border: "none" }}
                placeholder="Search or ask AI anything..."
                value={store.aiInput} onChange={(e) => store.setAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && store.aiInput.trim()) handleDesktopSearch(); }} />
              <button onClick={() => store.aiInput.trim() && handleDesktopSearch()}
                style={{ padding: "10px 20px", borderRadius: 12, background: c.accent, border: "none", cursor: "pointer" }}>
                <I d={ic.send} s={16} c="#fff" />
              </button>
            </div>
            {store.aiResponse && (
              <div className="mt-3 px-5 py-4 rounded-2xl text-[13px] leading-relaxed"
                style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.text, boxShadow: store.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.06)" }}>
                <pre className="whitespace-pre-wrap font-sans">{store.aiResponse}</pre>
                {store.aiActions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {store.aiActions.map((a, i) => (
                      <button key={i} onClick={() => { store.openWin(a.action); store.setAiResponse(null); store.setAiActions([]); store.setAiInput(""); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80" style={{ background: c.accentSoft, color: c.accentText }}>{a.label}</button>
                    ))}
                    <button onClick={() => { store.setAiResponse(null); store.setAiActions([]); }}
                      className="px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ color: c.textMuted }}>Dismiss</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Windows */}
        {store.wins.map((w) => (
          <AppWindow key={w.id} win={w} c={c}
            onClose={() => closeWinWithAI(w.id)}
            onMinimize={() => store.minimizeWin(w.id)}
            onMaximize={() => store.maximizeWin(w.id)}
            onFocus={() => store.focusWin(w.id)}
            onMove={(x, y) => store.moveWin(w.id, x, y)}
            onResize={(nw, nh) => store.resizeWin(w.id, nw, nh)}
            onSnap={(side) => store.snapWin(w.id, side)}
            onForceQuit={() => store.forceQuitWin(w.id)}>
            {winContent[w.id]}
          </AppWindow>
        ))}

        {/* Alt+Tab Task Switcher */}
        {store.showTaskSwitcher && (() => {
          const openW = store.wins.filter((w) => w.isOpen && !w.isMinimized);
          if (openW.length === 0) return null;
          return (
            <div className="absolute inset-0 flex items-center justify-center z-[200]" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="flex gap-3 px-6 py-4 rounded-2xl" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
                {openW.map((w, i) => (
                  <div key={w.id} className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all"
                    style={{ background: i === store.taskSwitcherIdx ? c.accentSoft : "transparent", border: i === store.taskSwitcherIdx ? `2px solid ${c.accent}` : "2px solid transparent" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.cardAlt }}>
                      <I d={(ic as Record<string, string>)[w.id] || ic.sparkle} s={22} c={i === store.taskSwitcherIdx ? c.accentText : c.textSec} />
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: i === store.taskSwitcherIdx ? c.accentText : c.textMuted }}>{w.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* System Modal */}
        {store.systemModal && (
          <div className="absolute inset-0 flex items-center justify-center z-[300]" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="w-80 p-5 rounded-2xl" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: store.systemModal.type === "error" ? "rgba(239,68,68,0.15)" : store.systemModal.type === "warning" ? c.warningSoft : c.accentSoft }}>
                  <I d={store.systemModal.type === "error" ? ic.alertTriangle : store.systemModal.type === "warning" ? ic.alertTriangle : ic.shield} s={20} c={store.systemModal.type === "error" ? c.danger : store.systemModal.type === "warning" ? c.warning : c.accentText} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: c.text }}>{store.systemModal.title}</p>
                  <p className="text-xs" style={{ color: c.textMuted }}>{store.systemModal.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => store.setSystemModal(null)} className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.accent, color: "#fff" }}>OK</button>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestion Bar */}
        {store.aiSuggestion && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: c.surface, border: `1px solid ${c.accent}`, boxShadow: "0 4px 24px rgba(59,130,246,0.2)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.accentSoft }}><I d={ic.sparkle} s={16} c={c.accentText} /></div>
            <p className="text-xs" style={{ color: c.text }}>{store.aiSuggestion.message}</p>
            <div className="flex gap-2 ml-2">
              {store.aiSuggestion.actions.map((a, i) => (
                <button key={i} onClick={a.action} className="px-3 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap"
                  style={{ background: i === 0 ? c.accent : c.cardAlt, color: i === 0 ? "#fff" : c.text }}>{a.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Action Chain Dialog */}
        {store.closeChain && (
          <div className="absolute inset-0 flex items-center justify-center z-[300]" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="w-96 p-5 rounded-2xl" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.accentSoft }}><I d={ic.sparkle} s={20} c={c.accentText} /></div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: c.text }}>AI: Closing {store.closeChain.title}</p>
                  <p className="text-xs" style={{ color: c.textMuted }}>I've auto-saved your changes.</p>
                </div>
              </div>
              <p className="text-xs mb-4 px-1" style={{ color: c.textSec }}>Want me to open a related app or perform any other action?</p>
              <div className="flex gap-2">
                <button onClick={() => { store.closeWin(store.closeChain!.appId); store.addTimelineEvent("Closed (saved)", store.closeChain!.appId, ic.close); store.setCloseChain(null); }} className="px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.accent, color: "#fff" }}>Save & Close</button>
                <button onClick={() => { store.closeWin(store.closeChain!.appId); store.addTimelineEvent("Closed (no save)", store.closeChain!.appId, ic.close); store.setCloseChain(null); }} className="px-4 py-1.5 rounded-lg text-xs" style={{ background: c.cardAlt, color: c.text }}>Close Without Saving</button>
                <button onClick={() => store.setCloseChain(null)} className="px-4 py-1.5 rounded-lg text-xs" style={{ color: c.textMuted }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Unified Timeline Panel */}
        {store.showTimeline && (
          <div className="absolute inset-0 flex items-center justify-center z-[250]" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="w-[400px] max-h-[500px] rounded-2xl flex flex-col" style={{ background: c.surface, border: `1px solid ${c.border}`, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center justify-between px-5 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2"><I d={ic.refresh} s={16} c={c.accentText} /><p className="text-sm font-semibold" style={{ color: c.text }}>Unified Timeline</p></div>
                <button onClick={() => store.setShowTimeline(false)} className="p-1 rounded-md" style={{ color: c.textMuted }}><I d={ic.close} s={14} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {store.timeline.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: c.textMuted }}>No activity recorded yet. Start using apps to see your timeline.</p>
                ) : store.timeline.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: i === 0 ? c.accentSoft : "transparent" }}>
                    <span className="text-[10px] font-mono w-10 flex-shrink-0" style={{ color: c.textMuted }}>{ev.time}</span>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: c.cardAlt }}><I d={ev.icon} s={12} c={c.textSec} /></div>
                    <span className="text-xs" style={{ color: c.text }}>{ev.action} <span style={{ color: c.accentText }}>{ev.app}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Notification Sidebar */}
        <div className="absolute top-0 right-0 h-full z-[100] transition-transform duration-300 ease-in-out"
          style={{
            width: 340,
            transform: store.showNotifications ? "translateX(0)" : "translateX(100%)",
            background: c.surface,
            borderLeft: `1px solid ${c.border}`,
            boxShadow: store.showNotifications ? (store.mode === "dark" ? "-4px 0 20px rgba(0,0,0,0.4)" : "-4px 0 20px rgba(0,0,0,0.1)") : "none",
          }}>
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2">
              <I d={ic.sparkle} s={14} c={c.accentText} />
              <p className="text-sm font-semibold" style={{ color: c.text }}>Notifications</p>
              {store.smartDND && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: c.warningSoft, color: c.warning }}>DND</span>}
            </div>
            <div className="flex items-center gap-1">
              {store.aiNotifications.length > 3 && (
                <button onClick={() => {
                  const types = store.aiNotifications.reduce((a, n) => { a[n.type] = (a[n.type] || 0) + 1; return a; }, {} as Record<string, number>);
                  const sum = Object.entries(types).map(([t, cnt]) => `${cnt} ${t}`).join(", ");
                  store.setAiNotifications([{ id: "summary", title: "AI Summary", message: `You had ${store.aiNotifications.length} notifications: ${sum}. All caught up!`, icon: ic.sparkle, time: "Now", type: "summary", read: false }]);
                }} className="px-2 py-1 rounded-md text-[10px] font-medium hover:opacity-70 transition-opacity" style={{ color: c.accentText }}>Summarize</button>
              )}
              <button onClick={() => store.setShowNotifications(false)} className="p-1.5 rounded-md hover:opacity-70 transition-opacity" style={{ color: c.textMuted }}><I d={ic.close} s={14} /></button>
            </div>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto" style={{ height: "calc(100% - 52px)", scrollbarWidth: "none" }}>
            {store.aiNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                style={{ background: !n.read ? c.accentSoft : "transparent" }}
                onMouseEnter={(e) => { if (n.read) e.currentTarget.style.background = c.cardAlt; }}
                onMouseLeave={(e) => { if (n.read) e.currentTarget.style.background = "transparent"; }}
                onClick={() => { store.setAiNotifications((prev) => prev.map((p) => p.id === n.id ? { ...p, read: true } : p)); }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.type === "security" ? "rgba(239,68,68,0.15)" : n.type === "suggestion" ? c.accentSoft : c.cardAlt }}>
                  <I d={n.icon} s={14} c={n.type === "security" ? c.danger : n.type === "suggestion" ? c.accentText : c.textSec} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: c.text }}>{n.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.textMuted }}>{n.message}</p>
                  {n.actions && (
                    <div className="flex gap-1 mt-2">
                      {n.actions.map((a, j) => (
                        <button key={j} onClick={(e) => { e.stopPropagation(); store.openWin(a.handler as WinId); store.setAiNotifications((prev) => prev.filter((p) => p.id !== n.id)); }}
                          className="px-2 py-0.5 rounded text-[9px] font-medium" style={{ background: c.accent, color: "#fff" }}>{a.label}</button>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] mt-1" style={{ color: c.textMuted }}>{n.time}</p>
                </div>
              </div>
            ))}
            {[
              { title: "System Update", desc: "Alternus OS v1.1 is available", time: "2 min ago", icon: ic.settings },
              { title: "Welcome", desc: "Welcome to Alternus OS! Explore your new desktop.", time: "5 min ago", icon: ic.sparkle },
              { title: "Network", desc: "Connected to AlternusNet \u00b7 5GHz", time: "10 min ago", icon: ic.wifi },
            ].map((n, i) => (
              <div key={`sys-${i}`} className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: c.cardAlt }}>
                  <I d={n.icon} s={14} c={c.textSec} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: c.text }}>{n.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.textMuted }}>{n.desc}</p>
                  <p className="text-[9px] mt-1" style={{ color: c.textMuted }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
