## 1. FTP Settings Module

- [x] 1.1 Create `src/settings.js` — export `getFtp()` (reads localStorage key `ftp`, returns integer or 200 as default) and `setFtp(value)` (validates positive integer 1–9999, writes to localStorage, throws on invalid input)
- [x] 1.2 Write Jest unit tests for `settings.js` — default value when nothing stored, valid save and retrieve, non-positive value rejected, non-numeric value rejected

## 2. Parser: targetPercent Support

- [x] 2.1 Update `src/workout/parser.js` — add `ftp` as second argument to `parseWorkout(jsonString, ftp = 200)`
- [x] 2.2 Update interval validation: accept exactly one of `targetWatts` or `targetPercent`; reject if both or neither present
- [x] 2.3 Validate `targetPercent` is a number in range 1–300
- [x] 2.4 Resolve `targetPercent` → `targetWatts` using `Math.round(targetPercent / 100 * ftp)` before returning the interval
- [x] 2.5 Update Jest tests for `parser.js` — `targetPercent` valid cases, FTP resolution math, both fields rejected, neither field rejected, out-of-range `targetPercent` rejected

## 3. UI: FTP Input Field

- [x] 3.1 Add FTP input field to `index.html` near the workout file loader (label "FTP (W)", `type="number"`, `id="ftp-input"`)
- [x] 3.2 Add styles for the FTP input to `styles/main.css`
- [x] 3.3 Wire FTP input in `src/ui/controls.js` — on blur/Enter call `setFtp()` and update the input value; show error via `showError()` on invalid input
- [x] 3.4 Populate FTP input from `getFtp()` on app load in `src/app.js`
- [x] 3.5 Disable FTP input when session is `active` or `paused`; re-enable on `idle` or `completed` — update `updateSessionButtons()` in `src/ui/display.js` or handle in `onAction` in `src/app.js`

## 4. Integration

- [x] 4.1 Update workout file load handler in `src/ui/controls.js` (or `src/app.js`) — pass `getFtp()` as second argument to `parseWorkout()`
- [ ] 4.2 Manual test: load a workout with `targetPercent` intervals, verify resistance targets are correctly resolved to watts and sent to the trainer
- [ ] 4.3 Manual test: change FTP, reload workout file, verify targets reflect the updated FTP
