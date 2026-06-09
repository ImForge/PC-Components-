import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function LatticeDiagram() {
  const [doped, setDoped] = useState(false);
  const atoms: { x: number; y: number; center: boolean }[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
    atoms.push({ x: 50 + c * 70, y: 40 + r * 55, center: r === 1 && c === 1 });
  return (
    <DiagramFrame title="silicon crystal lattice — atomic scale"
      hint={doped
        ? "Doped: the centre silicon atom is now phosphorus, which has 5 outer electrons. Four form bonds; the 5th is FREE to roam (green). A crystal full of these is n-type silicon — it conducts. This is the bottom of the machine."
        : "Pure silicon: every atom shares all 4 outer electrons in rigid covalent bonds. Nothing is free to move, so it barely conducts. Add a dopant to see why a transistor can switch at all."}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <svg viewBox="0 0 250 190" style={{ width: 250, flexShrink: 0 }}>
          {atoms.map((at, i) => {
            const right = atoms[i + 1], down = atoms[i + 3];
            return <g key={"b" + i}>
              {right && (i % 3 !== 2) && <line x1={at.x} y1={at.y} x2={right.x} y2={right.y} stroke="var(--line2)" strokeWidth="3" />}
              {down && <line x1={at.x} y1={at.y} x2={down.x} y2={down.y} stroke="var(--line2)" strokeWidth="3" />}
            </g>;
          })}
          {atoms.map((at, i) => {
            const isP = doped && at.center;
            return <g key={i}>
              <circle cx={at.x} cy={at.y} r="15" fill={isP ? "var(--amberdim)" : "var(--bluedim)"}
                stroke={isP ? "var(--amber)" : "var(--teal)"} strokeWidth="1.6" />
              <text x={at.x} y={at.y + 4} textAnchor="middle" className="mono" fontSize="11"
                fill={isP ? "var(--amber)" : "var(--teal)"}>{isP ? "P" : "Si"}</text>
            </g>;
          })}
          {doped && (
            <circle r="5" fill="var(--green)" style={{ animation: "pce-drift 3.4s ease-in-out infinite" }}
              cx="120" cy="95">
            </circle>
          )}
          {doped && <text x="120" y="178" textAnchor="middle" fontSize="9" fill="var(--green)">▲ free electron</text>}
        </svg>
        <div style={{ flex: 1, minWidth: 200 }}>
          <button className={doped ? "btn on" : "btn"} onClick={() => setDoped(!doped)}>
            {doped ? "● phosphorus dopant added" : "+ add phosphorus dopant"}
          </button>
          <div style={{ marginTop: 14, display: "grid", gap: 7, fontSize: 12 }}>
            {[
              ["Material", doped ? "n-type silicon" : "intrinsic silicon"],
              ["Free carriers", doped ? "1 mobile electron" : "none"],
              ["Conducts?", doped ? "yes" : "barely"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 5 }}>
                <span style={{ color: "var(--ink2)" }}>{k}</span>
                <span className="mono" style={{ color: doped ? "var(--green)" : "var(--ink3)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
