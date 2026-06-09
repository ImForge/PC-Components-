import { useState } from 'react';

/* The live "SYSTEM ARCHITECTURE" hero: Storage -> RAM -> CPU with animated buses. */
export function SystemArchitecture({ onOpen }: { onOpen: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);

  const mods = [
    { id: 'ssd', x: 22, name: 'STORAGE', sub: 'NVMe SSD', accent: 'var(--blue)', lines: ['2 TB · 3D TLC', 'PCIe 4.0 ×4'] },
    { id: 'ram', x: 292, name: 'MEMORY', sub: 'DDR5 DRAM', accent: 'var(--teal)', lines: ['32 GB · dual', '6000 MT/s'] },
    { id: 'cpu', x: 562, name: 'PROCESSOR', sub: 'Raptor Lake', accent: 'var(--teal)', lines: ['24 cores', '6.0 GHz'] },
  ];
  const W = 176, Y = 46, H = 110;

  // x, y, distance, color, duration, delay
  const flow = (x: number, y: number, tx: number, color: string, d: number, delay: number, k: string) => (
    <rect key={k} x={x} y={y} width="15" height="5" rx="2.5" fill={color}
      style={{ ['--tx' as never]: `${tx}px`, animation: `pce-busflow ${d}s linear ${delay}s infinite` }} />
  );

  return (
    <div className="panel edge" style={{ padding: '15px 18px 18px', marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <span className="lbl" style={{ color: 'var(--teal)', letterSpacing: '.22em' }}>◢ System Architecture</span>
        <span className="lbl">live signal trace</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink2)', marginBottom: 8 }}>
        The fundamental loop — storage feeds memory, memory feeds the processor, results flow back. Click a module to drill in.
      </div>
      <svg viewBox="0 0 760 210" style={{ width: '100%' }}>
        {/* forward + return buses */}
        <line x1="198" y1="88" x2="292" y2="88" stroke="var(--line2)" strokeWidth="2" />
        <line x1="468" y1="88" x2="562" y2="88" stroke="var(--line2)" strokeWidth="2" />
        <line x1="198" y1="122" x2="562" y2="122" stroke="var(--line2)" strokeWidth="2" strokeDasharray="2 5" opacity="0.7" />
        <text x="245" y="80" textAnchor="middle" className="mono" fontSize="9" fill="var(--blue)">LOAD ▸</text>
        <text x="515" y="80" textAnchor="middle" className="mono" fontSize="9" fill="var(--teal)">FETCH ▸</text>
        <text x="380" y="138" textAnchor="middle" className="mono" fontSize="9" fill="var(--amber)">◂ WRITE-BACK</text>

        {/* animated packets */}
        {[0, 1, 2].map((i) => flow(198, 86, 94, 'var(--blue)', 2.4, -i * 0.8, 'l' + i))}
        {[0, 1, 2].map((i) => flow(468, 86, 94, 'var(--teal)', 2.0, -i * 0.66, 'f' + i))}
        {[0, 1].map((i) => flow(562, 120, -364, 'var(--amber)', 4.2, -i * 2.1, 'w' + i))}

        {/* modules */}
        {mods.map((m) => {
          const on = hover === m.id;
          return (
            <g key={m.id} style={{ cursor: 'pointer', filter: on ? `drop-shadow(0 0 9px ${m.accent})` : 'none' }}
              onMouseEnter={() => setHover(m.id)} onMouseLeave={() => setHover(null)}
              onClick={() => onOpen(m.id)}>
              <rect x={m.x} y={Y} width={W} height={H} rx="5"
                fill="url(#modgrad)" stroke={on ? m.accent : 'var(--line2)'} strokeWidth={on ? 1.5 : 1} />
              <rect x={m.x} y={Y} width={W} height="22" rx="5" fill={m.accent} opacity="0.14" />
              <line x1={m.x} y1={Y + 22} x2={m.x + W} y2={Y + 22} stroke="var(--line)" />
              <text x={m.x + 13} y={Y + 15} className="mono" fontSize="11" fill={m.accent} letterSpacing="2">{m.name}</text>
              <text x={m.x + W - 13} y={Y + 15} textAnchor="end" fontSize="9" fill="var(--ink3)">{m.sub}</text>
              {m.lines.map((ln, j) => (
                <text key={j} x={m.x + 13} y={Y + 44 + j * 16} className="mono" fontSize="11" fill="var(--ink2)">{ln}</text>
              ))}
              {/* contact pins along the bottom */}
              {Array.from({ length: 12 }).map((_, j) => (
                <line key={j} x1={m.x + 14 + j * 13} y1={Y + H} x2={m.x + 14 + j * 13} y2={Y + H + 5}
                  stroke="var(--line2)" strokeWidth="1.5" />
              ))}
              <text x={m.x + W / 2} y={Y + H + 18} textAnchor="middle" className="mono" fontSize="8" fill="var(--ink3)">
                ▸ inspect
              </text>
            </g>
          );
        })}

        {/* clock indicator */}
        <g>
          <circle cx="690" cy="30" r="4" fill="none" stroke="var(--teal)" strokeWidth="1.3" />
          <circle cx="690" cy="30" r="1.7" fill="var(--teal)" style={{ animation: 'pce-blink 1s steps(1) infinite' }} />
          <text x="700" y="33" className="mono" fontSize="9" fill="var(--ink2)">CLK 6.0 GHz</text>
        </g>

        <defs>
          <linearGradient id="modgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--panel2)" />
            <stop offset="1" stopColor="var(--panel)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
