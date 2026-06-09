import { DiagramFrame } from './DiagramFrame';

export function PsuDiagram() {
  let ac = "M0 34", rect = "M0 92";
  let up = true;
  for (let x = 0; x < 320; x += 32) {
    ac += ` Q${x + 16} ${up ? 8 : 60} ${x + 32} 34`;
    rect += ` Q${x + 16} 58 ${x + 32} 92`;
    up = !up;
  }
  const lanes = [
    { label: "230 V AC — from the wall socket", color: "var(--red)", d: ac, ly: 18, dotY: 34 },
    { label: "rectified — every swing folded positive", color: "var(--amber)", d: rect, ly: 76, dotY: 92 },
    { label: "+12 V DC — smoothed & regulated", color: "var(--green)", d: "M0 130 H320", ly: 116, dotY: 130 },
  ];
  return (
    <DiagramFrame title="PSU — AC to DC conversion"
      hint="Wall power swings hundreds of volts back and forth. The rectifier folds every negative swing positive; capacitors fill the gaps between the bumps; the regulator holds a flat, steady +12 V DC. Each dot traces energy moving through one stage.">
      <svg viewBox="0 0 320 146" style={{ width: "100%" }}>
        {lanes.map((ln, i) => (
          <g key={i}>
            <text x="2" y={ln.ly} className="mono" fontSize="9" fill="var(--ink2)">{ln.label}</text>
            <path d={ln.d} fill="none" stroke={ln.color} strokeWidth="2" />
            <circle r="3.6" cx="0" cy={ln.dotY} fill="var(--teal)"
              style={{ animation: `pce-tx 3s linear ${(i * 0.45).toFixed(2)}s infinite` }} />
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}
