## Why

SimpleCycle does not yet exist as a codebase. This change establishes the foundational application skeleton — the structural, architectural, and connectivity layer that all future features will build upon. Without this foundation, no cycling workout functionality can be implemented.

## What Changes

- Create the PWA shell: `index.html`, `manifest.json`, and a service worker for offline support
- Set up the core JavaScript module structure (no bundler — ES modules loaded directly in Chrome)
- Implement Bluetooth connectivity to discover and connect to a smart trainer using the Web Bluetooth API (FTMS / Cycling Power service)
- Implement the core workout data model: workout session state, elapsed time, power output, cadence, and calculated distance
- Create a minimal UI shell with placeholders for: connection status, live metrics display, and workout control (start/stop/pause)
- Set up the Node.js + Jest testing harness for unit testing non-browser logic

## Capabilities

### New Capabilities

- `pwa-shell`: PWA manifest, service worker, and offline caching so the app installs and runs without internet
- `bluetooth-trainer`: Discover, connect, and communicate with a Bluetooth smart trainer (FTMS profile — read power/cadence, write resistance targets)
- `workout-session`: Core session state machine tracking elapsed time, current power, cadence, and accumulated distance
- `structured-workout`: Data model and loader for structured workout plans (intervals with target power/duration)
- `metrics-display`: Live UI rendering of workout metrics (time, power, cadence, distance, current interval)

### Modified Capabilities

## Impact

- New project — no existing code is affected
- Requires Chrome (or Chromium-based browser) for Web Bluetooth API support
- No external dependencies at runtime; Node.js + Jest added as dev dependencies for testing
- Web Bluetooth API requires HTTPS or localhost for security reasons (relevant for deployment)
