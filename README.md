# Silicon Architecture Explorer

An interactive hardware explorer that lets you **drill from a whole desktop PC down to a single silicon atom &mdash; or a single magnetic grain** — and edit any spec to watch a fault break the chain.

A premium hardware-exploration tool with a warm, cinematic "More Over Coffee"-inspired theme — near-black, cream type, tungsten gold, and an elegant serif. Drill from a whole PC down to a single atom, watch live data flow between subsystems, and break the chain by editing any spec. React + TypeScript + Vite. Every diagram and animation is hand-built SVG/CSS — no animation libraries.

---

## What it is

Most "how a computer works" resources stop at block diagrams. This one keeps zooming. Start at the whole machine, open the CPU, then the die, a P-core, the ALU, a 64-bit adder, a 1-bit full adder, an XOR gate, a MOSFET transistor — and finally the **silicon crystal lattice**: individual atoms, covalent bonds, dopants, and the free electrons that carry every bit.

Below that node there is no more "computer" — only quantum mechanics. That's the floor.

It isn't CPU-only. Seven real subsystems are fully modelled: **CPU, GPU, RAM, ROM/BIOS, Storage (NVMe), PSU, and the Motherboard.**

## Features

- **Deep drill-down** — 60 components across 11 levels of zoom, each with a physical scale label.
- **Editable specs** — click any blue value and change it. Push a value out of its safe range and the component **faults**.
- **Break-the-chain simulation** — a fault propagates *up* (a broken transistor breaks the gate, the adder, the ALU, the core, the CPU), *down* (break the die and everything inside it dies), and *across* (kill the PSU and every powered subsystem fails). Sibling parts stay isolated.
- **11 live, interactive diagrams** — drag a MOSFET's gate voltage to open its channel; watch a DRAM cell's capacitor leak in real time; flip the inputs on an XOR gate; dope a silicon lattice and watch a free electron appear; trace AC→DC conversion through a PSU; and more.
- **"How it works"** prose on every node.
- **Live SYSTEM ARCHITECTURE hero** — animated Storage → RAM → CPU buses with flowing load, fetch and write-back packets.
- **Hardware-module cards** styled per category (chips, memory sticks, PSU, mechanical), with depth level, real-world analogy, key specs and a status indicator.
- **Motherboard-trace background**, engineering grid, and depth navigation that makes each click feel like zooming deeper into the machine.

## The fault engine (the important bit)

The broken state is **never stored**. `computeBroken(edits)` is a pure function that rebuilds the entire fault picture from the user's edits on every render. This means a fault and its whole cascade can never drift out of sync or get stuck — recovering a value instantly clears everything downstream. See [`src/engine/componentEngine.ts`](src/engine/componentEngine.ts).

## Tech stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 5** for dev/build
- Type: Fraunces (serif display) + Spectral (body), JetBrains Mono (labels & data)
- Styling: a single scoped CSS file with custom properties — no Tailwind, no CSS-in-JS runtime
- Animation: pure CSS keyframes + minimal React state — no Framer Motion

## Project structure

```
src/
├── main.tsx                     entry point
├── App.tsx                      top-level state + layout
├── index.css                    all styles (scoped under .pce)
├── types.ts                     shared type definitions
├── data/
│   └── components.ts            THE TREE — pure data, no logic
├── engine/
│   └── componentEngine.ts       indices + the derived-fault system
└── components/
    ├── Icon.tsx                 category line-icons + colors
    ├── Breadcrumb.tsx
    ├── StatusBar.tsx
    ├── SpecsTable.tsx           editable spec rows
    ├── HowItWorks.tsx
    ├── ChildGrid.tsx            drill-down cards
    └── diagrams/
        ├── DiagramFrame.tsx     shared wrapper
        ├── index.tsx            picks the right diagram for a node
        ├── SystemDiagram.tsx    PipelineDiagram.tsx   MosfetDiagram.tsx
        ├── DramDiagram.tsx      GateDiagram.tsx        LatticeDiagram.tsx
        ├── GpuSmDiagram.tsx     FlashDiagram.tsx       ClockDiagram.tsx
        ├── HddDiagram.tsx
        └── PsuDiagram.tsx
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

## Extending it

**Add a component:** drop a new node into the tree in `src/data/components.ts`. Give it an `id`, `cat`, `specs`, `how`, and optional `children`. It appears automatically — no wiring needed.

**Make a spec breakable:** use the `E(label, unit, value, desc, [min, max])` helper instead of `S(...)`. Any edit outside `[min, max]` faults the component.

**Add a cross-dependency:** put another node's `id` in this node's `breaks: []` array. If this node faults, that one fails too.

**Add a diagram:** create a component in `src/components/diagrams/`, add a case for it in `diagrams/index.tsx`, and set `diagram: 'your-id'` on the node (and add the id to the `DiagramId` union in `types.ts`).

---

Built by Forge.
