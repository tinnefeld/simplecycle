# SimpleCycle

A Progressive Web App for structured cycling workouts with a Bluetooth smart trainer.

No account, no cloud, no internet required after install — just you and your trainer.

## Features

- **Bluetooth trainer control** — connects to any FTMS-compatible smart trainer (or Cycling Power Profile) via Web Bluetooth; reads live power and cadence, sets resistance targets automatically
- **Structured workouts** — load a workout plan from a local JSON file; the app steps through intervals and adjusts trainer resistance at each transition
- **Live metrics** — elapsed time, current power (W), cadence (RPM), and accumulated distance updated in real time
- **Session control** — start, pause, resume, and stop your workout
- **Offline-first PWA** — installs to your home screen and runs fully offline once cached

## Requirements

- **Chrome or Chromium** — Web Bluetooth is only supported in Chromium-based browsers
- **HTTPS or localhost** — required by the Web Bluetooth security model
- A Bluetooth smart trainer that supports the **FTMS** (Fitness Machine Service) or **Cycling Power Profile** GATT profile

## Getting Started

```bash
# Install dev dependencies (Jest for testing only — no runtime deps)
npm install

# Start a local development server
npm start
```

Then open `http://localhost:3000` in Chrome.

To install as a PWA: look for the install icon in Chrome's address bar after the page loads.

## Workout File Format

Workouts are plain JSON files you load from your local filesystem:

```json
{
  "name": "Sweet Spot 2x20",
  "intervals": [
    { "type": "warmup",   "durationSecs": 600,  "targetWatts": 120 },
    { "type": "work",     "durationSecs": 1200, "targetWatts": 230 },
    { "type": "rest",     "durationSecs": 300,  "targetWatts": 100 },
    { "type": "work",     "durationSecs": 1200, "targetWatts": 230 },
    { "type": "cooldown", "durationSecs": 600,  "targetWatts": 100 }
  ]
}
```

Valid interval types: `warmup`, `work`, `rest`, `cooldown`.

## Project Structure

```
/
├── index.html          # App shell
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── src/
│   ├── app.js          # Entry point — wires all modules
│   ├── bluetooth/
│   │   ├── bluetooth.js  # Web Bluetooth abstraction
│   │   └── ftms.js       # FTMS/Cycling Power GATT parsing
│   ├── session/
│   │   ├── session.js    # Session state machine + 1 Hz tick
│   │   └── distance.js   # Power-based distance estimation
│   ├── workout/
│   │   ├── parser.js     # JSON workout plan validator
│   │   └── workout.js    # Interval advancement model
│   └── ui/
│       ├── display.js    # Metrics rendering
│       └── controls.js   # Button and file input handlers
├── styles/main.css
├── tests/              # Jest unit tests
└── scripts/
    └── generate-icons.js  # Regenerate PWA icons
```

## Development

No build step — the app runs directly in Chrome as vanilla ES modules.

```bash
# Run tests
npm test

# Regenerate PWA icons (requires sharp)
node scripts/generate-icons.js
```

## Architecture Notes

- **No bundler, no framework** — vanilla JavaScript, HTML, and CSS only
- **Dependency injection** — Bluetooth and timer dependencies are injected, keeping all logic unit-testable without a browser
- **Offline caching** — service worker pre-caches all app shell assets at install time (cache-first strategy)
- **Distance calculation** — uses a cycling physics model (rolling resistance + aerodynamic drag) solved with Newton-Raphson iteration

## License

MIT
