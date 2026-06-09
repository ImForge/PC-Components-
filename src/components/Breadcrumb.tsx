import { TREE } from '../data/components';

export function Breadcrumb({ path, onJump, maxDepth }: { path: string[]; onJump: (p: string[]) => void; maxDepth: number }) {
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'PC System' }];
  let n = TREE;
  for (const seg of path) {
    n = n.children.find((c) => c.id === seg)!;
    crumbs.push({ id: seg, name: n.name.split(' — ')[0] });
  }
  const cur = path.length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 && <span className="mono" style={{ color: 'var(--ink3)', padding: '0 4px' }}>▸</span>}
            <button className={'crumb' + (i === crumbs.length - 1 ? ' here' : '')}
              onClick={() => onJump(path.slice(0, i))}>{c.name}</button>
          </span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="lbl">depth</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {Array.from({ length: maxDepth + 1 }).map((_, i) => (
            <span key={i} className={'depthtick' + (i === cur ? ' cur' : i < cur ? ' on' : '')} />
          ))}
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--teal)' }}>{String(cur).padStart(2, '0')}/{String(maxDepth).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
