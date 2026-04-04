import { create } from "zustand";
import type { ThemeMode, WinId, WinState, BootPhase, SystemModal, AINotification, TimelineEvent } from "./types";
import { ic } from "./icons";

const defaultWins: WinState[] = [
  { id: "ai", title: "Alternus AI", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 80, y: 40, w: 650, h: 480 },
  { id: "terminal", title: "Terminal", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 180, y: 50, w: 620, h: 420 },
  { id: "code", title: "Code Editor", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 120, y: 40, w: 720, h: 500 },
  { id: "files", title: "Files", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 250, y: 60, w: 520, h: 420 },
  { id: "settings", title: "Settings", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 150, y: 40, w: 680, h: 500 },
  { id: "music", title: "Music", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 280, y: 50, w: 380, h: 450 },
  { id: "weather", title: "Weather", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 350, y: 50, w: 400, h: 440 },
  { id: "calendar", title: "Calendar", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 400, y: 60, w: 380, h: 420 },
  { id: "notes", title: "Notes", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 200, y: 70, w: 500, h: 420 },
  { id: "browser", title: "Browser", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 100, y: 30, w: 780, h: 520 },
  { id: "store", title: "Store", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 160, y: 50, w: 620, h: 460 },
  { id: "movies", title: "Movies", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 180, y: 40, w: 650, h: 480 },
  { id: "word", title: "Alternus Word", isOpen: false, isMinimized: false, isMaximized: false, zIndex: 1, x: 80, y: 30, w: 760, h: 540 },
];

export const aiWorkspaceRules: Record<string, WinId[]> = {
  code: ["terminal", "browser"],
  word: ["browser", "notes"],
  terminal: ["code", "files"],
  browser: ["notes"],
};

export const aiContextualApps: Record<string, { combo: WinId[]; suggest: WinId; label: string }[]> = {
  snap: [
    { combo: ["word", "browser"], suggest: "ai", label: "Open AI Assistant for research?" },
    { combo: ["code", "terminal"], suggest: "browser", label: "Open docs browser?" },
    { combo: ["notes", "browser"], suggest: "word", label: "Open Word for formal writing?" },
    { combo: ["code", "browser"], suggest: "terminal", label: "Open Terminal for testing?" },
  ],
};

export const aiFileIndex = [
  { name: "Budget Report Q1.docx", path: "Documents", content: "budget expenses quarterly revenue financial analysis may june", tags: ["finance", "report"] },
  { name: "Project Proposal.docx", path: "Documents", content: "project proposal timeline milestones deliverables team allocation", tags: ["project", "proposal"] },
  { name: "Meeting Notes.md", path: "Documents", content: "meeting discussion decisions action items follow up team sync", tags: ["meeting", "notes"] },
  { name: "Invoice_March.pdf", path: "Documents", content: "invoice payment amount due billing march services rendered", tags: ["finance", "invoice"] },
  { name: "Contract_2025.pdf", path: "Documents", content: "contract agreement terms conditions parties obligations legal binding", tags: ["legal", "contract"] },
  { name: "Design System.fig", path: "Projects", content: "design system components colors typography spacing layout grid", tags: ["design", "ui"] },
  { name: "API Documentation.md", path: "Projects", content: "api endpoints authentication requests responses status codes", tags: ["dev", "api"] },
  { name: "Personal Notes.txt", path: "Documents", content: "personal ideas thoughts reminders goals new year resolution", tags: ["personal"] },
  { name: "Invoice_April.pdf", path: "Documents", content: "invoice payment billing april consulting hours rate total", tags: ["finance", "invoice"] },
  { name: "NDA_Agreement.pdf", path: "Documents", content: "non disclosure agreement confidential information parties nda", tags: ["legal", "contract"] },
];

interface OSStore {
  // Theme
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;

  // Time
  time: Date;
  setTime: (t: Date) => void;

  // Lock/Boot
  isLocked: boolean;
  setIsLocked: (v: boolean) => void;
  isBooting: boolean;
  setIsBooting: (v: boolean) => void;
  bootProgress: number;
  setBootProgress: (v: number) => void;
  bootPhase: BootPhase;
  setBootPhase: (v: BootPhase) => void;

  // Windows
  wins: WinState[];
  zCounter: number;
  openWin: (id: WinId) => void;
  closeWin: (id: WinId) => void;
  minimizeWin: (id: WinId) => void;
  maximizeWin: (id: WinId) => void;
  focusWin: (id: WinId) => void;
  moveWin: (id: WinId, x: number, y: number) => void;
  resizeWin: (id: WinId, w: number, h: number) => void;
  snapWin: (id: WinId, side: "left" | "right") => void;
  forceQuitWin: (id: WinId) => void;

