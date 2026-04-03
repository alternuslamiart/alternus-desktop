import { useState } from "react";
import type { ThemeColors } from "../../os/theme";

export function NotesApp({ c }: { c: ThemeColors }) {
  const [text, setText] = useState("# My Notes\n\nStart typing here...\n\n- Project ideas\n- Meeting notes\n- Quick reminders");
  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 p-4 bg-transparent outline-none resize-none text-sm leading-relaxed font-mono"
        style={{ color: c.text }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
