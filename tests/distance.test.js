import { metersPerSecondFromWatts } from '../src/session/distance.js';

describe('metersPerSecondFromWatts', () => {
  test('returns 0 for 0 watts', () => {
    expect(metersPerSecondFromWatts(0)).toBe(0);
  });

  test('returns 0 for negative watts', () => {
    expect(metersPerSecondFromWatts(-10)).toBe(0);
  });

  test('returns a positive value for positive watts', () => {
    expect(metersPerSecondFromWatts(200)).toBeGreaterThan(0);
  });

  test('higher power produces higher speed', () => {
    const v100 = metersPerSecondFromWatts(100);
    const v200 = metersPerSecondFromWatts(200);
    const v300 = metersPerSecondFromWatts(300);
    expect(v200).toBeGreaterThan(v100);
    expect(v300).toBeGreaterThan(v200);
  });

  test('200W produces ~7-9 m/s (~25-32 km/h), a realistic cycling speed', () => {
    const v = metersPerSecondFromWatts(200);
    expect(v).toBeGreaterThan(7);
    expect(v).toBeLessThan(9);
  });

  test('100W produces ~5-7 m/s (~18-25 km/h)', () => {
    const v = metersPerSecondFromWatts(100);
    expect(v).toBeGreaterThan(5);
    expect(v).toBeLessThan(7);
  });

  test('300W produces ~9-12 m/s (~32-43 km/h)', () => {
    const v = metersPerSecondFromWatts(300);
    expect(v).toBeGreaterThan(9);
    expect(v).toBeLessThan(12);
  });
});