  // UI panels
  showApps: boolean;
  setShowApps: (v: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  showTaskSwitcher: boolean;
  setShowTaskSwitcher: (v: boolean) => void;
  taskSwitcherIdx: number;
  setTaskSwitcherIdx: (v: number) => void;
  showTimeline: boolean;
  setShowTimeline: (v: boolean) => void;

  // System modal
  systemModal: SystemModal;
  setSystemModal: (m: SystemModal) => void;

  // AI search
  aiInput: string;
  setAiInput: (v: string) => void;
  aiResponse: string | null;
  setAiResponse: (v: string | null) => void;
  aiActions: { label: string; action: WinId }[];
  setAiActions: (v: { label: string; action: WinId }[]) => void;

  // AI features
  aiNotifications: AINotification[];
  addAINotification: (type: AINotification["type"], title: string, message: string, icon: string, actions?: AINotification["actions"]) => void;
  setAiNotifications: (v: AINotification[] | ((prev: AINotification[]) => AINotification[])) => void;
  aiSuggestion: { message: string; actions: { label: string; action: () => void }[] } | null;
  setAiSuggestion: (v: { message: string; actions: { label: string; action: () => void }[] } | null) => void;
  closeChain: { appId: WinId; title: string } | null;
  setCloseChain: (v: { appId: WinId; title: string } | null) => void;
  smartDND: boolean;
  setSmartDND: (v: boolean) => void;
  timeline: TimelineEvent[];
  addTimelineEvent: (action: string, app: string, icon: string) => void;
}

export const useOSStore = create<OSStore>((set) => ({
  // Theme
  mode: "dark",
  setMode: (m) => set({ mode: m }),

  // Time
  time: new Date(),
  setTime: (t) => set({ time: t }),

  // Lock/Boot
  isLocked: true,
  setIsLocked: (v) => set({ isLocked: v }),
  isBooting: true,
  setIsBooting: (v) => set({ isBooting: v }),
  bootProgress: 0,
  setBootProgress: (v) => set({ bootProgress: v }),
  bootPhase: "bios" as BootPhase,
  setBootPhase: (v) => set({ bootPhase: v }),

  // Windows
  wins: defaultWins,
  zCounter: 10,

  openWin: (id) => set((s) => {
    const z = s.zCounter + 1;
    return {
      zCounter: z,
      wins: s.wins.map((w) => {
        if (w.id === id) {
          if (!w.isOpen) return { ...w, isOpen: true, isMinimized: false, zIndex: z };
          if (w.isMinimized) return { ...w, isMinimized: false, zIndex: z };
          return { ...w, zIndex: z };
        }
        return w;
      }),
    };
  }),

  closeWin: (id) => set((s) => ({
    wins: s.wins.map((w) => w.id === id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w),
  })),

  minimizeWin: (id) => set((s) => ({
    wins: s.wins.map((w) => w.id === id ? { ...w, isMinimized: true } : w),
  })),

  maximizeWin: (id) => set((s) => ({
    wins: s.wins.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
  })),

  focusWin: (id) => set((s) => {
    const z = s.zCounter + 1;
    return {
      zCounter: z,
      wins: s.wins.map((w) => w.id === id ? { ...w, zIndex: z } : w),
    };
  }),

  moveWin: (id, x, y) => set((s) => ({
    wins: s.wins.map((w) => w.id === id ? { ...w, x, y } : w),
  })),

  resizeWin: (id, w, h) => set((s) => ({
    wins: s.wins.map((win) => win.id === id ? { ...win, w, h } : win),
  })),

  snapWin: (id, side) => {
    const hw = Math.floor(window.innerWidth / 2);
    const fh = window.innerHeight - 36;
    set((s) => ({
      wins: s.wins.map((w) => w.id === id ? { ...w, x: side === "left" ? 0 : hw, y: 0, w: hw, h: fh, isMaximized: false } : w),
    }));
  },

  forceQuitWin: (id) => set((s) => ({
    wins: s.wins.map((w) => w.id === id ? { ...w, isOpen: false, isFrozen: false, isMinimized: false, isMaximized: false } : w),
    systemModal: { type: "info" as const, title: "App Terminated", message: "The application was force quit successfully." },
  })),

  // UI panels
  showApps: false,
  setShowApps: (v) => set({ showApps: v }),
  showNotifications: false,
  setShowNotifications: (v) => set({ showNotifications: v }),
  showTaskSwitcher: false,
  setShowTaskSwitcher: (v) => set({ showTaskSwitcher: v }),
  taskSwitcherIdx: 0,
  setTaskSwitcherIdx: (v) => set({ taskSwitcherIdx: v }),
  showTimeline: false,
  setShowTimeline: (v) => set({ showTimeline: v }),

  // System modal
  systemModal: null,
  setSystemModal: (m) => set({ systemModal: m }),

  // AI search
  aiInput: "",
  setAiInput: (v) => set({ aiInput: v }),
  aiResponse: null,
  setAiResponse: (v) => set({ aiResponse: v }),
  aiActions: [],
  setAiActions: (v) => set({ aiActions: v }),

  // AI features
  aiNotifications: [],
  addAINotification: (type, title, message, icon, actions) => set((s) => {
    const notif: AINotification = {
      id: Date.now().toString(),
      title,
      message,
      icon,
      time: "Just now",
      type,
      actions,
      read: false,
    };
    return { aiNotifications: [notif, ...s.aiNotifications.slice(0, 19)] };
  }),
  setAiNotifications: (v) => set((s) => ({
    aiNotifications: typeof v === "function" ? v(s.aiNotifications) : v,
  })),

  aiSuggestion: null,
  setAiSuggestion: (v) => set({ aiSuggestion: v }),
  closeChain: null,
  setCloseChain: (v) => set({ closeChain: v }),
  smartDND: false,
  setSmartDND: (v) => set({ smartDND: v }),
  timeline: [],
  addTimelineEvent: (action, app, icon) => {
    const now = new Date();
    const t = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    set((s) => ({
      timeline: [{ time: t, action, app, icon }, ...s.timeline.slice(0, 49)],
    }));
  },
}));

// AI-powered open/close helpers
export function openWinWithAI(id: WinId) {
  const store = useOSStore.getState();
  store.openWin(id);
  store.addTimelineEvent("Opened", id, (ic as Record<string, string>)[id] || ic.sparkle);

  const related = aiWorkspaceRules[id];
  if (related) {
    const openIds = store.wins.filter((w) => w.isOpen).map((w) => w.id);
    const suggestions = related.filter((r) => !openIds.includes(r));
    if (suggestions.length > 0 && !store.smartDND) {
      setTimeout(() => {
        const s = useOSStore.getState();
        const names = suggestions.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" & ");
        s.setAiSuggestion({
          message: `AI: Opening ${id}. Want me to also open ${names}?`,
          actions: [
            { label: `Open ${names}`, action: () => { suggestions.forEach((s) => useOSStore.getState().openWin(s)); useOSStore.getState().setAiSuggestion(null); } },
            { label: "No thanks", action: () => useOSStore.getState().setAiSuggestion(null) },
          ],
        });
      }, 1500);
    }
  }

