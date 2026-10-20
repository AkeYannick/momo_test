// Motif décoratif façon QR code (pas un vrai QR : aucun contenu encodé)
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function QrDecor() {
  const N = 25;
  const rand = rng(2610);
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  let d = "";
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (!inFinder(x, y) && rand() > 0.52) d += `M${x} ${y}h1v1h-1z`;

  const finder = (ox: number, oy: number) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" fill="#000" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" fill="#000" />
    </g>
  );

  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" width="100%" role="img" aria-label="QR code">
      <path d={d} fill="#000" />
      {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
    </svg>
  );
}
