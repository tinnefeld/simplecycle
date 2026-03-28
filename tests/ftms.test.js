import {
  parseIndoorBikeData,
  parseCyclingPowerMeasurement,
  buildSetTargetPowerCommand,
  OP_SET_TARGET_POWER,
} from '../src/bluetooth/ftms.js';

// Helper: build a DataView from a byte array.
function dv(bytes) {
  return new DataView(new Uint8Array(bytes).buffer);
}

describe('parseIndoorBikeData', () => {
  test('parses instantaneous power and cadence when both flags set', () => {
    // Flags: bit 2 (cadence present) | bit 6 (power present) = 0x0044
    // Bit 0 = 0 → Instantaneous Speed field IS present (must be included in layout).
    // Layout: flags(2), speed(2), cadence(2, 0.5rpm res), power(2, 1W)
    // cadence raw = 160 => 80 rpm; power = 200 W
    const bytes = [
      0x44, 0x00,   // flags: bits 2 and 6 (bit 0 clear → speed present)
      0x00, 0x00,   // instantaneous speed (skipped, value irrelevant)
      0xA0, 0x00,   // instantaneous cadence: 160 * 0.5 = 80 rpm
      0xC8, 0x00,   // instantaneous power: 200 W
    ];
    const { watts, cadence } = parseIndoorBikeData(dv(bytes));
    expect(watts).toBe(200);
    expect(cadence).toBe(80);
  });

  test('returns null watts when power flag not set', () => {
    // Flags: only cadence present (bit 2); bit 0 clear → speed present
    const bytes = [
      0x04, 0x00,   // flags: bit 2 only
      0x00, 0x00,   // speed (skip)
      0x5A, 0x00,   // cadence raw 90 => 45 rpm
    ];
    const { watts, cadence } = parseIndoorBikeData(dv(bytes));
    expect(watts).toBeNull();
    expect(cadence).toBe(45);
  });

  test('returns null cadence when cadence flag not set', () => {
    // Flags: only power present (bit 6 = 0x0040); bit 0 clear → speed present
    const bytes = [
      0x40, 0x00,   // flags: bit 6 only
      0x00, 0x00,   // speed (skip)
      0x96, 0x00,   // power: 150 W
    ];
    const { watts, cadence } = parseIndoorBikeData(dv(bytes));
    expect(watts).toBe(150);
    expect(cadence).toBeNull();
  });

  test('returns null for both when no relevant flags set', () => {
    const bytes = [0x00, 0x00]; // flags = 0
    const { watts, cadence } = parseIndoorBikeData(dv(bytes));
    expect(watts).toBeNull();
    expect(cadence).toBeNull();
  });
});

describe('parseCyclingPowerMeasurement', () => {
  test('parses power correctly', () => {
    // flags(2), power(2 sint16)
    const bytes = [0x00, 0x00, 0xF0, 0x00]; // 240 W
    const { watts } = parseCyclingPowerMeasurement(dv(bytes));
    expect(watts).toBe(240);
  });

  test('parses negative power (should not occur in practice but spec allows sint16)', () => {
    const bytes = [0x00, 0x00, 0xFF, 0xFF]; // -1 as sint16
    const { watts } = parseCyclingPowerMeasurement(dv(bytes));
    expect(watts).toBe(-1);
  });
});

describe('buildSetTargetPowerCommand', () => {
  test('returns 3-byte buffer with correct op code and target', () => {
    const buf = buildSetTargetPowerCommand(250);
    expect(buf.byteLength).toBe(3);
    expect(buf[0]).toBe(OP_SET_TARGET_POWER);
    const view = new DataView(buf.buffer);
    expect(view.getInt16(1, true)).toBe(250);
  });

  test('handles zero watts', () => {
    const buf = buildSetTargetPowerCommand(0);
    const view = new DataView(buf.buffer);
    expect(view.getInt16(1, true)).toBe(0);
  });
});
