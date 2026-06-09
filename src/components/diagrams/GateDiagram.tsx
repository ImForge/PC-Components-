import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function GateDiagram({ broken }: { broken: boolean }) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const y = a !== b;
  const pad = (val: boolean, set: (b: boolean) => void, label: string, cx: number, cy: number) => (
    <g onClick={() => !broken && set(!val)} style={{ cursor: broken ? "default" : "pointer" }}>
      <circle cx={cx} cy={cy} r="13" fill={val ? "var(--tealdim)" : "var(--panel3)"}
        stroke={val ? "var(--teal)" : "var(--line2)"} strokeWidth="1.6" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="mono" fontSize="12"
        fill={val ? "var(--teal)" : "var(--ink3)"}>{val ? 1 : 0}</text>
      <text x={cx - 22} y={cy + 4} textAnchor="end" fontSize="11" fill="var(--ink2)">{label}</text>
    </g>
  );
  return (
    <DiagramFrame title="XOR logic gate"
      hint="Click input A or B to flip it. XOR outputs 1 only when the inputs differ. This is the gate that produces the sum bit inside the full adder one level up.">
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
        <svg viewBox="0 0 260 130" style={{ width: 260, flexShrink: 0 }}>
          {pad(a, setA, "A", 40, 38)}
          {pad(b, setB, "B", 40, 92)}
          <path d="M88 30q14 35 0 70" fill="none" stroke="var(--ink3)" strokeWidth="1.6" />
          <path d="M96 30q14 35 0 70 q40 0 66 -35 q-26 -35 -66 -35z"
            fill="var(--panel2)" stroke={broken ? "var(--red)" : "var(--amber)"} strokeWidth="1.8" />
          <text x="128" y="69" textAnchor="middle" className="mono" fontSize="11" fill="var(--amber)">XOR</text>
          <line x1="53" y1="38" x2="92" y2="38" stroke={a ? "var(--teal)" : "var(--line2)"} strokeWidth="2" />
          <line x1="53" y1="92" x2="92" y2="92" stroke={b ? "var(--teal)" : "var(--line2)"} strokeWidth="2" />
          <line x1="162" y1="65" x2="200" y2="65" stroke={y ? "var(--teal)" : "var(--line2)"} strokeWidth="2" />
          <circle cx="214" cy="65" r="14" fill={y ? "var(--tealdim)" : "var(--panel3)"}
            stroke={broken ? "var(--red)" : y ? "var(--teal)" : "var(--line2)"} strokeWidth="1.8" />
          <text x="214" y="70" textAnchor="middle" className="mono" fontSize="13"
            fill={broken ? "var(--red)" : y ? "var(--teal)" : "var(--ink3)"}>{broken ? "X" : y ? 1 : 0}</text>
          <text x="214" y="95" textAnchor="middle" fontSize="10" fill="var(--ink2)">Y = A⊕B</text>
        </svg>
        <table className="mono" style={{ fontSize: 12, borderCollapse: "collapse" }}>
          <tbody>
            <tr style={{ color: "var(--ink3)" }}>{["A", "B", "Y"].map((h) => (
              <td key={h} style={{ padding: "3px 14px", borderBottom: "1px solid var(--line2)" }}>{h}</td>))}</tr>
            {[[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0]].map((r, i) => {
              const cur = (a ? 1 : 0) === r[0] && (b ? 1 : 0) === r[1];
              return (
                <tr key={i} style={{ background: cur ? "var(--tealdim)" : "transparent",
                  color: cur ? "var(--teal)" : "var(--ink2)" }}>
                  {r.map((v, j) => <td key={j} style={{ padding: "4px 14px" }}>{v}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DiagramFrame>
  );
}
