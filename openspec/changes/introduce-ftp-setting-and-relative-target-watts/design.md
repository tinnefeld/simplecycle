## Context

Workout plans currently require absolute watt targets (`targetWatts`), making them non-portable across riders. This change introduces FTP-relative targets (`targetPercent`) as a standard alternative, with the rider's FTP stored locally and used to resolve percentages to absolute watts at parse time.

## Goals / Non-Goals

**Goals:**
- Allow workout intervals to specify `targetPercent` instead of `targetWatts`
- Store FTP persistently in localStorage with a default of 200W
- Expose FTP as an editable field in the main UI, disabled during active sessions
- Resolve `targetPercent` → absolute watts at parse time

**Non-Goals:**
- FTP testing / auto-detection
- Multiple rider profiles
- Changing FTP mid-session
- Syncing FTP with external platforms

## Decisions

### 1. Resolve targetPercent at parse time

**Decision:** `parseWorkout(jsonString, ftp)` accepts FTP as a second argument and converts `targetPercent` intervals to absolute `targetWatts` immediately. Everything downstream (workout.js, session.js, bluetooth.js) continues to work with plain `targetWatts` only.

**Rationale:** Single conversion point, easy to test, no FTP awareness needed outside the parser. Changing FTP mid-session is a non-goal so there's no need for deferred resolution.

**Alternative considered:** Store `targetPercent` through the full stack — rejected as it spreads FTP knowledge across multiple modules.

### 2. FTP stored in localStorage via a `src/settings.js` module

**Decision:** Encapsulate all FTP persistence in `src/settings.js` exporting `getFtp()` and `setFtp(value)`. `getFtp()` returns the stored integer or 200 if nothing is saved.

**Rationale:** localStorage is synchronous, requires no setup, works fully offline, and persists across PWA restarts. A dedicated module keeps the persistence concern out of UI and parser code.

### 3. targetPercent replaces targetWatts — not both allowed

**Decision:** Each interval must have exactly one of `targetWatts` or `targetPercent`. Having both or neither is a validation error.

**Rationale:** Matches the updated proposal. Avoids ambiguity about which field takes precedence.

### 4. FTP input on the main screen, disabled during active session

**Decision:** Add a small FTP input (label + number input) near the workout file loader in `index.html`. Disable it when session status is `active` or `paused`.

**Rationale:** Single-screen app — no routing system exists for a settings page. Disabling during a session prevents confusion since FTP only takes effect on the next workout load.

## Risks / Trade-offs

- **Breaking format change** → Plans using only `targetPercent` won't load on older app versions. Mitigation: additive change — existing `targetWatts` plans continue to work.
- **localStorage cleared** → User loses FTP if they clear site data. Mitigation: acknowledged limitation, default of 200W ensures the app remains usable.
- **FTP not set by new users** → Default 200W is shown prominently; user is expected to set it before training.

## Open Questions

None — all decisions resolved above.
