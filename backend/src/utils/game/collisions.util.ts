function doLinesIntersect(
  p0: [number, number],
  p1: [number, number],
  q0: [number, number],
  q1: [number, number]
) {
  const [x1, y1] = p0;
  const [x2, y2] = p1;
  const [x3, y3] = q0;
  const [x4, y4] = q1;

  // Bounding box check first (quick reject)
  if (
    Math.max(x1, x2) < Math.min(x3, x4) ||
    Math.min(x1, x2) > Math.max(x3, x4) ||
    Math.max(y1, y2) < Math.min(y3, y4) ||
    Math.min(y1, y2) > Math.max(y3, y4)
  ) {
    return false;
  }

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return false; // parallel or collinear

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  return ua > 0 && ua < 1 && ub > 0 && ub < 1;
}

// Distance from point to line segment
function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);

  const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  const clampedT = Math.max(0, Math.min(1, t));
  const closestX = x1 + clampedT * dx;
  const closestY = y1 + clampedT * dy;

  return Math.hypot(px - closestX, py - closestY);
}

function sqrDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

// Compute the minimum distance squared between two line segments AB and CD
function segmentSegmentDistanceSquared(
  A: [number, number],
  B: [number, number],
  C: [number, number],
  D: [number, number]
) {
  const [ax, ay] = A;
  const [bx, by] = B;
  const [cx, cy] = C;
  const [dx, dy] = D;

  // Vector AB
  const abx = bx - ax;
  const aby = by - ay;
  // Vector CD
  const cdx = dx - cx;
  const cdy = dy - cy;

  const r = [ax - cx, ay - cy];
  const a = abx * abx + aby * aby; // |AB|^2
  const e = cdx * cdx + cdy * cdy; // |CD|^2
  const f = cdx * r[0] + cdy * r[1];

  let s, t;

  if (a <= 1e-8 && e <= 1e-8) {
    // Both segments degenerate to points
    return sqrDistance(ax, ay, cx, cy);
  }
  if (a <= 1e-8) {
    // AB is a point
    t = Math.max(0, Math.min(1, f / e));
    return sqrDistance(ax, ay, cx + cdx * t, cy + cdy * t);
  }
  if (e <= 1e-8) {
    // CD is a point
    s = Math.max(0, Math.min(1, -(abx * r[0] + aby * r[1]) / a));
    return sqrDistance(cx, cy, ax + abx * s, ay + aby * s);
  }

  const c = abx * r[0] + aby * r[1];
  const b = abx * cdx + aby * cdy;
  const denom = a * e - b * b;

  if (denom !== 0) {
    s = Math.max(0, Math.min(1, (b * f - c * e) / denom));
  } else {
    s = 0; // Parallel lines
  }

  t = (b * s + f) / e;

  if (t < 0) {
    t = 0;
    s = Math.max(0, Math.min(1, -c / a));
  } else if (t > 1) {
    t = 1;
    s = Math.max(0, Math.min(1, (b - c) / a));
  }

  const closestAB = [ax + abx * s, ay + aby * s];
  const closestCD = [cx + cdx * t, cy + cdy * t];

  return sqrDistance(closestAB[0], closestAB[1], closestCD[0], closestCD[1]);
}

// Main function: check if two segments collide with radius
function segmentsCollideWithWidth(
  p0: [number, number],
  p1: [number, number],
  q0: [number, number],
  q1: [number, number],
  radius: number
) {
  const distSq = segmentSegmentDistanceSquared(p0, p1, q0, q1);
  return distSq <= radius * radius;
}

export default {
  doLinesIntersect,
  pointToSegmentDistance,
  segmentsCollideWithWidth,
};
