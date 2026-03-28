## 1. Project Scaffold & Dev Setup

- [x] 1.1 Create root `index.html` with `<script type="module" src="src/app.js">` and placeholder UI sections
- [x] 1.2 Create `styles/main.css` with minimal reset and layout for the metrics display
- [x] 1.3 Create `manifest.json` with app name, icons, `display: standalone`, and `start_url`
- [x] 1.4 Initialize `package.json` with Node.js + Jest as dev dependencies (`npm init` + `npm install --save-dev jest`)
- [x] 1.5 Add `jest.config.js` configured for ES module support (or use `--experimental-vm-modules`)
- [x] 1.6 Create empty module stubs for all `src/` files so imports resolve without errors

## 2. Service Worker & PWA Offline Support

- [x] 2.1 Create `sw.js` with an `install` event that pre-caches all app shell assets (HTML, CSS, JS files)
- [x] 2.2 Add a `fetch` event handler in `sw.js` that serves cached assets cache-first
- [x] 2.3 Register the service worker in `src/app.js` on page load
- [ ] 2.4 Verify install prompt appears in Chrome DevTools (Application > Manifest) and app passes PWA checklist

## 3. Bluetooth Trainer Module

- [x] 3.1 Implement `src/bluetooth/bluetooth.js` — expose `connect()`, `disconnect()`, `setTargetPower(watts)` and event callbacks `onPower`, `onCadence`, `onDisconnect`
- [x] 3.2 Implement `src/bluetooth/ftms.js` — GATT service/characteristic UUIDs for FTMS and Cycling Power Profile; parse measurement notifications into `{ watts, cadence }` objects
- [x] 3.3 Add Bluetooth connection error handling: show error message on connection failure, emit `onDisconnect` on unexpected drop
- [x] 3.4 Write Jest unit tests for `ftms.js` parsing logic using raw DataView byte arrays (no browser required)

## 4. Workout Session State Machine

- [x] 4.1 Implement `src/session/session.js` — state machine with states `idle → active → paused → completed`; expose `start()`, `pause()`, `resume()`, `stop()`
- [x] 4.2 Implement the 1 Hz tick loop in `session.js` — increment elapsed time, accumulate distance, advance structured workout interval if needed
- [x] 4.3 Implement `src/session/distance.js` — calculate distance increment per second from power (watts) using a physics-based estimate; export as a pure function
- [x] 4.4 Wire trainer `onPower` / `onCadence` callbacks into session state updates
- [x] 4.5 Write Jest unit tests for the session state machine transitions
- [x] 4.6 Write Jest unit tests for `distance.js` calculation with known power inputs

## 5. Structured Workout Model

- [x] 5.1 Implement `src/workout/parser.js` — parse and validate a JSON workout plan; return structured `{ name, intervals[] }` or throw a descriptive error
- [x] 5.2 Implement `src/workout/workout.js` — track current interval index, compute remaining interval time, expose `currentInterval()` and `advance()`
- [x] 5.3 Add `<input type="file" accept=".json">` to the UI and wire it to `parser.js` in `src/ui/controls.js`
- [x] 5.4 Write Jest unit tests for `parser.js` — valid plans, missing fields, empty interval list, invalid JSON
- [x] 5.5 Write Jest unit tests for `workout.js` interval advancement and end-of-workout detection

## 6. Metrics Display UI

- [x] 6.1 Implement `src/ui/display.js` — expose `update(sessionState)` that renders elapsed time (MM:SS), power (W), cadence (RPM), distance (km), current interval target and countdown
- [x] 6.2 Add Bluetooth connection status indicator to the UI; update it from trainer connection events
- [x] 6.3 Visually distinguish warmup/cooldown intervals from work intervals in the display (CSS class or label)
- [x] 6.4 Implement `src/ui/controls.js` — wire Start/Pause/Resume/Stop buttons to session methods

## 7. Integration & Wiring

- [x] 7.1 Implement `src/app.js` — import and initialize all modules; wire Bluetooth → session → UI data flow
- [x] 7.2 Test the full flow end-to-end in Chrome: connect trainer, load a workout JSON, start session, verify metrics update, verify resistance changes on interval advance
- [x] 7.3 Test offline: install as PWA, disable network, reopen app and confirm it loads from cache
- [x] 7.4 Test disconnection recovery: drop Bluetooth mid-session, verify session pauses and reconnect prompt appears
