## Why

Workout plans currently require absolute watt targets, which means a plan written for one rider is not meaningful for another. Introducing an FTP (Functional Threshold Power) setting allows workout plans to specify targets as a percentage of the rider's FTP, making every plan automatically personalised.

## What Changes

- Add a persistent FTP setting the user can enter and save in the app
- **BREAKING**: Extend the workout JSON format to support `targetPercent` (% of FTP) instead of `targetWatts` on each interval
- Resolve `targetPercent` to absolute watts at session start using the stored FTP value
- Display the resolved target watts (not the percentage) in the metrics display during a workout
- Show the FTP value in the UI and allow it to be changed at any time (takes effect on the next session start). Set the FTP value to a default of 200.

## Capabilities

### New Capabilities

- `ftp-setting`: Persistent FTP value entry, storage (localStorage), and retrieval; displayed in the UI; default value in the UI is 200

### Modified Capabilities

- `structured-workout`: Intervals may now specify only `targetPercent` (number, 1–300) instead of `targetWatts`; the parser must resolve `targetPercent` × FTP → absolute watts before the session uses the plan
- `metrics-display`: FTP value shown in the UI with an editable input field

## Impact

- `src/workout/parser.js` — must accept `targetPercent` and resolve it to watts given an FTP value
- `src/app.js` — must read FTP before starting a session and pass it to the parser/workout
- `src/ui/display.js` and `index.html` — add FTP input field
- Workout JSON files using `targetPercent` will not load correctly on older versions of the app (breaking format change, additive)
