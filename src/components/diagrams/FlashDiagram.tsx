import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function FlashDiagram({ broken }: { broken: boolean }) {
  const [trapped, setTrapped] = useState(0);
  const bit = trapped > 8 ? 0 : 1;
  const dots = Array.from({ length: Math.min(trapped, 16) });
  return (
    <DiagramFrame title="flash cell — floating-gate transistor"
      hint="The floating gate is wrapped in insulator, so any charge forced onto it stays for years with no power. PROGRAM tunnels electrons in (cell reads 0); ERASE pulls them out (cell reads 1). The harsh tunnelling slowly wears the insulator — that is flash write endurance.">
      <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg viewBox="0 0 220 170" style={{ width: 220, flexShrink: 0 }}>
          <rect x="50" y="14" width="120" height="20" rx="2" fill={broken ? "var(--red)" : "var(--blue)"} opacity="0.8" />
          <text x="110" y="28" textAnchor="middle" fontSize="9" fill="#06121a">CONTROL GATE</text>
          <rect x="50" y="40" width="120" height="30" rx="3" fill="var(--amberdim)" stroke="var(--amber)" strokeWidth="1.6" />
          <text x="110" y="52" textAnchor="middle" fontSize="9" fill="var(--amber)">FLOATING GATE</text>
          {dots.map((_, i) => (
            <circle key={i} cx={62 + (i % 8) * 14} cy={i < 8 ? 60 : 64} r="2.6" fill="var(--green)" />
          ))}
          <rect x="50" y="76" width="120" height="14" fill="var(--panel3)" stroke="var(--ink3)" strokeDasharray="3 2" />
          <text x="178" y="86" fontSize="7" fill="var(--ink3)">oxide</text>
          <rect x="50" y="96" width="120" height="34" fill="var(--bluedim)" stroke="var(--teal)" />
          <text x="110" y="116" textAnchor="middle" fontSize="9" fill="var(--teal)">SILICON CHANNEL</text>
          <text x="110" y="152" textAnchor="middle" className="mono" fontSize="13"
            fill={broken ? "var(--red)" : "var(--teal)"}>
            stored bit = {broken ? "X" : bit}
          </text>
        </svg>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink2)", marginBottom: 10 }}>
            electrons on floating gate: <span style={{ color: "var(--green)" }}>{trapped}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button className="btn" disabled={broken} onClick={() => setTrapped((t) => Math.min(16, t + 4))}>PROGRAM ▼</button>
            <button className="btn" disabled={broken} onClick={() => setTrapped(0)}>ERASE ▲</button>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink2)", lineHeight: 1.6 }}>
            Many trapped electrons raise the transistor's threshold so it stays off at read voltage —
            that is a stored <span className="mono" style={{ color: "var(--teal)" }}>0</span>.
            An empty floating gate reads as <span className="mono" style={{ color: "var(--teal)" }}>1</span>.
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
