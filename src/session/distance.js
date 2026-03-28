/**
 * Estimate distance (in meters) covered in one second at a given power output.
 *
 * Uses a simplified cycling physics model:
 *   P = (Crr * m * g + 0.5 * rho * Cd * A * v²) * v
 *
 * Constants for a typical road cyclist:
 *   m    = 80 kg  (rider + bike)
 *   g    = 9.81 m/s²
 *   Crr  = 0.004  (rolling resistance coefficient)
 *   rho  = 1.225  kg/m³ (air density at sea level)
 *   Cd*A = 0.4    m² (drag area, hoods position)
 *
 * Solves for v numerically using Newton-Raphson iteration.
 *
 * @param {number} watts - Power output in watts (>= 0)
 * @returns {number} Distance in meters for one second at that power
 */
export function metersPerSecondFromWatts(watts) {
  if (watts <= 0) return 0;

  const m = 80;
  const g = 9.81;
  const Crr = 0.004;
  const rho = 1.225;
  const CdA = 0.4;

  const F_roll = Crr * m * g;          // ~3.14 N
  const k = 0.5 * rho * CdA;           // ~0.245

  // P(v) = (F_roll + k*v²) * v — solve for v given P
  // Initial guess: v ≈ (P / F_roll)^(1/3) capped at 20 m/s
  let v = Math.min(Math.cbrt(watts / F_roll), 20);

  for (let i = 0; i < 20; i++) {
    const f  = (F_roll + k * v * v) * v - watts;
    const df = F_roll + 3 * k * v * v;
    const dv = f / df;
    v -= dv;
    if (Math.abs(dv) < 1e-6) break;
  }

  return Math.max(v, 0); // meters per second = meters in 1 second
}
