/* Shared type definitions for the component tree and the fault engine. */

export type Category =
  | 'system' | 'chip' | 'core' | 'circuit' | 'logic'
  | 'transistor' | 'atom' | 'memory' | 'mechanical' | 'power';

export type DiagramId =
  | 'system' | 'pipeline' | 'mosfet' | 'dram' | 'gate'
  | 'lattice' | 'gpu-sm' | 'flash' | 'clock' | 'psu' | 'hdd';

/** One row in a component's specification table. */
export interface Spec {
  key: string;
  label: string;
  unit: string;
  value: string | number;
  desc: string;
  /** Editable specs can be changed by the user. */
  editable?: boolean;
  /** [min, max] — a value outside this range faults the component. */
  range?: [number, number];
}

/** A node in the hardware tree. Children are the parts you can drill into. */
export interface ComponentNode {
  id: string;
  name: string;
  cat: Category;
  tagline: string;
  scale: string;
  specs: Spec[];
  how: string[];
  diagram?: DiagramId;
  /** Cross-tree node ids that fail if THIS node faults. */
  breaks: string[];
  children: ComponentNode[];
}

/** Every edit the user has made. Key format: "nodeId::specKey". */
export type Edits = Record<string, string>;

export type FaultKind = 'fault' | 'chain' | 'dependency';

export interface Fault {
  reason: string;
  kind: FaultKind;
}

/** The full derived fault picture: node id -> why it is broken. */
export type BrokenMap = Record<string, Fault>;
