import type { BootPhase } from "../../os/types";

interface BootScreenProps {
  bootProgress: number;
  bootPhase: BootPhase;
}

export function BootScreen({ bootProgress, bootPhase }: BootScreenProps) {
  const bootMessages: Record<BootPhase, string[]> = {
    bios: ["BIOS v2.4 \u2014 Alternus Systems", "Checking hardware integrity..."],
    hardware: ["CPU: AlternusCore x86_64 @ 4.2GHz \u2014 OK", "RAM: 16 GB DDR5 \u2014 OK", "GPU: Integrated \u2014 OK", "Storage: 512 GB NVMe \u2014 OK"],
    kernel: ["Loading AlternusKernel 6.2...", "Initializing file system...", "Mounting partitions...", "Loading AI Engine v3.0..."],
    services: ["Starting network services...", "Starting display manager...", "Loading user preferences...", "Starting Alternus Shell..."],
    desktop: ["Preparing desktop environment...", "Ready"],
    done: ["Ready"],
  };
  const phaseIdx = ["bios", "hardware", "kernel", "services", "desktop", "done"].indexOf(bootPhase);
  const visibleLines = Object.entries(bootMessages).slice(0, phaseIdx + 1).flatMap(([, msgs]) => msgs);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="flex-1 p-6 overflow-hidden font-mono text-[11px] leading-5" style={{ color: "#4ade80" }}>
        {visibleLines.map((line, i) => (
          <p key={i} style={{ opacity: i === visibleLines.length - 1 ? 0.7 : 1 }}>
            {line.includes("OK") || line === "Ready" ? (
              <><span style={{ color: "#666" }}>[</span><span style={{ color: "#4ade80" }}> OK </span><span style={{ color: "#666" }}>]</span> {line.replace(" \u2014 OK", "").replace("Ready", "")}</>
            ) : (
              <><span style={{ color: "#666" }}>[</span><span style={{ color: "#3B82F6" }}> .. </span><span style={{ color: "#666" }}>]</span> <span style={{ color: "#aaa" }}>{line}</span></>
            )}
          </p>
        ))}
        {bootPhase !== "done" && <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: "#4ade80" }} />}
      </div>
      <div className="flex flex-col items-center pb-12">
        <h1
          className="text-5xl font-semibold mb-6 select-none bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(90deg, #666 0%, #eee 50%, #666 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            opacity: 0.6 + bootProgress * 0.4,
          }}
        >
          Alternus
        </h1>
        <div className="w-64 h-[3px] rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
          <div className="h-full rounded-full" style={{
            width: `${bootProgress * 100}%`,
            background: "linear-gradient(90deg, #7C3AED, #3B82F6, #06B6D4)",
            boxShadow: "0 0 12px #3B82F6, 0 0 24px rgba(59,130,246,0.4)",
            transition: "width 0.1s linear",
          }} />
        </div>
        <p className="mt-3 text-[10px] font-mono" style={{ color: "#555" }}>
          {bootPhase === "bios" ? "POST check" : bootPhase === "hardware" ? "Hardware scan" : bootPhase === "kernel" ? "Loading kernel" : bootPhase === "services" ? "Starting services" : "Welcome"}
        </p>
      </div>
    </div>
  );
}
