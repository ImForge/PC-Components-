import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function ClockDiagram({ broken }: { broken: boolean }) {
  const [mult, setMult] = useState(60);
  const ghz = (0.1 * mult).toFixed(1);
  let d = "M0 46";
  for (let i = 0; i < 9; i++) {
    const x = i * 34;
    d += ` H${x + 17} V8 H${x + 34} V46`;
  }
  return (
    <DiagramFrame title="clock generator"
      hint="A quartz crystal vibrates at a precise 100 MHz. Each chip's Phase-Locked Loop multiplies that base clock up to its working speed. Drag the multiplier to see the CPU frequency change.">
      <svg viewBox="0 0 306 58" style={{ width: "100%", marginBottom: 10 }}>
        <path d={d} fill="none" stroke={broken ? "var(--red)" : "var(--teal)"} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2="58" stroke={broken ? "var(--red)" : "var(--teal)"} strokeWidth="2"
          style={{ animation: broken ? "none" : "pce-clocksweep 2s linear infinite" }} />
      </svg>
      <div style={{ fontSize: 12, color: "var(--ink2)", marginBottom: 4 }}>
        PLL multiplier <span className="mono" style={{ color: "var(--teal)" }}>×{mult}</span>
        {"   →   "}CPU clock <span className="mono" style={{ color: "var(--amber)" }}>{ghz} GHz</span>
      </div>
      <input type="range" min="10" max="65" value={mult} disabled={broken}
        onChange={(e) => setMult(parseInt(e.target.value))} style={{ width: "100%" }} />
      <div className="mono" style={{ fontSize: 11, color: "var(--ink3)" }}>base reference: 100 MHz quartz</div>
    </DiagramFrame>
  );
}
