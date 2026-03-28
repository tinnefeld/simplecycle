/**
 * Structured workout model.
 *
 * Tracks the current interval, elapsed time within that interval,
 * and advances to the next interval when its duration is exhausted.
 *
 * Usage:
 *   const w = createWorkout(plan);
 *   w.currentInterval();   // { type, durationSecs, targetWatts }
 *   w.remainingSecs();     // seconds left in current interval
 *   w.tick();              // advance 1 second; returns true if interval changed
 *   w.isDone();            // true after last interval completes
 */

/**
 * @param {import('./parser.js').WorkoutPlan} plan
 */
export function createWorkout(plan) {
  let index = 0;
  let elapsedInInterval = 0;
  let done = false;

  const workout = {
    /** @returns {import('./parser.js').Interval | null} */
    currentInterval() {
      if (done) return null;
      return plan.intervals[index];
    },

    remainingSecs() {
      if (done) return 0;
      return plan.intervals[index].durationSecs - elapsedInInterval;
    },

    /**
     * Advance by one second.
     * @returns {boolean} true if the interval changed or workout completed this tick
     */
    tick() {
      if (done) return false;

      elapsedInInterval += 1;
      const current = plan.intervals[index];

      if (elapsedInInterval >= current.durationSecs) {
        index += 1;
        elapsedInInterval = 0;
        if (index >= plan.intervals.length) {
          done = true;
        }
        return true; // interval changed (or workout ended)
      }

      return false;
    },

    isDone() {
      return done;
    },

    /** Current interval index (0-based). */
    get intervalIndex() {
      return index;
    },
  };

  return workout;
}
