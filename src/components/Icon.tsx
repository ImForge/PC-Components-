import type { ReactNode } from 'react';
import type { Category } from '../types';

export function Icon({ cat, size = 22, color = "currentColor" }: { cat: Category; size?: number; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const body: Record<string, ReactNode> = {
    system: <><rect x="3" y="4" width="18" height="12" rx="1.5" {...p} /><path d="M9 20h6M12 16v4" {...p} /></>,
    chip: <><rect x="6" y="6" width="12" height="12" rx="1.5" {...p} /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" {...p} /></>,
    core: <><rect x="4" y="4" width="16" height="16" rx="2" {...p} /><path d="M9 4v16M15 4v16M4 9h16M4 15h16" {...p} /></>,
    circuit: <><circle cx="6" cy="6" r="2.4" {...p} /><circle cx="18" cy="9" r="2.4" {...p} /><circle cx="9" cy="18" r="2.4" {...p} /><path d="M8 7.5 16 8.2M7.5 8 8.4 16" {...p} /></>,
    logic: <><path d="M5 5h7c4 0 7 3 7 7s-3 7-7 7H5z" {...p} /><path d="M2 9h3M2 15h3M19 12h3" {...p} /></>,
    transistor: <><circle cx="12" cy="12" r="8" {...p} /><path d="M4 12h4M9 7v10M9 10l7-4M9 14l7 4M16 3v6M16 15v6" {...p} /></>,
    atom: <><circle cx="12" cy="12" r="2" {...p} /><ellipse cx="12" cy="12" rx="10" ry="4" {...p} /><ellipse cx="12" cy="12" rx="10" ry="4" {...p} transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" {...p} transform="rotate(120 12 12)" /></>,
    memory: <><rect x="3" y="6" width="18" height="4" rx="1" {...p} /><rect x="3" y="14" width="18" height="4" rx="1" {...p} /><path d="M7 6v-2M12 6v-2M17 6v-2" {...p} /></>,
    mechanical: <><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" {...p} /></>,
    power: <><path d="M13 2 4 14h6l-1 8 9-12h-6z" {...p} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{body[cat] || body.chip}</svg>;
}

export const CAT_COLOR: Record<Category, string> = {
  system: "var(--teal)", chip: "var(--teal)", core: "var(--blue)",
  circuit: "var(--blue)", logic: "var(--amber)", transistor: "var(--amber)",
  atom: "var(--green)", memory: "var(--blue)", mechanical: "var(--ink2)",
  power: "var(--amber)",
};
