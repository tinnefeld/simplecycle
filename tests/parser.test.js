import { parseWorkout } from '../src/workout/parser.js';

const VALID_PLAN = JSON.stringify({
  name: 'Test Workout',
  intervals: [
    { type: 'warmup',   durationSecs: 600,  targetWatts: 100 },
    { type: 'work',     durationSecs: 1200, targetWatts: 250 },
    { type: 'cooldown', durationSecs: 300,  targetWatts: 80  },
  ],
});

describe('parseWorkout — valid plans', () => {
  test('parses a valid plan and returns name + intervals', () => {
    const plan = parseWorkout(VALID_PLAN);
    expect(plan.name).toBe('Test Workout');
    expect(plan.intervals).toHaveLength(3);
  });

  test('trims whitespace from name', () => {
    const json = JSON.stringify({ name: '  My Ride  ', intervals: [{ type: 'work', durationSecs: 60, targetWatts: 150 }] });
    expect(parseWorkout(json).name).toBe('My Ride');
  });

  test('all valid interval types are accepted', () => {
    const types = ['warmup', 'work', 'rest', 'cooldown'];
    const json = JSON.stringify({
      name: 'All Types',
      intervals: types.map((t) => ({ type: t, durationSecs: 60, targetWatts: 100 })),
    });
    const plan = parseWorkout(json);
    expect(plan.intervals.map((i) => i.type)).toEqual(types);
  });
});

describe('parseWorkout — invalid JSON', () => {
  test('throws on non-JSON input', () => {
    expect(() => parseWorkout('not json')).toThrow('Invalid JSON');
  });
});

describe('parseWorkout — missing fields', () => {
  test('throws when name is missing', () => {
    const json = JSON.stringify({ intervals: [{ type: 'work', durationSecs: 60, targetWatts: 100 }] });
    expect(() => parseWorkout(json)).toThrow('"name"');
  });

  test('throws when name is empty string', () => {
    const json = JSON.stringify({ name: '', intervals: [{ type: 'work', durationSecs: 60, targetWatts: 100 }] });
    expect(() => parseWorkout(json)).toThrow('"name"');
  });

  test('throws when intervals is missing', () => {
    const json = JSON.stringify({ name: 'X' });
    expect(() => parseWorkout(json)).toThrow('"intervals"');
  });
});

describe('parseWorkout — empty intervals', () => {
  test('throws when intervals array is empty', () => {
    const json = JSON.stringify({ name: 'X', intervals: [] });
    expect(() => parseWorkout(json)).toThrow('at least one interval');
  });
});

describe('parseWorkout — invalid interval fields', () => {
  test('throws on unknown interval type', () => {
    const json = JSON.stringify({ name: 'X', intervals: [{ type: 'sprint', durationSecs: 60, targetWatts: 100 }] });
    expect(() => parseWorkout(json)).toThrow('"type"');
  });

  test('throws on non-positive durationSecs', () => {
    const json = JSON.stringify({ name: 'X', intervals: [{ type: 'work', durationSecs: 0, targetWatts: 100 }] });
    expect(() => parseWorkout(json)).toThrow('"durationSecs"');
  });

  test('throws on negative targetWatts', () => {
    const json = JSON.stringify({ name: 'X', intervals: [{ type: 'work', durationSecs: 60, targetWatts: -1 }] });
    expect(() => parseWorkout(json)).toThrow('"targetWatts"');
  });
});
