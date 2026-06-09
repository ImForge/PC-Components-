import { useState } from 'react';
import { DiagramFrame } from './DiagramFrame';

export function HddDiagram({ broken }: { broken: boolean }) {
  const [track, setTrack] = useState(8);
  const totalTracks = 24;
  const cx = 108;
  const cy = 104;
  const rOuter = 74;
  const angle = -18 + (track / totalTracks) * 36;
  const headR = rOuter - (track / totalTracks) * 54;
  const rings = Array.from({ length: 7 });
  const seek = () => {
    if (!broken) setTrack(Math.floor(Math.random() * totalTracks));
  };
  return (
    <DiagramFrame title="hard disk — seek & spin"
      hint={broken
        ? 'Drive faulted — the platters have stopped and the head is parked.'
        : 'The platter spins continuously; click SEEK and the actuator swings the head to a new track. Real drives do this thousands of times a second, a few milliseconds each — that mechanical delay is exactly why an HDD is slower than an SSD.'}>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg viewBox="0 0 230 200" style={{ width: 230, flexShrink: 0 }}>
          <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: broken ? 'none' : 'pce-spin 1.4s linear infinite' }}>
            <circle cx={cx} cy={cy} r={rOuter} fill="var(--panel2)" stroke="var(--line2)" />
            {rings.map((_, i) => (
              <circle key={i} cx={cx} cy={cy} r={12 + i * 9} fill="none" stroke="var(--line)" strokeWidth="1" />
            ))}
            <line x1={cx} y1={cy} x2={cx} y2={cy - rOuter} stroke={broken ? 'var(--red)' : 'var(--teal)'} strokeWidth="1.5" opacity="0.7" />
            <circle cx={cx} cy={cy} r="9" fill="var(--panel3)" stroke="var(--ink3)" />
          </g>
          <g style={{ transformOrigin: '206px 36px', transform: `rotate(${angle}deg)`, transition: 'transform .6s cubic-bezier(.5,0,.2,1)' }}>
            <line x1="206" y1="36" x2={cx + 2} y2={cy - headR + 8} stroke="var(--ink2)" strokeWidth="4" strokeLinecap="round" />
            <rect x={cx - 4} y={cy - headR} width="12" height="12" rx="2" fill={broken ? 'var(--red)' : 'var(--amber)'} />
          </g>
          <circle cx="206" cy="36" r="5" fill="var(--ink3)" />
          <text x="206" y="22" textAnchor="middle" fontSize="8" fill="var(--ink2)">actuator pivot</text>
        </svg>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink2)', marginBottom: 10 }}>
            head at track <span style={{ color: 'var(--amber)' }}>{String(track).padStart(2, '0')}</span> / {totalTracks}
            <br />platter <span style={{ color: broken ? 'var(--red)' : 'var(--green)' }}>{broken ? 'stopped' : '7200 RPM'}</span>
          </div>
          <button className="btn on" disabled={broken} onClick={seek}>◎ SEEK random track</button>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>
            Reaching data takes two slow steps in sequence: swing the head to the right track (seek),
            then wait for the platter to bring the right sector around (rotational latency). Both are
            mechanical — milliseconds, not microseconds.
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}
