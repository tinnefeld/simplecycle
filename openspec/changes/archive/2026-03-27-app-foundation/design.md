## Context

SimpleCycle is a new project with no existing codebase. This design establishes the application architecture for a browser-native PWA that talks directly to Bluetooth smart trainers. The primary constraints are: no build step, no external runtime services, offline-first, and Chrome-only (for Web Bluetooth).

## Goals / Non-Goals

**Goals:**
- Define the file/module structure for a no-bundler vanilla JS app
- Establish how the Web Bluetooth API integrates with the rest of the app
- Define the session state model and how data flows from the trainer to the UI
- Establish the PWA offline caching strategy
- Set up a testable architecture despite browser-only APIs

**Non-Goals:**
- User accounts, cloud sync, or any backend
- Support for browsers other than Chrome/Chromium
- ANT+ or other wireless protocols
- Historical workout storage (future change)
- Social/sharing features

## Decisions

### 1. Module structure: ES Modules, no bundler

**Decision:** Use native ES Module `import`/`export` syntax loaded directly via `<script type="module">` in `index.html`. No Webpack, Vite, or Rollup.

**Rationale:** Eliminates the build step entirely. Chrome has supported ES modules natively since 2017. This keeps the toolchain minimal and the dev loop fast.

**Alternative considered:** Vite — rejected because it adds a build step and a Node.js dependency at runtime.

**File layout:**
```
/
├── index.html
├── manifest.json
├── sw.js                    # Service worker
├── src/
│   ├── app.js               # Entry point, wires modules together
│   ├── bluetooth/
│   │   ├── bluetooth.js       # Web Bluetooth connection & GATT logic
│   │   └── ftms.js          # FTMS protocol parsing & control point writes
│   ├── session/
│   │   ├── session.js       # Session state machine
│   │   └── distance.js      # Distance calculation from power/cadence
│   ├── workout/
│   │   ├── workout.js       # Structured workout model & interval advance logic
│   │   └── parser.js        # JSON workout plan parser & validator
│   └── ui/
│       ├── display.js       # Metrics display update logic
│       └── controls.js      # Button/event handlers
└── styles/
    └── main.css
```

### 2. Bluetooth abstraction layer

**Decision:** Wrap all Web Bluetooth API calls in a `bluetooth.js` module that exposes a simple event-based interface (`onPower`, `onCadence`, `onDisconnect`, `setTargetPower`). The rest of the app never touches `navigator.bluetooth` directly.

**Rationale:** Web Bluetooth is not available in Node.js/Jest. By isolating it behind a module boundary, tests can inject a mock trainer without needing the browser.

**Alternative considered:** Direct API calls throughout — rejected because it makes the logic untestable.

### 3. Session as a plain state object + tick loop

**Decision:** The session state is a plain JavaScript object (no framework reactivity). A `setInterval` tick at 1 Hz drives time, distance accumulation, and interval advancement. On each tick, the state is updated and the UI module is called to re-render.

**Rationale:** Keeps the session logic framework-free and easily unit-testable. A 1 Hz tick is sufficient for time/distance; power and cadence update via Bluetooth notifications (asynchronous, faster).

**Alternative considered:** Using a reactive library (MobX, signals) — rejected to avoid external dependencies and a build step.

### 4. PWA caching: Cache-first with explicit precache list

**Decision:** The service worker pre-caches all app shell assets (HTML, CSS, JS files) at install time and serves them cache-first. No runtime caching of dynamic resources (there are none).

**Rationale:** The app has no dynamic remote resources. A simple precache list in `sw.js` is sufficient and easy to maintain manually given the no-bundler constraint.

**Alternative considered:** Workbox — rejected to avoid a build step dependency.

### 5. Workout plan format: JSON

**Decision:** Structured workouts are plain JSON files the user loads from their filesystem using `<input type="file">`. No import from external services.

**Rationale:** Keeps the app fully offline. JSON is human-readable and easy to author. No format negotiation needed.

**Example workout JSON schema:**
```json
{
  "name": "Sweet Spot 2x20",
  "intervals": [
    { "type": "warmup",   "durationSecs": 600, "targetWatts": 120 },
    { "type": "work",     "durationSecs": 1200, "targetWatts": 230 },
    { "type": "rest",     "durationSecs": 300,  "targetWatts": 100 },
    { "type": "work",     "durationSecs": 1200, "targetWatts": 230 },
    { "type": "cooldown", "durationSecs": 600,  "targetWatts": 100 }
  ]
}
```

### 6. Testing strategy: inject dependencies, mock Bluetooth

**Decision:** All modules that contain logic (session, workout parser, distance calc) accept their dependencies as arguments (dependency injection). Jest tests run in Node.js and inject mock Bluetooth/timer objects.

**Rationale:** Web Bluetooth and `setInterval` are not available or reliable in Jest. Injecting them allows full unit test coverage of all non-browser logic.

## Risks / Trade-offs

- **Web Bluetooth compatibility** → Only works in Chrome/Chromium. Mitigation: Document browser requirement prominently; detect and warn on unsupported browsers at startup.
- **FTMS profile variance** → Trainer manufacturers implement FTMS inconsistently. Mitigation: Test against the target trainer early; add device-specific workarounds in `ftms.js` if needed.
- **Manual precache list maintenance** → Without a bundler, the SW cache list must be updated by hand when files are added. Mitigation: Keep the file list small; add a CI check (or test) that validates the SW list matches the filesystem.
- **No persistent storage** → Workout history is not saved in this foundation. Mitigation: Acknowledged non-goal; session data lives in memory only for now.

## Open Questions

- Which specific Bluetooth GATT services/characteristics does the target trainer expose? We use FTMS.
- Should distance calculation use a simple power-based estimate (cycling physics formula) or cadence + estimated wheel circumference? Yes
