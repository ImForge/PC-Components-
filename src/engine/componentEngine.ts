/*
 * The fault engine. Completely UI-free.
 *
 * Key design decision: the "broken" state is never stored. computeBroken()
 * rebuilds the entire fault picture from `edits` on every render, so a fault
 * and its cascade can never drift out of sync.
 */
import { TREE } from '../data/components';
import type { ComponentNode, Spec, Edits, BrokenMap, FaultKind } from '../types';

/* ---- tree indices, built once at module load ---- */

export const FLAT: Record<string, ComponentNode> = {};
const PARENT: Record<string, string | null> = {};
export const DEPTH: Record<string, number> = {};

function indexTree(node: ComponentNode, parentId: string | null): void {
  FLAT[node.id] = node;
  PARENT[node.id] = parentId;
  DEPTH[node.id] = parentId == null ? 0 : DEPTH[parentId] + 1;
  node.children.forEach((c) => indexTree(c, node.id));
}
indexTree(TREE, null);

/** Every ancestor id of a node, nearest first. */
export function ancestorsOf(id: string): string[] {
  const out: string[] = [];
  let p = PARENT[id];
  while (p) {
    out.push(p);
    p = PARENT[p];
  }
  return out;
}

/** Every descendant id of a node. */
export function descendantsOf(id: string): string[] {
  const out: string[] = [];
  const walk = (n: ComponentNode): void => {
    n.children.forEach((c) => {
      out.push(c.id);
      walk(c);
    });
  };
  walk(FLAT[id]);
  return out;
}

/** Resolve a drill-down path (array of child ids) to a node. */
export function nodeAtPath(path: string[]): ComponentNode | null {
  let n: ComponentNode = TREE;
  for (const seg of path) {
    const next = n.children.find((c) => c.id === seg);
    if (!next) return null;
    n = next;
  }
  return n;
}

/** Returns an error string if an edited spec is out of range, else null. */
export function specFault(nodeId: string, spec: Spec, edits: Edits): string | null {
  if (!spec.editable || !spec.range) return null;
  const key = nodeId + '::' + spec.key;
  if (!(key in edits)) return null;
  const raw = edits[key];
  const num = parseFloat(raw);
  const [min, max] = spec.range;
  const u = spec.unit ? ' ' + spec.unit : '';
  if (raw.trim() === '' || isNaN(num)) return `${spec.label} = "${raw}" is not a number.`;
  if (num < min) return `${spec.label} set to ${num}${u} \u2014 below the safe minimum of ${min}${u}.`;
  if (num > max) return `${spec.label} set to ${num}${u} \u2014 above the safe maximum of ${max}${u}.`;
  return null;
}

/*
 * The whole fault picture, derived purely from `edits`.
 * A fault impairs everything that CONTAINS it and everything INSIDE it,
 * then propagates across the explicit `breaks` dependency graph.
 */
export function computeBroken(edits: Edits): BrokenMap {
  const broken: BrokenMap = {};
  const mark = (id: string, reason: string, kind: FaultKind): void => {
    if (!broken[id]) broken[id] = { reason, kind };
  };

  // 1. find every node with an out-of-range spec
  const faulted: { id: string; reason: string }[] = [];
  for (const id in FLAT) {
    for (const sp of FLAT[id].specs) {
      const err = specFault(id, sp, edits);
      if (err) {
        faulted.push({ id, reason: err });
        break;
      }
    }
  }

  // 2. a fault impairs every container and every part inside it
  for (const f of faulted) {
    mark(f.id, f.reason, 'fault');
    ancestorsOf(f.id).forEach((a) =>
      mark(a, `Contains a faulted part \u2014 ${FLAT[f.id].name}.`, 'chain'));
    descendantsOf(f.id).forEach((d) =>
      mark(d, `Parent component ${FLAT[f.id].name} has faulted.`, 'chain'));
  }

  // 3. cross-tree dependency breaks \u2014 BFS over the `breaks` graph
  const queue = faulted.map((f) => f.id);
  const seen = new Set<string>();
  while (queue.length) {
    const cur = queue.shift() as string;
    for (const target of FLAT[cur].breaks) {
      if (seen.has(target)) continue;
      seen.add(target);
      mark(target, `Depends on ${FLAT[cur].name}, which has faulted.`, 'dependency');
      descendantsOf(target).forEach((d) =>
        mark(d, `Upstream component ${FLAT[target].name} has failed.`, 'chain'));
      queue.push(target);
    }
  }
  return broken;
}

/** Current display value for a spec: the edit if present, else the default. */
export function getVal(
  edits: Edits,
  id: string,
  key: string,
  fallback: string | number,
): string {
  const k = id + '::' + key;
  return k in edits ? edits[k] : String(fallback);
}
