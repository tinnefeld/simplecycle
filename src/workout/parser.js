/**
 * Parse and validate a structured workout plan from a JSON string.
 *
 * Expected format:
 * {
 *   "name": "Sweet Spot 2x20",
 *   "intervals": [
 *     { "type": "warmup",   "durationSecs": 600,  "targetWatts": 120 },
 *     { "type": "work",     "durationSecs": 1200, "targetWatts": 230 },
 *     { "type": "rest",     "durationSecs": 300,  "targetWatts": 100 },
 *     { "type": "cooldown", "durationSecs": 600,  "targetWatts": 100 }
 *   ]
 * }
 *
 * Valid interval types: "warmup" | "work" | "rest" | "cooldown"
 */

const VALID_TYPES = new Set(['warmup', 'work', 'rest', 'cooldown']);

/**
 * @typedef {Object} Interval
 * @property {'warmup'|'work'|'rest'|'cooldown'} type
 * @property {number} durationSecs
 * @property {number} targetWatts
 */

/**
 * @typedef {Object} WorkoutPlan
 * @property {string} name
 * @property {Interval[]} intervals
 */

/**
 * Parse and validate a workout JSON string.
 * @param {string} jsonString
 * @returns {WorkoutPlan}
 * @throws {Error} with a descriptive message if invalid
 */
export function parseWorkout(jsonString) {
  let raw;
  try {
    raw = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON: the file could not be parsed.');
  }

  if (typeof raw.name !== 'string' || raw.name.trim() === '') {
    throw new Error('Workout plan must have a non-empty "name" field.');
  }

  if (!Array.isArray(raw.intervals)) {
    throw new Error('Workout plan must have an "intervals" array.');
  }

  if (raw.intervals.length === 0) {
    throw new Error('Workout plan must contain at least one interval.');
  }

  const intervals = raw.intervals.map((iv, i) => {
    const prefix = `Interval ${i + 1}`;

    if (!VALID_TYPES.has(iv.type)) {
      throw new Error(
        `${prefix}: "type" must be one of ${[...VALID_TYPES].join(', ')}. Got: ${JSON.stringify(iv.type)}`
      );
    }
    if (typeof iv.durationSecs !== 'number' || iv.durationSecs <= 0) {
      throw new Error(`${prefix}: "durationSecs" must be a positive number.`);
    }
    if (typeof iv.targetWatts !== 'number' || iv.targetWatts < 0) {
      throw new Error(`${prefix}: "targetWatts" must be a non-negative number.`);
    }

    return {
      type: iv.type,
      durationSecs: iv.durationSecs,
      targetWatts: iv.targetWatts,
    };
  });

  return { name: raw.name.trim(), intervals };
}
