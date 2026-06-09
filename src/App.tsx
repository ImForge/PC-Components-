import { useState, useMemo, useEffect, useRef } from 'react';
import { TREE } from './data/components';
import { computeBroken, nodeAtPath, FLAT, DEPTH, descendantsOf } from './engine/componentEngine';
import type { Edits, ComponentNode } from './types';
import { CAT_COLOR } from './components/Icon';
import { Breadcrumb } from './components/Breadcrumb';
import { StatusBar } from './components/StatusBar';
import { SpecsTable } from './components/SpecsTable';
import { HowItWorks } from './components/HowItWorks';
import { ChildGrid } from './components/ChildGrid';
import { Diagram } from './components/diagrams';
import { BackgroundTraces } from './components/BackgroundTraces';
import { SystemArchitecture } from './components/SystemArchitecture';
import { ANALOGY } from './data/analogies';

const MAX_DEPTH = Math.max(...Object.values(DEPTH));
const NODE_COUNT = Object.keys(FLAT).length;
const HEADLINE = ['transistors', 'boostClock', 'frequency', 'baseClock', 'clock', 'l3Cache', 'size',
  'busWidth', 'memoryBus', 'capacity', 'cores', 'tdp', 'speed', 'wattage', 'rpm', 'gateLength', 'dieSize'];

function archId(id: string): string {
  let h = 0;
  for (const ch of id) h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
  return '0x' + (h >>> 0).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
}

