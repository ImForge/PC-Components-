/* Ultra-subtle motherboard traces + vias behind everything. */
export function BackgroundTraces() {
  const traces = [
    'M0 120 H180 V60 H360', 'M0 360 H120 V300 H300 V420 H520',
    'M1200 90 H980 V200 H800', 'M1200 300 H1040 V240 H900 V360 H720',
    'M0 560 H240 V640 H460', 'M1200 600 H1000 V520 H860',
    'M600 0 V140 H760 V60', 'M420 0 V90 H300 V220',
    'M600 800 V680 H440 V760', 'M820 800 V700 H960',
    'M180 60 H300 V0', 'M980 200 H880 V300',
  ];
  const vias: [number, number, boolean][] = [
    [180, 120, true], [360, 60, false], [120, 360, false], [300, 300, true],
    [520, 420, false], [980, 90, true], [800, 200, false], [900, 240, true],
    [240, 560, false], [1000, 600, true], [760, 140, false], [440, 680, true],
  ];
  return (
    <svg className="tracefx" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="#3E2F21" strokeWidth="1" opacity="0.22">
        {traces.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="none" stroke="#E2B05E" strokeWidth="1" opacity="0.10">
        {traces.filter((_, i) => i % 3 === 0).map((d, i) => <path key={i} d={d} />)}
      </g>
      {vias.map(([x, y, pulse], i) => (
        <circle key={i} cx={x} cy={y} r={pulse ? 2.6 : 2}
          fill={i % 4 === 0 ? '#E2B05E' : '#3E2F21'}
          opacity={pulse ? 0.5 : 0.28}
          style={pulse ? { animation: `pce-pulse ${3 + (i % 3)}s ease ${i * 0.4}s infinite` } : undefined} />
      ))}
    </svg>
  );
}
