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

export default { doLinesIntersect };
