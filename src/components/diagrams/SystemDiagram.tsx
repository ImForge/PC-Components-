import { DiagramFrame } from './DiagramFrame';

export function SystemDiagram() {
  const box = (x: number, label: string, sub: string) => (
    <g>
      <rect x={x} y="34" width="118" height="58" rx="7" fill="var(--panel2)" stroke="var(--line2)" />
      <text x={x + 59} y="60" textAnchor="middle" className="mono" fontSize="13" fill="var(--ink)">{label}</text>
      <text x={x + 59} y="77" textAnchor="middle" fontSize="10" fill="var(--ink2)">{sub}</text>
    </g>
  );
  return (
    <DiagramFrame title="the fetch–execute loop"
      hint="Every component below exists to keep this loop fed: the CPU pulls an instruction and data from RAM, computes, and writes back. The SSD restocks RAM; the clock paces every step.">
      <svg viewBox="0 0 520 150" style={{ width: "100%" }}>
        {box(20, "STORAGE", "SSD · permanent")}
        {box(201, "RAM", "working set")}
        {box(382, "CPU", "compute")}
        {[[138, 198], [319, 379]].map(([a, b], i) => (
          <g key={i}>
            <line x1={a} y1="55" x2={b} y2="55" stroke="var(--teal)" strokeWidth="1.6"
              strokeDasharray="6 4" style={{ animation: "pce-dash 1s linear infinite" }} />
            <polygon points={`${b},55 ${b - 7},51 ${b - 7},59`} fill="var(--teal)" />
            <line x1={b} y1="72" x2={a} y2="72" stroke="var(--blue)" strokeWidth="1.4"
              strokeDasharray="5 5" style={{ animation: "pce-dash 1.4s linear infinite reverse" }} />
            <polygon points={`${a},72 ${a + 7},68 ${a + 7},76`} fill="var(--blue)" />
          </g>
        ))}
        <text x="168" y="42" textAnchor="middle" fontSize="9" fill="var(--teal)">load</text>
        <text x="349" y="42" textAnchor="middle" fontSize="9" fill="var(--teal)">fetch</text>
        <text x="349" y="90" textAnchor="middle" fontSize="9" fill="var(--blue)">write back</text>
        <g>
          <circle cx="441" cy="116" r="5" fill="none" stroke="var(--amber)" strokeWidth="1.4" />
          <circle cx="441" cy="116" r="2" fill="var(--amber)" style={{ animation: "pce-blink 1s steps(1) infinite" }} />
          <text x="453" y="120" fontSize="10" fill="var(--ink2)">clock · 6 GHz</text>
        </g>
      </svg>
    </DiagramFrame>
  );
}
