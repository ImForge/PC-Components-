import { DiagramFrame } from './DiagramFrame';

export function PipelineDiagram({ broken }: { broken: boolean }) {
  const stages = ["FETCH", "DECODE", "EXECUTE", "WRITEBACK"];
  const tints = ["var(--teal)", "var(--blue)", "var(--amber)", "var(--green)"];
  const insns = ["LD r1", "ADD r2", "CMP r3", "MUL r4", "XOR r5", "JMP +8"];
  return (
    <DiagramFrame title="instruction pipeline"
      hint={broken
        ? "Pipeline STALLED — a faulted spec on this core halted the clock. Instructions are frozen mid-flight."
        : "Six instructions in flight at once. While one executes, the next is already decoding — that overlap is why a pipeline is fast. The clock strip up top paces every stage."}>
      <div className={broken ? "frozen" : ""} style={{ opacity: broken ? 0.55 : 1 }}>
        {/* clock strip */}
        <div style={{ position: "relative", height: 22, marginBottom: 10, background: "var(--panel3)", borderRadius: 5, overflow: "hidden", border: "1px solid var(--line)" }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: `${i * 3.57}%`, top: i % 2 ? 11 : 3, width: "1.8%", height: 8, background: "var(--line2)" }} />
          ))}
          <div style={{ position: "absolute", top: 0, width: 2, height: "100%", background: broken ? "var(--red)" : "var(--teal)", boxShadow: "0 0 8px var(--teal)", animation: "pce-sweep 2.4s linear infinite" }} />
        </div>
        {/* stage track */}
        <div style={{ position: "relative", height: 84 }}>
          <div style={{ display: "flex", gap: 8, height: 60 }}>
            {stages.map((s, i) => (
              <div key={s} style={{
                flex: 1, border: "1px solid var(--line2)", borderRadius: 8,
                background: "var(--panel2)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 3,
                animation: broken ? "none" : `pce-stage 4.8s linear ${i * 1.2}s infinite`,
              }}>
                <span className="mono" style={{ fontSize: 11, color: tints[i] }}>{s}</span>
                <span style={{ fontSize: 9, color: "var(--ink3)" }}>stage {i + 1}</span>
              </div>
            ))}
          </div>
          {/* packets */}
          {insns.map((ins, i) => (
            <div key={i} className="mono" style={{
              position: "absolute", top: 68, width: 56, textAlign: "center",
              fontSize: 10, color: "#06121a", fontWeight: 600,
              background: tints[i % 4], borderRadius: 4, padding: "2px 0",
              animation: `pce-packet 4.8s linear ${(-i * 0.8).toFixed(2)}s infinite`,
            }}>{ins}</div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  );
}
