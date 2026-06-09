import { useState } from 'react';

export function HowItWorks({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(true);
  if (!paragraphs || paragraphs.length === 0) return null;
  return (
    <div className="panel" style={{ marginBottom: 22, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 9,
        background: "var(--panel2)", border: "none", cursor: "pointer",
        padding: "11px 16px", color: "var(--ink)",
      }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: ".13em", color: "var(--teal)" }}>◢ HOW IT WORKS</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: "var(--ink3)", transform: open ? "rotate(90deg)" : "none", transition: ".2s" }}>▸</span>
      </button>
      {open && (
        <div style={{ padding: "14px 18px 4px" }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, color: "var(--ink2)", marginBottom: 12, lineHeight: 1.68 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}
