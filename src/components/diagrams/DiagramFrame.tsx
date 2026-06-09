import type { ReactNode } from 'react';

export function DiagramFrame({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="panel" style={{ padding: "16px 18px", marginBottom: 22 }}>
      <div className="mono" style={{ fontSize: 11.5, letterSpacing: ".14em", color: "var(--ink3)", marginBottom: 12, textTransform: "uppercase" }}>
        ◢ Live diagram — {title}
      </div>
      {children}
      {hint && <div style={{ fontSize: 13, color: "var(--ink2)", marginTop: 12, lineHeight: 1.6 }}>{hint}</div>}
    </div>
  );
}
