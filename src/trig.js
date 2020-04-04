let PI = Math.PI
let twoPI = Math.PI * 2

/**
 * Given an angle and hypotenuse, return the opposite edge length (the X
 * component).
 *
 * Note: the 0-degree angle is a straight vertical line traveling up from the
 * origin point, so the opposite edge of the angle is horizontal.
 */
export function calculateHorizontal(angle, hypotenuse) {
  return Math.sin(angle) * hypotenuse
}

/**
 * Given an angle and a hypotenuse, return the adjacent edge length (the Y
 * component). This value is negated, since the Y-axis increases downwards.
 *
 * Note: the 0-degree angle is a straight vertical line traveling up from the
 * origin point, so the adjacent edge of the angle is also vertical.
 */
export function calculateVertical(angle, hypotenuse) {
  return -Math.cos(angle) * hypotenuse
}

/**
 * Calculate the distance between two points. If only one set of coordinates is
 * given, the second set is assumed to be the origin point.
 */
export function calculateDistance(x1, y1, x0 = 0, y0 = 0) {
  let diffX = x1 - x0
  let diffY = y1 - y0
  return Math.sqrt(diffX * diffX + diffY * diffY)
}

/**
 * Normalizes an angle (in radians) so that it is always between 0 and
 * 2 * PI.
 */
export function normalizeAngle(angle) {
  while (angle >= twoPI) {
    angle -= twoPI
  }
  while (angle < 0) {
    angle += twoPI
  }
  return angle
}

/**
 * Calculate the angle (in radians) between two X-Y coordinates.
 */
export function calculateAngle(x1, y1, x2, y2) {
  let diffX = x2 - x1
  let diffY = y2 - y1
  let rad = Math.atan(-diffX / diffY)

  // Math.atan() only works for a half circle, so we must manually adjust
  // it to work for a full circle
  return diffY < 0 ? rad : rad + PI
}

/**
 * Subtract two angles such that a rotation of `angle1` by the result
 * will equal `angle2`. A positive result means `angle2` is closer going
 * clockwise from `angle1`, a negative result means counter-clockwise.
 */
export function diffAngles(angle1, angle2) {
  let diff = normalizeAngle(angle2) - normalizeAngle(angle1)
  if (diff > PI) {
    return diff - twoPI
  } else if (diff < -PI) {
    return diff + twoPI
  } else {
    return diff
  }
}
