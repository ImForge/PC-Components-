import type { BrokenMap } from '../types';

export function StatusBar({ broken, editCount, onReset }: { broken: BrokenMap; editCount: number; onReset: () => void }) {
  const count = Object.keys(broken).length;
  const fault = count > 0;
  const color = fault ? 'var(--red)' : 'var(--teal)';
  return (
    <div className="panel" style={{
      display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
      padding: '10px 16px', marginBottom: 16,
      borderColor: fault ? 'var(--red)' : 'var(--line)',
      background: fault ? 'var(--reddim)' : 'linear-gradient(165deg, var(--panel2), var(--panel))',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 9px ${color}`, animation: fault ? 'pce-blink 1s steps(1) infinite' : 'none' }} />
      <span className="mono" style={{ fontSize: 11.5, color, letterSpacing: '.08em' }}>
        {fault ? `SYSTEM FAULT · ${count} NODE${count > 1 ? 'S' : ''} AFFECTED` : 'ALL SYSTEMS NOMINAL'}
      </span>
      <span style={{ flex: 1 }} />
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink3)', letterSpacing: '.06em' }}>{editCount} SPEC{editCount === 1 ? '' : 'S'} MODIFIED</span>
      {editCount > 0 && <button className="btn warn" onClick={onReset}>↺ RESET</button>}
    </div>
  );
}