export default function PCComponentExplorer() {
  const [path, setPath] = useState<string[]>([]);
  const [edits, setEdits] = useState<Edits>({});
  const pathRef = useRef<string[]>([]);
  pathRef.current = path;

  const broken = useMemo(() => computeBroken(edits), [edits]);
  const node: ComponentNode = nodeAtPath(path) || TREE;
  const brokenHere = broken[node.id];
  const accent = brokenHere ? 'var(--red)' : CAT_COLOR[node.cat] || 'var(--teal)';
  const atRoot = path.length === 0;
  const subnodes = descendantsOf(node.id).length;
  const headline = node.specs.filter((s) => HEADLINE.includes(s.key)).slice(0, 4);
  const faultCount = Object.keys(broken).length;
  const [mainName, subName] = node.name.split(' — ');

  const pushPath = (next: string[]) => {
    setPath(next);
    try { window.history.pushState({ p: next }, ''); } catch { /* sandboxed iframe */ }
  };
  const drill = (id: string) => pushPath([...path, id]);
  const jump = (p: string[]) => pushPath(p);
  const back = () => {
    if (path.length === 0) return;
    try { window.history.back(); } catch { setPath((p) => p.slice(0, -1)); }
  };
  const onEdit = (id: string, key: string, value: string) => setEdits((e) => ({ ...e, [id + '::' + key]: value }));
  const onRevert = (id: string, key: string) => setEdits((e) => { const n = { ...e }; delete n[id + '::' + key]; return n; });

  // Sync drill-down with real browser history so the device back button,
  // swipe-back gesture, and the Esc / Alt+Left shortcuts all navigate.
  useEffect(() => {
    try { window.history.replaceState({ p: [] }, ''); } catch { /* ignore */ }
    const onPop = (e: PopStateEvent) => {
      const p = e.state && (e.state as { p?: string[] }).p;
      setPath(Array.isArray(p) ? p : []);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'Escape' || (e.altKey && e.key === 'ArrowLeft')) {
        if (pathRef.current.length === 0) return;
        e.preventDefault();
        try { window.history.back(); } catch { setPath((p) => p.slice(0, -1)); }
      }
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('popstate', onPop); window.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div className="pce">
      <div className="gridfx" />
      <BackgroundTraces />
      <div className="wrap">

        {/* ── nav ── */}
        <div className="moc-nav">
          <span className="brand"><span style={{ color: 'var(--teal)' }}>◆</span>&nbsp; SILICON · ARCHITECTURE</span>
          <span style={{ flex: 1 }} />
          <span className="lbl">Raipur · Est. MMXXV</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: faultCount ? 'var(--red)' : 'var(--teal)', boxShadow: `0 0 7px ${faultCount ? 'var(--red)' : 'var(--teal)'}` }} />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: faultCount ? 'var(--red)' : 'var(--ink2)' }}>
            {faultCount ? `${faultCount} FAULT` : 'NOMINAL'}
          </span>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--line2), transparent)', margin: '4px 0 18px' }} />

        <StatusBar broken={broken} editCount={Object.keys(edits).length} onReset={() => setEdits({})} />
        <Breadcrumb path={path} onJump={jump} maxDepth={MAX_DEPTH} />

        <div className="zoomin" key={node.id}>
          {/* ── editorial node panel ── */}
          <div className="panel edge" style={{
            padding: '28px 30px', marginBottom: 24,
            borderColor: brokenHere ? 'var(--red)' : 'var(--line)',
            background: brokenHere
              ? 'linear-gradient(180deg, var(--reddim), var(--panel))'
              : `radial-gradient(460px 200px at 50% -50%, color-mix(in srgb, ${accent} 13%, transparent), transparent 70%), linear-gradient(180deg, var(--panel2), var(--panel))`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 16, flexWrap: 'wrap' }}>
              {!atRoot && (
                <>
                  <button className="btn btn-back" onClick={back}>← Back</button>
                  <span className="mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--ink3)', border: '1px solid var(--line)', borderRadius: 3, padding: '2px 5px' }}>ESC</span>
                </>
              )}
              <span className="mono" style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: accent }}>
                {node.cat} — Depth {String(DEPTH[node.id]).padStart(2, '0')}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: brokenHere ? 'var(--red)' : 'var(--teal)', boxShadow: `0 0 8px ${brokenHere ? 'var(--red)' : 'var(--teal)'}` }} />
              <span className="mono" style={{ fontSize: 10.5, letterSpacing: '.12em', color: brokenHere ? 'var(--red)' : 'var(--ink3)' }}>
                {brokenHere ? (brokenHere.kind === 'fault' ? 'FAULTED' : brokenHere.kind === 'dependency' ? 'DEP FAILURE' : 'CHAIN BROKEN') : 'NOMINAL'}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--serif)', fontSize: atRoot ? 42 : 32, fontWeight: 600, lineHeight: 1.02, letterSpacing: '-0.015em', color: 'var(--ink)' }}>
              {mainName}{subName && (
                <span style={{ display: 'block', fontSize: '0.46em', fontWeight: 500, color: 'var(--ink2)', marginTop: 8, letterSpacing: 0 }}>{subName}</span>
              )}
            </h2>

            {ANALOGY[node.id] && (
              <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 19, color: 'var(--teal)', margin: '16px 0 0', maxWidth: 640 }}>
                “{ANALOGY[node.id]}”
              </p>
            )}
            <p style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.65, maxWidth: 660, marginTop: 12 }}>{node.tagline}</p>

            {headline.length > 0 && (
              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <div className="meta"><span>Arch-ID</span><b className="mono">{archId(node.id)}</b></div>
                <div className="meta"><span>Subnodes</span><b className="mono">{subnodes}</b></div>
                {headline.map((s) => (
                  <div key={s.key} className="meta">
                    <span>{s.label}</span>
                    <b className="mono" style={{ fontSize: 14 }}>{s.value}<span style={{ color: 'var(--ink3)', fontSize: 10 }}>{s.unit ? ' ' + s.unit : ''}</span></b>
                  </div>
                ))}
              </div>
            )}

            {brokenHere && (
              <div style={{ marginTop: 16, padding: '10px 13px', borderRadius: 3, background: 'var(--reddim)', border: '1px solid var(--red)', fontSize: 13, color: 'var(--red)', lineHeight: 1.55 }}>
                <span className="mono" style={{ fontWeight: 500, letterSpacing: '.06em' }}>FAULT REPORT »</span> {brokenHere.reason}
              </div>
            )}
          </div>

          {atRoot
            ? <SystemArchitecture onOpen={drill} />
            : <Diagram node={node} edits={edits} brokenHere={!!brokenHere} />}

          <SpecsTable node={node} edits={edits} onEdit={onEdit} onRevert={onRevert} />
          <HowItWorks paragraphs={node.how} />
          <ChildGrid node={node} broken={broken} onDrill={drill} />
        </div>

        <div className="mono" style={{ textAlign: 'center', marginTop: 46, fontSize: 10, letterSpacing: '.16em', color: 'var(--ink3)' }}>
          SILICON ARCHITECTURE EXPLORER · {NODE_COUNT} NODES · {MAX_DEPTH + 1} LAYERS · “STAY FOR ONE MORE”
        </div>
      </div>
    </div>
  );
}
