import { useState, useEffect } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function GpuSmDiagram({ broken }: { broken: boolean }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (broken) return;
    const t = setInterval(() => setTick((x) => x + 1), 420);
    return () => clearInterval(t);
  }, [broken]);
  const lanes = 32;
  const active = (i: number) => !broken && ((i + tick) % 4 !== ((tick >> 1) % 4));
  return (
    <DiagramFrame title="streaming multiprocessor — warp execution"
      hint="A warp is 32 threads running the same instruction in lockstep. Four schedulers each issue one warp per cycle to the CUDA lanes below. When a warp stalls, another instantly takes its place — that is how a GPU hides memory latency.">
      <div style={{ opacity: broken ? 0.5 : 1 }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className="mono" style={{
              flex: 1, minWidth: 90, fontSize: 10.5, padding: "7px 9px", borderRadius: 7,
              background: "var(--panel2)", border: "1px solid var(--line2)", color: "var(--blue)",
            }}>
              SCHED {s}<br />
              <span style={{ color: "var(--ink2)" }}>warp #{broken ? "—" : (tick * 3 + s * 7) % 48}</span>
            </div>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 9.5, color: "var(--ink3)", marginBottom: 6 }}>32 CUDA LANES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(16,1fr)", gap: 4 }}>
          {Array.from({ length: lanes }).map((_, i) => (
            <div key={i} style={{
              height: 22, borderRadius: 4,
              background: active(i) ? "var(--tealdim)" : "var(--panel3)",
              border: `1px solid ${active(i) ? "var(--teal)" : "var(--line)"}`,
              transition: ".2s",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
          {["TENSOR CORE", "RT CORE"].map((u, i) => (
            <div key={u} className="mono" style={{
              flex: 1, fontSize: 10, textAlign: "center", padding: "6px 0", borderRadius: 6,
              background: "var(--panel2)", color: "var(--amber)",
              border: "1px solid var(--line2)",
              animation: broken ? "none" : `pce-pulse 1.6s ease ${i * 0.5}s infinite`,
            }}>{u}</div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  );
}
