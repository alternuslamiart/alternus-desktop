import { useState, useEffect } from "react";
import { I, ic } from "../../os/icons";
import type { ThemeColors } from "../../os/theme";

export function WordApp({ c }: { c: ThemeColors }) {
  const [docTitle, setDocTitle] = useState("Untitled Document");
  const [docContent, setDocContent] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis sit eget faucibus eget. Pulvinar amet varius elementum bibendum massa tristique varius ultrices. Ornare vitae duis non in. Id tortor cras nisl mollis nibh est. Socis tortor id orci vitae nulla eget sed nisi.\n\nUt nisl aliquam dignissim mauris nunc ut diam nec sed. Neque urna vitae velit morbi tristique. Nulla tristique urna gravida orci sagittis vel mauris amet. Ipsum urna id elit volutpat. Enem posuere dictum sed sagittis. In tortor aliquam posuere ultrices fringilla. Magna dictum faucibus praesent ultrices feugiat nec. Vitae tempor augue suscipit sed eget purus.\n\nPraesent urna ante nam mattis dolor imperdiet vitae pellentesque vitae. Leo dapibus non egestas commodo urna tincidunt vitae. Consequat gravida netus fames viverra orci. Vel in sed nec enim hendrerit faucibus. Laoreet tincidunt eget neque dignissim sit egestas adipiscing. Euismod facilisis vestibulum ut in faucibus sed.");
  const [wordCount, setWordCount] = useState(0);
  const sidebarItems = [
    { icon: ic.fileText, label: "File Document" },
    { icon: ic.type, label: "Typography" },
    { icon: ic.pen, label: "Edit" },
    { icon: ic.upload, label: "Export" },
    { icon: ic.share, label: "Share" },
    { icon: ic.plus, label: "New" },
  ];
  const [activeSidebar, setActiveSidebar] = useState(0);

  useEffect(() => {
    setWordCount(docContent.trim().split(/\s+/).filter(Boolean).length);
  }, [docContent]);

  return (
    <div className="flex h-full">
      <div className="w-12 flex-shrink-0 flex flex-col items-center py-3 gap-1" style={{ background: c.bg, borderRight: `1px solid ${c.border}` }}>
        {sidebarItems.map((item, i) => (
          <button key={i} onClick={() => setActiveSidebar(i)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: activeSidebar === i ? c.accentSoft : "transparent", color: activeSidebar === i ? c.accentText : c.textMuted }}
            onMouseEnter={(e) => { if (activeSidebar !== i) e.currentTarget.style.background = c.cardAlt; }}
            onMouseLeave={(e) => { if (activeSidebar !== i) e.currentTarget.style.background = "transparent"; }}>
            <I d={item.icon} s={16} />
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6" style={{ background: c.bg }}>
          <div className="max-w-[640px] mx-auto rounded-xl p-8 min-h-full" style={{ background: c.surface, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
            <input
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full text-2xl font-bold mb-6 bg-transparent border-none outline-none"
              style={{ color: c.text }}
              placeholder="Document Title"
            />
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
              style={{ color: c.text, minHeight: 300 }}
              placeholder="Start writing..."
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-4 h-8 flex-shrink-0" style={{ background: c.surface, borderTop: `1px solid ${c.border}` }}>
          <div className="flex items-center gap-4">
            <span className="text-[10px]" style={{ color: c.textMuted }}>Page: 1</span>
            <span className="text-[10px]" style={{ color: c.textMuted }}>Words: {wordCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-0.5 rounded" style={{ color: c.textMuted }}><I d={ic.alignLeft} s={12} /></button>
            <button className="p-0.5 rounded" style={{ color: c.textMuted }}><I d={ic.alignCenter} s={12} /></button>
            <button className="p-0.5 rounded" style={{ color: c.textMuted }}><I d={ic.alignRight} s={12} /></button>
            <button className="p-0.5 rounded" style={{ color: c.textMuted }}><I d={ic.alignJustify} s={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
