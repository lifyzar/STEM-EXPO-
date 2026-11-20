export interface Point2D {
  x: number;
  y: number;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function normalizeDeg(deg: number): number {
  const mod = ((deg % 360) + 360) % 360;
  return mod >= 359.95 ? 0 : mod;
}

/**
 * Formats a bearing angle as a three-figure bearing string (e.g. 008°, 090°, 235°).
 */
export function formatBearing(deg: number): string {
  const rounded = Math.round(normalizeDeg(deg)) % 360;
  return `${String(rounded).padStart(3, '0')}°`;
}

/**
 * Calculates clockwise bearing from North in a standard 2D screen/SVG grid
 * where +x is East and -y is North.
 */
export function calculateBearing(from: Point2D, to: Point2D): number {
  const dx = to.x - from.x; // East
  const dy = from.y - to.y; // North (since screen y increases downward)
  const rad = Math.atan2(dx, dy);
  return normalizeDeg(radToDeg(rad));
}

export function calculateBackBearing(bearing: number): number {
  return normalizeDeg(bearing + 180);
}

export function calculateDistance(a: Point2D, b: Point2D, scalePerUnit = 1): number {
  return Math.hypot(b.x - a.x, b.y - a.y) * scalePerUnit;
}

/**
 * Returns a point at radius r and clockwise bearing deg from North.
 */
export function polarFromNorth(cx: number, cy: number, r: number, bearingDeg: number): Point2D {
  const rad = degToRad(bearingDeg);
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  };
}

/**
 * Generates an SVG path string for a clockwise arc starting at startDeg from North
 * and sweeping sweepDeg clockwise.
 */
export function describeClockwiseArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number
): string {
  const clampedSweep = Math.max(0.01, Math.min(359.9, sweepDeg));
  const start = polarFromNorth(cx, cy, r, startDeg);
  const end = polarFromNorth(cx, cy, r, startDeg + clampedSweep);
  const largeArc = clampedSweep > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Generates an SVG filled sector path clockwise from North.
 */
export function describeClockwiseSector(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number
): string {
  if (sweepDeg <= 0.1) return '';
  const clampedSweep = Math.min(359.9, sweepDeg);
  const start = polarFromNorth(cx, cy, r, startDeg);
  const end = polarFromNorth(cx, cy, r, startDeg + clampedSweep);
  const largeArc = clampedSweep > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

/**
 * Computes interior angle at vertex B between BA and BC using Law of Cosines.
 */
export function interiorAngleAt(a: Point2D, b: Point2D, c: Point2D): number {
  const baX = a.x - b.x;
  const baY = a.y - b.y;
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;
  const magBA = Math.hypot(baX, baY);
  const magBC = Math.hypot(bcX, bcY);
  if (magBA < 1e-6 || magBC < 1e-6) return 0;
  const cosTheta = Math.max(-1, Math.min(1, (baX * bcX + baY * bcY) / (magBA * magBC)));
  return radToDeg(Math.acos(cosTheta));
}

export function roundTo(val: number, dp = 2): string {
  if (!Number.isFinite(val)) return 'Undefined';
  return val.toFixed(dp);
}
