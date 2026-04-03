import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function BrowserApp({ c }: { c: ThemeColors }) {
  const [url, setUrl] = useState("https://alternus.art");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(["https://alternus.art"]);
  const [bookmarks] = useState([
    { name: "Alternus Art", url: "https://alternus.art" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Google", url: "https://google.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
  ]);

  const navigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith("http")) finalUrl = "https://" + finalUrl;
    setUrl(finalUrl);
    setHistory((p) => [...p, finalUrl]);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <button onClick={() => { if (history.length > 1) { const h = [...history]; h.pop(); setHistory(h); setUrl(h[h.length - 1]); } }} style={{ color: c.textMuted }} className="p-1">
          <I d={ic.chevL} s={14} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}>
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${c.accent} transparent ${c.accent} ${c.accent}` }} />
          ) : (
            <I d={ic.globe} s={12} c={c.textMuted} />
          )}
          <input
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: c.text }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(url); }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        {bookmarks.map((b, i) => (
          <button key={i} onClick={() => navigate(b.url)} className="px-2 py-0.5 rounded-md text-[10px] transition-colors"
            style={{ color: c.textSec }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            {b.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Browser"
        />
      </div>
    </div>
  );
}
