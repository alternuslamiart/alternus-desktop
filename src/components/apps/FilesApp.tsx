import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";
import type { WinId } from "../../os/types";

export function FilesApp({ c, onOpenApp }: { c: ThemeColors; onOpenApp: (id: WinId) => void }) {
  const [currentPath, setCurrentPath] = useState("Home");
  const [fileContent, setFileContent] = useState<string | null>(null);

  const folders: Record<string, { name: string; icon: string; size: string; action?: WinId | string }[]> = {
    Home: [
      { name: "Documents", icon: "\uD83D\uDCC1", size: "12 items", action: "Documents" },
      { name: "Projects", icon: "\uD83D\uDCBC", size: "7 items", action: "Projects" },
      { name: "Images", icon: "\uD83D\uDDBC\uFE0F", size: "48 items", action: "Images" },
      { name: "Downloads", icon: "\uD83D\uDCE5", size: "23 items", action: "Downloads" },
      { name: "report.pdf", icon: "\uD83D\uDCC4", size: "2.4 MB", action: "file" },
      { name: "design.fig", icon: "\uD83C\uDFA8", size: "18 MB", action: "file" },
    ],
    Documents: [
      { name: "notes.md", icon: "\uD83D\uDCDD", size: "4 KB", action: "notes" },
      { name: "todo.txt", icon: "\uD83D\uDCC4", size: "1 KB", action: "file" },
      { name: "meeting-notes.md", icon: "\uD83D\uDCDD", size: "8 KB", action: "notes" },
    ],
    Projects: [
      { name: "alternus-os/", icon: "\uD83D\uDCC2", size: "24 files" },
      { name: "website/", icon: "\uD83D\uDCC2", size: "18 files" },
      { name: "README.md", icon: "\uD83D\uDCC4", size: "2 KB", action: "file" },
    ],
    Images: [
      { name: "screenshot.png", icon: "\uD83D\uDDBC\uFE0F", size: "1.2 MB" },
      { name: "logo.svg", icon: "\uD83C\uDFA8", size: "4 KB" },
      { name: "wallpaper.jpg", icon: "\uD83D\uDDBC\uFE0F", size: "3.8 MB" },
    ],
    Downloads: [
      { name: "installer.dmg", icon: "\uD83D\uDCBF", size: "120 MB" },
      { name: "archive.zip", icon: "\uD83D\uDCE6", size: "45 MB" },
      { name: "font-pack.zip", icon: "\uD83D\uDCE6", size: "12 MB" },
    ],
  };

  const currentFiles = folders[currentPath] || folders.Home;

  if (fileContent) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
          <button onClick={() => setFileContent(null)} className="p-1 rounded-md" style={{ color: c.textSec }}>
            <I d={ic.chevL} s={14} />
          </button>
          <span className="text-xs" style={{ color: c.textSec }}>File Preview</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed" style={{ color: c.text }}>{fileContent}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 space-y-1">
        <div className="px-3 py-2 flex items-center gap-2 rounded-xl" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}>
          <I d={ic.search} s={14} c={c.textMuted} />
          <input className="flex-1 bg-transparent outline-none text-xs" style={{ color: c.text }} placeholder="Search files..." />
        </div>
        {currentPath !== "Home" && (
          <button onClick={() => setCurrentPath("Home")} className="flex items-center gap-1 px-2 py-1 text-xs rounded-md" style={{ color: c.accentText }}>
            <I d={ic.chevL} s={12} c={c.accentText} /> Back to Home
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {currentFiles.map((f, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => {
              if (f.action === "notes") { onOpenApp("notes"); }
              else if (f.action === "file") { setFileContent(`# ${f.name}\n\nFile size: ${f.size}\nType: ${f.name.split('.').pop()?.toUpperCase()}\nModified: ${new Date().toLocaleDateString()}\n\n--- Content Preview ---\n\nThis is a preview of ${f.name}.\nFull file editing available in Code Editor.`); }
              else if (folders[f.action || ""]) { setCurrentPath(f.action as string); }
            }}>
            <span className="text-lg">{f.icon}</span>
            <p className="flex-1 text-xs" style={{ color: c.text }}>{f.name}</p>
            <span className="text-[10px]" style={{ color: c.textMuted }}>{f.size}</span>
            <I d={ic.chevR} s={12} c={c.textMuted} />
          </button>
        ))}
      </div>
    </div>
  );
}
