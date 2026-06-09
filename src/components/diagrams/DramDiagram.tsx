import { useState, useEffect } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function DramDiagram({ broken }: { broken: boolean }) {
  const [charge, setCharge] = useState(0.95);
  const [log, setLog] = useState("idle");
  useEffect(() => {
    if (broken) return;
    const t = setInterval(() => setCharge((c) => Math.max(0, c - 0.045)), 850);
    return () => clearInterval(t);
  }, [broken]);
  const bit = charge > 0.5 ? 1 : 0;
  const lost = charge <= 0.5;
  const fillH = 46 * charge;
  return (
    <DiagramFrame title="DRAM cell — 1 transistor, 1 capacitor"
      hint="The capacitor's charge IS the bit. It leaks continuously — watch it drop. WRITE sets it, READ senses it, REFRESH tops it back up. Real RAM refreshes every cell thousands of times per second.">
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg viewBox="0 0 220 170" style={{ width: 220, flexShrink: 0 }}>
          {/* word line */}
          <line x1="10" y1="40" x2="120" y2="40" stroke="var(--amber)" strokeWidth="2" />
          <text x="12" y="32" fontSize="9" fill="var(--amber)">word line</text>
          {/* bit line */}
          <line x1="150" y1="10" x2="150" y2="160" stroke="var(--blue)" strokeWidth="2" />
          <text x="156" y="20" fontSize="9" fill="var(--blue)">bit line</text>
          {/* transistor */}
          <rect x="120" y="30" width="30" height="22" rx="2" fill="var(--panel2)" stroke="var(--teal)" />
          <text x="135" y="44" textAnchor="middle" fontSize="8" fill="var(--teal)">T</text>
          <line x1="135" y1="52" x2="135" y2="92" stroke="var(--teal)" strokeWidth="2" />
          {/* capacitor */}
          <line x1="112" y1="96" x2="158" y2="96" stroke="var(--ink2)" strokeWidth="3" />
          <line x1="112" y1="142" x2="158" y2="142" stroke="var(--ink2)" strokeWidth="3" />
          <rect x="114" y={142 - fillH} width="42" height={fillH} rx="1"
            fill={broken ? "var(--red)" : lost ? "var(--amber)" : "var(--green)"} opacity="0.8"
            style={{ transition: "all .5s ease" }} />
          <line x1="135" y1="142" x2="135" y2="158" stroke="var(--ink3)" strokeWidth="2" />
          <text x="135" y="168" textAnchor="middle" fontSize="8" fill="var(--ink3)">GND</text>
          <text x="170" y="122" fontSize="9" fill="var(--ink2)">capacitor</text>
        </svg>
        <div style={{ flex: 1, minWidth: 210 }}>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink2)", marginBottom: 8 }}>
            charge <span style={{ color: lost ? "var(--red)" : "var(--green)" }}>{(charge * 100).toFixed(0)}%</span>
            {"   "}stored bit <span style={{ color: "var(--teal)", fontSize: 15 }}>{bit}</span>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
            <button className="btn" disabled={broken} onClick={() => { setCharge(1); setLog("wrote 1"); }}>WRITE 1</button>
            <button className="btn" disabled={broken} onClick={() => { setCharge(0); setLog("wrote 0"); }}>WRITE 0</button>
            <button className="btn" disabled={broken} onClick={() => setLog(`read → ${bit}`)}>READ</button>
            <button className="btn on" disabled={broken} onClick={() => { setCharge((c) => (c > 0.5 ? 1 : 0)); setLog("refreshed"); }}>REFRESH</button>
          </div>
          <div style={{ fontSize: 12, padding: "8px 11px", borderRadius: 7,
            background: lost ? "var(--reddim)" : "var(--panel3)",
            border: `1px solid ${lost ? "var(--red)" : "var(--line)"}`,
            color: lost ? "var(--red)" : "var(--ink2)" }}>
            <span className="mono">{log}</span>
            {lost && " — charge decayed below threshold. The bit is corrupt; a refresh now locks in 0."}
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
