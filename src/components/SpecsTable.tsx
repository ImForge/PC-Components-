import { useState } from 'react';
import { specFault, getVal } from '../engine/componentEngine';
import type { ComponentNode, Edits, Spec } from '../types';

export function SpecsTable({ node, edits, onEdit, onRevert }: { node: ComponentNode; edits: Edits; onEdit: (id: string, key: string, value: string) => void; onRevert: (id: string, key: string) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  if (node.specs.length === 0) return null;

  const begin = (sp: Spec) => { setEditing(sp.key); setDraft(getVal(edits, node.id, sp.key, sp.value)); };
  const commit = () => { if (editing != null) onEdit(node.id, editing, draft); setEditing(null); };

  return (
    <div style={{ marginBottom: 22 }}>
      <div className="lbl" style={{ marginBottom: 10 }}>
        ◢ Specifications {node.specs.some((s) => s.editable) && <span style={{ color: 'var(--teal)' }}>— click a gold value to edit</span>}
      </div>
      <div className="panel" style={{ overflow: "hidden" }}>
        {node.specs.map((sp) => {
          const ek = node.id + "::" + sp.key;
          const modified = ek in edits;
          const fault = specFault(node.id, sp, edits);
          const val = getVal(edits, node.id, sp.key, sp.value);
          const isEditing = editing === sp.key;
          const valColor = fault ? "var(--red)" : modified ? "var(--amber)" : sp.editable ? "var(--teal)" : "var(--ink)";

          if (isEditing) {
            return (
              <div key={sp.key} className="specrow" style={{ background: "rgba(216,165,63,.07)" }}>
                <div style={{ flex: 1 }}>
                  <span className="mono" style={{ fontSize: 14, color: "var(--ink)" }}>{sp.label}</span>
                  {sp.range && <span className="mono" style={{ fontSize: 11, color: "var(--ink3)", marginLeft: 8 }}>
                    safe: {sp.range[0]}–{sp.range[1]} {sp.unit}</span>}
                </div>
                <input className="cell mono" autoFocus value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(null); }} />
                <span className="mono" style={{ fontSize: 12, color: "var(--ink3)", width: 36 }}>{sp.unit}</span>
                <button className="btn on" onClick={commit}>save</button>
                <button className="btn" onClick={() => setEditing(null)}>esc</button>
                {modified && <button className="btn" onClick={() => { onRevert(node.id, sp.key); setEditing(null); }}>default</button>}
              </div>
            );
          }
          return (
            <div key={sp.key} className={"specrow" + (sp.editable ? " edit" : "")}
              title={sp.desc} onClick={() => sp.editable && begin(sp)}>
              <span className="mono" style={{ flex: 1, fontSize: 14, color: "var(--ink2)" }}>{sp.label}</span>
              <span style={{ fontSize: 12.5, color: "var(--ink2)", flex: 2, lineHeight: 1.45 }}
                className="specdesc">{sp.desc}</span>
              <span className="mono" style={{ fontSize: 15, color: valColor, textAlign: "right", whiteSpace: "nowrap" }}>
                {val}{sp.unit && <span style={{ color: "var(--ink3)", fontSize: 12 }}> {sp.unit}</span>}
                {sp.editable && !modified && <span style={{ color: "var(--teal)", marginLeft: 7 }}>✎</span>}
                {modified && !fault && <span style={{ color: "var(--amber)", marginLeft: 7 }}>●</span>}
                {fault && <span style={{ marginLeft: 7 }}>⚠</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
