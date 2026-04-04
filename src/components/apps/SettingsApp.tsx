import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";
import type { ThemeMode } from "../../os/types";

function Toggle({ on, onToggle, c }: { on: boolean; onToggle: () => void; c: ThemeColors }) {
  return (
    <button onClick={onToggle} className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors" style={{ background: on ? c.accent : c.cardAlt }}>
      <div className="w-4 h-4 rounded-full bg-white transition-all" style={{ marginLeft: on ? "18px" : "0px" }} />
    </button>
  );
}

export function SettingsApp({ c, mode, setMode }: { c: ThemeColors; mode: ThemeMode; setMode: (m: ThemeMode) => void }) {
  const [activeSection, setActiveSection] = useState("Network");
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);
  const [locOn, setLocOn] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [activeLang, setActiveLang] = useState(0);
  const [connectedNet, setConnectedNet] = useState(0);

  const items = [
    { icon: ic.wifi, label: "Network" },
    { icon: ic.bluetooth, label: "Bluetooth" },
    { icon: ic.user, label: "Account" },
    { icon: ic.bell, label: "Notifications" },
    { icon: ic.globe, label: "Language" },
    { icon: ic.moon, label: "Appearance" },
    { icon: ic.hdd, label: "Storage" },
    { icon: ic.battery, label: "Battery" },
    { icon: ic.shield, label: "Privacy" },
    { icon: ic.settings, label: "System" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Network":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div><p className="text-sm font-medium" style={{ color: c.text }}>Wi-Fi</p><p className="text-xs" style={{ color: c.textMuted }}>{wifiOn ? "Connected to AlternusNet \u00b7 5GHz" : "Disabled"}</p></div>
              <Toggle on={wifiOn} onToggle={() => setWifiOn(!wifiOn)} c={c} />
            </div>
            {wifiOn && (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium px-1 mb-2" style={{ color: c.textMuted }}>Available Networks</p>
                  {["AlternusNet", "Guest_WiFi", "Office_5G", "Neighbors_Net", "CafeHotspot"].map((net, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      style={{ background: i === connectedNet ? c.cardAlt : "transparent" }}
                      onClick={() => setConnectedNet(i)}
                      onMouseEnter={(e) => { if (i !== connectedNet) e.currentTarget.style.background = c.cardAlt; }}
                      onMouseLeave={(e) => { if (i !== connectedNet) e.currentTarget.style.background = "transparent"; }}>
                      <div className="flex items-center gap-4">
                        <I d={ic.wifi} s={16} c={i <= 2 ? c.textSec : c.textMuted} />
                        <div>
                          <span className="text-sm" style={{ color: c.text }}>{net}</span>
                          {i <= 2 && <p className="text-[9px]" style={{ color: c.textMuted }}>{i === 0 ? "5GHz \u00b7 Excellent" : i === 1 ? "2.4GHz \u00b7 Good" : "5GHz \u00b7 Fair"}</p>}
                        </div>
                      </div>
                      {i === connectedNet && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accentText }}>Connected</span>}
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <p className="text-xs font-medium px-1 mb-2" style={{ color: c.textMuted }}>Network Info</p>
                  {[{ l: "IP Address", v: "192.168.1.42" }, { l: "DNS", v: "1.1.1.1" }, { l: "Speed", v: "866 Mbps" }, { l: "Security", v: "WPA3" }].map((info, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg mb-1" style={{ background: c.cardAlt }}>
                      <span className="text-[10px]" style={{ color: c.textMuted }}>{info.l}</span>
                      <span className="text-[10px] font-medium" style={{ color: c.text }}>{info.v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case "Bluetooth":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div><p className="text-sm font-medium" style={{ color: c.text }}>Bluetooth</p><p className="text-xs" style={{ color: c.textMuted }}>{btOn ? "On \u00b7 2 devices connected" : "Disabled"}</p></div>
              <Toggle on={btOn} onToggle={() => setBtOn(!btOn)} c={c} />
            </div>
            {btOn && (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium px-1 mb-2" style={{ color: c.textMuted }}>Connected Devices</p>
                  {[{ name: "Alternus Keyboard", type: "Input", battery: 85 }, { name: "AirPods Pro", type: "Audio", battery: 62 }].map((dev, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                      <div className="flex items-center gap-4">
                        <I d={ic.bluetooth} s={16} c={c.accent} />
                        <div>
                          <span className="text-sm" style={{ color: c.text }}>{dev.name}</span>
                          <p className="text-[9px]" style={{ color: c.textMuted }}>{dev.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <I d={ic.battery} s={12} c={dev.battery > 50 ? c.success : c.warning} />
                          <span className="text-[10px]" style={{ color: c.textSec }}>{dev.battery}%</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accentText }}>Connected</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium px-1 mb-2" style={{ color: c.textMuted }}>Available Devices</p>
                  {["Magic Mouse", "JBL Speaker", "Samsung TV"].map((dev, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <div className="flex items-center gap-4">
                        <I d={ic.bluetooth} s={16} c={c.textMuted} />
                        <span className="text-sm" style={{ color: c.text }}>{dev}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full cursor-pointer" style={{ background: c.cardAlt, color: c.textSec }}>Pair</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case "Account":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex items-center gap-4 px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: c.accentSoft, color: c.accentText }}><I d={ic.user} s={32} /></div>
              <div>
                <p className="text-sm font-medium" style={{ color: c.text }}>Admin</p>
                <p className="text-xs" style={{ color: c.textMuted }}>admin@alternus.art</p>
                <p className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: c.accentSoft, color: c.accentText }}>Administrator</p>
              </div>
            </div>
            {[{ l: "Display Name", v: "Admin" }, { l: "Email", v: "admin@alternus.art" }, { l: "Role", v: "Administrator" }, { l: "Created", v: "January 15, 2025" }, { l: "Last Login", v: "Today at 03:06" }].map((f, i) => (
              <div key={i} className="px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                <p className="text-[10px] mb-1" style={{ color: c.textMuted }}>{f.l}</p>
                <p className="text-sm" style={{ color: c.text }}>{f.v}</p>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-xs font-medium" style={{ background: c.cardAlt, color: c.text }}>Edit Profile</button>
              <button className="flex-1 py-2.5 rounded-xl text-xs font-medium" style={{ background: c.cardAlt, color: c.danger }}>Sign Out</button>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div><p className="text-sm font-medium" style={{ color: c.text }}>Do Not Disturb</p><p className="text-xs" style={{ color: c.textMuted }}>{dndOn ? "All notifications muted" : "Notifications enabled"}</p></div>
              <Toggle on={dndOn} onToggle={() => setDndOn(!dndOn)} c={c} />
            </div>
            <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>App Notifications</p>
            {[{ app: "AI Assistant", icon: ic.sparkle, on: true }, { app: "Calendar", icon: ic.calendar, on: true }, { app: "Browser", icon: ic.globe, on: false }, { app: "Music", icon: ic.music, on: false }, { app: "System Updates", icon: ic.refresh, on: true }].map((n, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                <div className="flex items-center gap-4">
                  <I d={n.icon} s={16} c={c.textSec} />
                  <span className="text-sm" style={{ color: c.text }}>{n.app}</span>
                </div>
                <div className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors" style={{ background: n.on ? c.accent : c.cardAlt, border: n.on ? "none" : `1px solid ${c.border}` }}>
                  <div className="w-4 h-4 rounded-full bg-white transition-all" style={{ marginLeft: n.on ? "18px" : "0px" }} />
                </div>
              </div>
            ))}
          </div>
        );
      case "Language":
        return (
          <div className="px-4 py-3 space-y-1 overflow-y-auto h-full">
            <p className="text-xs font-medium px-1 mb-3" style={{ color: c.textMuted }}>Select Language</p>
            {["English (US)", "Shqip", "Deutsch", "Fran\u00e7ais", "Espa\u00f1ol", "Italiano", "Portugu\u00eas", "\u4e2d\u6587", "\u65e5\u672c\u8a9e", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "\ud55c\uad6d\uc5b4", "T\u00fcrk\u00e7e"].map((lang, i) => (
              <button key={i} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors"
                onClick={() => setActiveLang(i)}
                style={{ background: activeLang === i ? c.accentSoft : "transparent" }}
                onMouseEnter={(e) => { if (activeLang !== i) e.currentTarget.style.background = c.cardAlt; }}
                onMouseLeave={(e) => { if (activeLang !== i) e.currentTarget.style.background = "transparent"; }}>
                <span className="text-sm" style={{ color: activeLang === i ? c.accentText : c.text }}>{lang}</span>
                {activeLang === i && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accentText }}>Active</span>}
              </button>
            ))}
          </div>
        );
      case "Appearance":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>Theme</p>
            <div className="flex gap-3">
              {(["dark", "light"] as ThemeMode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} className="flex-1 p-4 rounded-xl text-center transition-all"
                  style={{ background: mode === m ? c.accentSoft : c.cardAlt, border: `2px solid ${mode === m ? c.accent : "transparent"}` }}>
                  <I d={m === "dark" ? ic.moon : ic.sun} s={24} c={mode === m ? c.accentText : c.textSec} />
                  <p className="text-xs mt-2 capitalize" style={{ color: mode === m ? c.accentText : c.text }}>{m}</p>
                </button>
              ))}
            </div>
            <p className="text-xs font-medium px-1 mt-4" style={{ color: c.textMuted }}>Accent Color</p>
            <div className="flex gap-2 px-1">
              {["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"].map((col) => (
                <div key={col} className="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110" style={{ background: col, border: col === c.accent ? "3px solid " + c.text : "3px solid transparent" }} />
              ))}
            </div>
            <p className="text-xs font-medium px-1 mt-4" style={{ color: c.textMuted }}>Wallpaper</p>
            <div className="grid grid-cols-3 gap-2">
              {["#1a1a2e", "#16213e", "#0f3460", "#242424", "#1b1b2f", "#162447"].map((col, i) => (
                <div key={i} className="h-16 rounded-xl cursor-pointer transition-transform hover:scale-105" style={{ background: col, border: i === 3 ? `2px solid ${c.accent}` : "2px solid transparent" }} />
              ))}
            </div>
            <p className="text-xs font-medium px-1 mt-4" style={{ color: c.textMuted }}>Font Size</p>
            <div className="flex gap-2">
              {["Small", "Medium", "Large"].map((s, i) => (
                <button key={s} className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: i === 1 ? c.accentSoft : c.cardAlt, color: i === 1 ? c.accentText : c.textSec, border: i === 1 ? `1px solid ${c.accent}` : "1px solid transparent" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      case "Storage":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="p-4 rounded-xl" style={{ background: c.cardAlt }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: c.text }}>Internal Storage</p>
                <p className="text-xs" style={{ color: c.textMuted }}>278 GB / 512 GB used</p>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: c.border }}>
                <div style={{ width: "30%", background: c.accent }} />
                <div style={{ width: "15%", background: c.purple }} />
                <div style={{ width: "8%", background: c.warning }} />
                <div style={{ width: "2%", background: c.danger }} />
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {[{ label: "Apps", color: c.accent, size: "154 GB" }, { label: "Media", color: c.purple, size: "77 GB" }, { label: "Documents", color: c.warning, size: "41 GB" }, { label: "Other", color: c.danger, size: "6 GB" }].map((cat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                    <span className="text-[10px]" style={{ color: c.textSec }}>{cat.label} \u00b7 {cat.size}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>Storage Breakdown</p>
            {[{ name: "Applications", size: "154 GB", icon: ic.store }, { name: "Photos & Videos", size: "52 GB", icon: ic.film }, { name: "Music", size: "25 GB", icon: ic.music }, { name: "Documents", size: "41 GB", icon: ic.fileText }, { name: "System", size: "12 GB", icon: ic.settings }, { name: "Cache", size: "3.2 GB", icon: ic.refresh }].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                <div className="flex items-center gap-4">
                  <I d={item.icon} s={16} c={c.textSec} />
                  <span className="text-sm" style={{ color: c.text }}>{item.name}</span>
                </div>
                <span className="text-xs" style={{ color: c.textMuted }}>{item.size}</span>
              </div>
            ))}
          </div>
        );
      case "Battery":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="p-4 rounded-xl text-center" style={{ background: c.cardAlt }}>
              <p className="text-4xl font-bold mb-1" style={{ color: c.success }}>87%</p>
              <p className="text-xs" style={{ color: c.textMuted }}>Estimated 6h 42m remaining</p>
              <div className="h-2 rounded-full mt-3 overflow-hidden" style={{ background: c.border }}>
                <div className="h-full rounded-full" style={{ width: "87%", background: c.success }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-3 rounded-xl text-xs font-medium text-center" style={{ background: c.cardAlt, color: c.text }}>Power Saver</button>
              <button className="flex-1 py-3 rounded-xl text-xs font-medium text-center" style={{ background: c.accentSoft, color: c.accentText, border: `1px solid ${c.accent}` }}>Balanced</button>
              <button className="flex-1 py-3 rounded-xl text-xs font-medium text-center" style={{ background: c.cardAlt, color: c.text }}>Performance</button>
            </div>
            <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>Battery Usage</p>
            {[{ app: "Browser", pct: 34, icon: ic.globe }, { app: "Code Editor", pct: 22, icon: ic.code }, { app: "AI Assistant", pct: 18, icon: ic.sparkle }, { app: "Display", pct: 15, icon: ic.monitor }, { app: "System", pct: 11, icon: ic.settings }].map((item, i) => (
              <div key={i} className="px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2"><I d={item.icon} s={14} c={c.textSec} /><span className="text-xs" style={{ color: c.text }}>{item.app}</span></div>
                  <span className="text-xs" style={{ color: c.textMuted }}>{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: c.border }}>
                  <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: c.accent }} />
                </div>
              </div>
            ))}
          </div>
        );
      case "Privacy":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div><p className="text-sm font-medium" style={{ color: c.text }}>Location Services</p><p className="text-xs" style={{ color: c.textMuted }}>{locOn ? "Enabled for 3 apps" : "Disabled"}</p></div>
              <Toggle on={locOn} onToggle={() => setLocOn(!locOn)} c={c} />
            </div>
            <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>App Permissions</p>
            {[{ app: "Browser", perms: ["Camera", "Location", "Mic"] }, { app: "AI Assistant", perms: ["Files", "Mic"] }, { app: "Weather", perms: ["Location"] }, { app: "Music", perms: ["Storage"] }].map((item, i) => (
              <div key={i} className="px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: c.text }}>{item.app}</span>
                  <span className="text-[10px]" style={{ color: c.textMuted }}>{item.perms.length} permissions</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {item.perms.map((p) => (
                    <span key={p} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: c.accentSoft, color: c.accentText }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-medium px-1" style={{ color: c.textMuted }}>Security</p>
              {[{ l: "Firewall", v: "Active" }, { l: "Encryption", v: "AES-256" }, { l: "Last Scan", v: "Today, 02:14" }, { l: "Threats Found", v: "0" }].map((info, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: c.cardAlt }}>
                  <span className="text-[10px]" style={{ color: c.textMuted }}>{info.l}</span>
                  <span className="text-[10px] font-medium" style={{ color: info.l === "Threats Found" ? c.success : c.text }}>{info.v}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "System":
        return (
          <div className="px-4 py-3 space-y-3 overflow-y-auto h-full">
            <div className="flex gap-2">
              {[{ icon: ic.wifi, label: "Wi-Fi", active: wifiOn }, { icon: ic.bluetooth, label: "Bluetooth", active: btOn }, { icon: ic.moon, label: "Night", active: false }, { icon: ic.sun, label: "Bright", active: false }].map((t, i) => (
                <button key={i} className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
                  style={{ background: t.active ? c.accent : c.cardAlt, color: t.active ? "#fff" : c.textSec }}>
                  <I d={t.icon} s={18} />
                  <span className="text-[9px] font-medium">{t.label}</span>
                </button>
              ))}
            </div>
            {[{ label: "Sound", icon: ic.volume, value: 72 }, { label: "Display", icon: ic.monitor, value: 85 }, { label: "Microphone", icon: ic.mic, value: 60 }, { label: "Mouse", icon: ic.mouse, value: 50 }].map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <I d={s.icon} s={13} c={c.textMuted} />
                  <span className="text-xs" style={{ color: c.textSec }}>{s.label}</span>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: c.cardAlt }}>
                  <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${s.value}%`, background: i === 3 ? `linear-gradient(90deg, ${c.accent}, ${c.purple}, ${c.warning}, ${c.danger})` : c.accent }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2" style={{ left: `calc(${s.value}% - 7px)`, background: c.surface, borderColor: i === 3 ? c.danger : c.accent }} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2 rounded-xl" style={{ background: c.cardAlt }}>
              <div><p className="text-sm font-medium" style={{ color: c.text }}>Auto Updates</p><p className="text-xs" style={{ color: c.textMuted }}>{autoUpdate ? "Keep system up to date" : "Manual updates only"}</p></div>
              <Toggle on={autoUpdate} onToggle={() => setAutoUpdate(!autoUpdate)} c={c} />
            </div>
            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-medium px-1" style={{ color: c.textMuted }}>System Info</p>
              {[{ l: "OS Version", v: "Alternus OS v1.0" }, { l: "Kernel", v: "AlternusKernel 6.2" }, { l: "CPU", v: "AlternusCPU 12-Core" }, { l: "GPU", v: "AlternusGPU Pro 16GB" }, { l: "Memory", v: "16 GB DDR5" }, { l: "Storage", v: "512 GB \u2014 234 GB free" }, { l: "Uptime", v: "2h 14m" }].map((info, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: c.cardAlt }}>
                  <span className="text-[10px]" style={{ color: c.textMuted }}>{info.l}</span>
                  <span className="text-[10px] font-medium" style={{ color: c.text }}>{info.v}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[200px] flex-shrink-0 flex flex-col py-2 px-2 overflow-y-auto" style={{ borderRight: `1px solid ${c.border}`, scrollbarWidth: "none", msOverflowStyle: "none" as never }}>
        <p className="text-sm font-semibold px-4 mb-2 mt-1" style={{ color: c.accentText }}>Settings</p>
        {items.map((it, i) => (
          <button key={i} className="w-full flex items-center gap-4 px-4 py-2 rounded-xl text-left transition-colors mb-0.5"
            onClick={() => setActiveSection(it.label)}
            style={{ background: activeSection === it.label ? c.accentSoft : "transparent", minHeight: 40 }}
            onMouseEnter={(e) => { if (activeSection !== it.label) e.currentTarget.style.background = c.cardAlt; }}
            onMouseLeave={(e) => { if (activeSection !== it.label) e.currentTarget.style.background = "transparent"; }}>
            <I d={it.icon} s={16} c={activeSection === it.label ? c.accentText : c.textSec} />
            <span className="text-xs font-medium" style={{ color: activeSection === it.label ? c.accentText : c.text }}>{it.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
