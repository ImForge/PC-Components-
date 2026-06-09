/* Picks the right animated diagram for a node, if it has one. */
import type { ComponentNode, Edits } from '../../types';
import { SystemDiagram } from './SystemDiagram';
import { PipelineDiagram } from './PipelineDiagram';
import { MosfetDiagram } from './MosfetDiagram';
import { DramDiagram } from './DramDiagram';
import { GateDiagram } from './GateDiagram';
import { LatticeDiagram } from './LatticeDiagram';
import { GpuSmDiagram } from './GpuSmDiagram';
import { FlashDiagram } from './FlashDiagram';
import { ClockDiagram } from './ClockDiagram';
import { PsuDiagram } from './PsuDiagram';
import { HddDiagram } from './HddDiagram';

export function Diagram({ node, edits, brokenHere }: { node: ComponentNode; edits: Edits; brokenHere: boolean }) {
  switch (node.diagram) {
    case "system": return <SystemDiagram />;
    case "pipeline": return <PipelineDiagram broken={brokenHere} />;
    case "mosfet": return <MosfetDiagram node={node} edits={edits} broken={brokenHere} />;
    case "dram": return <DramDiagram broken={brokenHere} />;
    case "gate": return <GateDiagram broken={brokenHere} />;
    case "lattice": return <LatticeDiagram />;
    case "gpu-sm": return <GpuSmDiagram broken={brokenHere} />;
    case "flash": return <FlashDiagram broken={brokenHere} />;
    case "clock": return <ClockDiagram broken={brokenHere} />;
    case "psu": return <PsuDiagram />;
    case "hdd": return <HddDiagram broken={brokenHere} />;
    default: return null;
  }
}