  // Contextual snapping
  const openApps = [...store.wins.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.id), id];
  for (const rule of aiContextualApps.snap) {
    if (rule.combo.every((cid) => openApps.includes(cid)) && !openApps.includes(rule.suggest)) {
      setTimeout(() => {
        const s = useOSStore.getState();
        if (!s.smartDND) s.addAINotification("suggestion", "Contextual Suggestion", rule.label, ic.sparkle, [{ label: `Open ${rule.suggest}`, handler: rule.suggest }]);
      }, 3000);
      break;
    }
  }
}

export function closeWinWithAI(id: WinId) {
  const store = useOSStore.getState();
  const win = store.wins.find((w) => w.id === id);
  if (!win || !win.isOpen) return;
  if (["word", "notes", "code"].includes(id) && !store.smartDND) {
    store.setCloseChain({ appId: id, title: win.title });
  } else {
    store.closeWin(id);
    store.addTimelineEvent("Closed", id, (ic as Record<string, string>)[id] || ic.sparkle);
  }
}

export function handleDesktopSearch() {
  const store = useOSStore.getState();
  const q = store.aiInput.trim().toLowerCase();
  if (!q) return;
  store.addTimelineEvent("Searched", `"${store.aiInput.trim()}"`, ic.search);

  const fileMatches = aiFileIndex.filter((f) =>
    f.content.split(" ").some((w) => q.includes(w)) || f.name.toLowerCase().includes(q) || f.tags.some((t) => q.includes(t))
  );
  if (fileMatches.length > 0) {
    const fileList = fileMatches.map((f) => `\u2022 ${f.name} (${f.path})`).join("\n");
    const tags = Array.from(new Set(fileMatches.flatMap((f) => f.tags)));
    const clusterInfo = tags.length > 0 ? `\n\nAI auto-grouped by: ${tags.join(", ")}` : "";
    store.setAiResponse(`AI found ${fileMatches.length} file${fileMatches.length > 1 ? "s" : ""} matching your search:\n\n${fileList}${clusterInfo}`);
    store.setAiActions([{ label: "Open Files", action: "files" }]);
    return;
  }

  if (q.includes("cleanup") || q.includes("clean") || q.includes("archive") || q.includes("unused")) {
    store.setAiResponse("AI Predictive Cleanup found:\n\n\u2022 design_old.fig \u2014 not opened in 6 months\n\u2022 backup_jan.zip \u2014 45 MB, created 8 months ago\n\u2022 draft_v1.docx \u2014 superseded by v3\n\nWant me to move these to Archive or delete them?");
    store.setAiActions([{ label: "Archive All", action: "files" }, { label: "Open Files", action: "files" }]);
    return;
  }

  if (q.includes("notification") || q.includes("summary") || q.includes("missed")) {
    const count = store.aiNotifications.length;
    const unread = store.aiNotifications.filter((n) => !n.read).length;
    const byType = store.aiNotifications.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    const summary = Object.entries(byType).map(([t, c]) => `${c} ${t}`).join(", ");
    store.setAiResponse(`AI Notification Summary:\n\nYou have ${count} notifications (${unread} unread).\nBreakdown: ${summary || "none"}.\n\nWant to see them all?`);
    store.setAiActions([]);
    store.setShowNotifications(true);
    return;
  }

  if (q.includes("timeline") || q.includes("history") || q.includes("activity")) {
    store.setShowTimeline(true);
    store.setAiResponse("Opening your Unified Timeline \u2014 a chronological view of all your actions.");
    store.setAiActions([]);
    return;
  }

  if (q.includes("file") || q.includes("document") || q.includes("folder")) {
    store.setAiResponse("I found your files. Would you like to open the file manager?");
    store.setAiActions([{ label: "Open Files", action: "files" }]);
  } else if (q.includes("code") || q.includes("edit") || q.includes("program")) {
    store.setAiResponse("Ready to code. I can open the code editor for you.");
    store.setAiActions([{ label: "Open Code Editor", action: "code" }]);
  } else if (q.includes("terminal") || q.includes("command") || q.includes("shell")) {
    store.setAiResponse("Opening terminal for command line access.");
    store.setAiActions([{ label: "Open Terminal", action: "terminal" }]);
  } else if (q.includes("browse") || q.includes("web") || q.includes("search") || q.includes("google")) {
    store.setAiResponse("I can open the browser for you. What would you like to search?");
    store.setAiActions([{ label: "Open Browser", action: "browser" }]);
  } else if (q.includes("music") || q.includes("song") || q.includes("play")) {
    store.setAiResponse("Let me open the music player for you.");
    store.setAiActions([{ label: "Open Music", action: "music" }]);
  } else if (q.includes("weather") || q.includes("temperature")) {
    store.setAiResponse("Currently 17\u00b0 and partly cloudy. Would you like more details?");
    store.setAiActions([{ label: "Open Weather", action: "weather" }]);
  } else if (q.includes("note") || q.includes("write") || q.includes("memo")) {
    store.setAiResponse("I can open Notes for you to start writing.");
    store.setAiActions([{ label: "Open Notes", action: "notes" }]);
  } else if (q.includes("setting") || q.includes("config") || q.includes("theme")) {
    store.setAiResponse("Opening settings. You can change theme, language, and more.");
    store.setAiActions([{ label: "Open Settings", action: "settings" }]);
  } else if (q.includes("calendar") || q.includes("date") || q.includes("schedule")) {
    store.setAiResponse(`Today is ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.`);
    store.setAiActions([{ label: "Open Calendar", action: "calendar" }]);
  } else if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    store.setAiResponse("Hello! I'm Alternus AI. I can open apps, find files by content, manage your workspace, and answer questions. Try: 'budget', 'cleanup', 'timeline'.");
    store.setAiActions([]);
  } else {
    store.setAiResponse(`AI searched for "${store.aiInput.trim()}" across files, apps, and system.\n\nNo exact matches found. Try:\n\u2022 Search by content: "budget", "invoice", "contract"\n\u2022 Predictive cleanup: "cleanup"\n\u2022 Activity timeline: "timeline"\n\u2022 Notification summary: "notifications"`);
    store.setAiActions([{ label: "Open Files", action: "files" }, { label: "Open Browser", action: "browser" }]);
  }
}
