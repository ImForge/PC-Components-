import { Icon, CAT_COLOR } from './Icon';
import { DEPTH } from '../engine/componentEngine';
import { ANALOGY } from '../data/analogies';
import type { ComponentNode, BrokenMap, Category } from '../types';

/* faint category motif in the card corner */
function Motif({ cat, color }: { cat: Category; color: string }) {
  const memory = cat === 'memory';
  const power = cat === 'power';
  const mech = cat === 'mechanical';
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" style={{ position: 'absolute', right: 6, top: 6, opacity: 0.16 }}>
      {memory && [0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={6 + i * 6} y={30} width="3" height="10" fill={color} />
      ))}
      {power && <path d="M26 6 14 26h8l-2 14 14-20h-8z" fill="none" stroke={color} strokeWidth="1.4" />}
      {mech && <><circle cx="26" cy="20" r="9" fill="none" stroke={color} strokeWidth="1.4" /><circle cx="26" cy="20" r="3" fill={color} /></>}
      {!memory && !power && !mech && [0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <circle key={`${r}-${c}`} cx={14 + c * 9} cy={10 + r * 9} r="1.6" fill={color} />
      )))}
    </svg>
  );
}

export function ChildGrid({ node, broken, onDrill }: { node: ComponentNode; broken: BrokenMap; onDrill: (id: string) => void }) {
  if (node.children.length === 0) {
    return (
      <div className="panel" style={{ padding: '18px', textAlign: 'center' }}>
        <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink3)', letterSpacing: '.08em' }}>
          ▣ DEEPEST LEVEL REACHED — no smaller structure to inspect
        </span>
      </div>
    );
  }
  return (
    <div>
      <div className="lbl" style={{ marginBottom: 10 }}>
        ◢ Subcomponents — {node.children.length} module{node.children.length > 1 ? 's' : ''} · depth {String(DEPTH[node.id] + 1).padStart(2, '0')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(258px,1fr))', gap: 12 }}>
        {node.children.map((c) => {
          const isBroken = !!broken[c.id];
          const accent = isBroken ? 'var(--red)' : CAT_COLOR[c.cat];
          const specs = c.specs.slice(0, 2);
          return (
            <button key={c.id} className={'card' + (isBroken ? ' broken' : '')}
              style={{ ['--accent' as never]: accent }} onClick={() => onDrill(c.id)}>
              <span className="pins"><i /><i /><i /><i /><i /></span>
              <Motif cat={c.cat} color={accent} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8, paddingLeft: 4 }}>
                <span style={{ color: accent }}><Icon cat={c.cat} size={19} /></span>
                <span className="cardname">
                  {c.name.split(' — ')[0]}
                </span>
              </div>
              <div className="mono" style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 9, paddingLeft: 4 }}>
                <span style={{ fontSize: 10, letterSpacing: '.12em', color: 'var(--ink3)', border: '1px solid var(--line2)', padding: '1px 5px', borderRadius: 2 }}>
                  DEPTH {String(DEPTH[c.id]).padStart(2, '0')}
                </span>
                <span style={{ flex: 1 }} />
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isBroken ? 'var(--red)' : 'var(--teal)', boxShadow: `0 0 6px ${isBroken ? 'var(--red)' : 'var(--teal)'}` }} />
                <span style={{ fontSize: 10, letterSpacing: '.1em', color: isBroken ? 'var(--red)' : 'var(--ink3)' }}>{isBroken ? 'FAULT' : 'NOMINAL'}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink2)', lineHeight: 1.5, marginBottom: 10, paddingLeft: 4, minHeight: 32 }}>
                {ANALOGY[c.id] || c.tagline}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 4 }}>
                {specs.map((s) => (
                  <span key={s.key} className="mono" style={{ fontSize: 11, color: 'var(--ink2)', background: 'var(--panel3)', border: '1px solid var(--line)', borderRadius: 3, padding: '2px 7px' }}>
                    <span style={{ color: 'var(--ink3)' }}>{s.label}</span> {s.value}{s.unit && <span style={{ color: 'var(--ink3)' }}> {s.unit}</span>}
                  </span>
                ))}
                <span style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 11, color: accent, alignSelf: 'center' }}>
                  {c.children.length ? `${c.children.length} ▸` : 'leaf'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
