import { useState } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function BrowserApp({ c }: { c: ThemeColors }) {
  const [url, setUrl] = useState("https://alternus.art");
  const [displayUrl, setDisplayUrl] = useState("https://alternus.art");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
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
    setDisplayUrl(finalUrl);
    setUrl(finalUrl);
    setHistory((p) => [...p, finalUrl]);
    setIsLoading(true);
    setLoadError(false);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* URL Bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        <button onClick={() => { if (history.length > 1) { const h = [...history]; h.pop(); setHistory(h); setUrl(h[h.length - 1]); setDisplayUrl(h[h.length - 1]); } }} style={{ color: c.textMuted }} className="p-1 rounded-md hover:opacity-80 transition-opacity">
          <I d={ic.chevL} s={14} />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: c.cardAlt, border: `1px solid ${c.border}` }}>
          {isLoading ? (
            <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderColor: `${c.accent} transparent ${c.accent} ${c.accent}` }} />
          ) : (
            <I d={ic.globe} s={12} c={c.textMuted} />
          )}
          <input
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: c.text }}
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(displayUrl); }}
          />
        </div>
      </div>

      {/* Bookmarks */}
      <div className="flex items-center gap-1 px-3 py-2 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
        {bookmarks.map((b, i) => (
          <button key={i} onClick={() => navigate(b.url)} className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
            style={{ color: c.textSec }}
            onMouseEnter={(e) => (e.currentTarget.style.background = c.cardAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            {b.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative" style={{ background: c.cardAlt }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${c.accent} transparent ${c.accent} ${c.accent}` }} />
            <p className="text-xs" style={{ color: c.textMuted }}>Loading {displayUrl}...</p>
          </div>
        ) : (
          <>
            <iframe
              src={url}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Browser"
              onError={() => setLoadError(true)}
            />
            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: c.cardAlt }}>
                <I d={ic.globe} s={32} c={c.textMuted} />
                <p className="text-sm font-medium" style={{ color: c.text }}>Cannot display this page</p>
                <p className="text-xs" style={{ color: c.textMuted }}>{url} refused to connect</p>
                <button onClick={() => navigate(url)} className="mt-2 px-4 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.accent, color: "#fff" }}>Retry</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
