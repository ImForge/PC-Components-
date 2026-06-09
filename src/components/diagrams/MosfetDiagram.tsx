import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';
import { getVal } from '../../engine/componentEngine';
import type { ComponentNode, Edits } from '../../types';

export function MosfetDiagram({ node, edits, broken }: { node: ComponentNode; edits: Edits; broken: boolean }) {
  const [gateV, setGateV] = useState(1.0);
  const thr = parseFloat(getVal(edits, node.id, "thresholdV", 0.3));
  const ox = parseFloat(getVal(edits, node.id, "gateOxide", 1.0));
  const gl = parseFloat(getVal(edits, node.id, "gateLength", 20));
  const oxideOK = ox >= 0.7;
  const on = !broken && gateV >= thr && gl > 0 && oxideOK;
  const accent = broken ? "var(--red)" : on ? "var(--green)" : "var(--blue)";

  return (
    <DiagramFrame title="MOSFET switch"
      hint={broken
        ? "Transistor faulted — an out-of-range spec means it can no longer switch reliably."
        : `Drag the gate voltage. At or above the threshold (${thr} V) the gate's field pulls a conducting channel of electrons open and current flows. Below it, the channel is empty and the switch is OFF.`}>
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg viewBox="0 0 240 200" style={{ width: 240, flexShrink: 0 }}>
          <defs><clipPath id="chan"><rect x="98" y="62" width="44" height="78" /></clipPath></defs>
          {/* drain / source contacts */}
          <rect x="98" y="20" width="44" height="42" rx="2" fill="var(--bluedim)" stroke={accent} />
          <text x="120" y="16" textAnchor="middle" fontSize="9" fill="var(--ink2)">DRAIN (n+)</text>
          <rect x="98" y="140" width="44" height="42" rx="2" fill="var(--bluedim)" stroke={accent} />
          <text x="120" y="195" textAnchor="middle" fontSize="9" fill="var(--ink2)">SOURCE (n+)</text>
          {/* channel / body */}
          <rect x="98" y="62" width="44" height="78" fill={on ? "var(--tealdim)" : "var(--panel3)"} stroke={accent} />
          {/* electrons flowing */}
          {on && <g clipPath="url(#chan)">
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={108 + (i % 3) * 12} cy="140" r="3" fill="var(--green)"
                style={{ animation: `pce-eflow 1.1s linear ${(-i * 0.22).toFixed(2)}s infinite` }} />
            ))}
          </g>}
          {/* gate oxide + gate */}
          <rect x="74" y="74" width="24" height="54" fill="var(--panel)" stroke={oxideOK ? "var(--ink3)" : "var(--red)"} strokeDasharray="3 2" />
          <text x="86" y="101" textAnchor="middle" fontSize="7" fill={oxideOK ? "var(--ink3)" : "var(--red)"}>oxide</text>
          <rect x="40" y="84" width="34" height="34" rx="2" fill={accent} opacity="0.85" />
          <line x1="20" y1="101" x2="40" y2="101" stroke={accent} strokeWidth="2" />
          <text x="14" y="105" textAnchor="end" fontSize="9" fill="var(--ink2)">GATE</text>
          <text x="120" y="106" textAnchor="middle" className="mono" fontSize="11" fontWeight="600" fill={accent}>
            {broken ? "FAULT" : on ? "ON" : "OFF"}
          </text>
        </svg>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 12, color: "var(--ink2)", marginBottom: 4 }}>
            Gate voltage <span className="mono" style={{ color: accent }}>{gateV.toFixed(2)} V</span>
          </div>
          <input type="range" min="0" max="1.5" step="0.01" value={gateV} disabled={broken}
            onChange={(e) => setGateV(parseFloat(e.target.value))} style={{ width: "100%" }} />
          <div className="mono" style={{ fontSize: 11, color: "var(--ink3)", display: "flex", justifyContent: "space-between" }}>
            <span>0 V</span><span>threshold {thr} V ▲</span><span>1.5 V</span>
          </div>
          <div style={{ marginTop: 14, display: "grid", gap: 7 }}>
            {[
              ["Channel", on ? "conducting" : "depleted", on],
              ["Current Dr→Src", on ? "flowing" : "blocked", on],
              ["Gate oxide", oxideOK ? `${ox} nm — sealed` : `${ox} nm — tunnelling!`, oxideOK],
            ].map(([k, v, ok]) => (
              <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderBottom: "1px solid var(--line)", paddingBottom: 5 }}>
                <span style={{ color: "var(--ink2)" }}>{k}</span>
                <span className="mono" style={{ color: ok ? "var(--green)" : "var(--red)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
