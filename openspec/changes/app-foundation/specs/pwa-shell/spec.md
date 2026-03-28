## ADDED Requirements

### Requirement: App is installable as a PWA
The app SHALL provide a valid web app manifest and a registered service worker so that Chrome offers the user the option to install it to their device.

#### Scenario: Install prompt appears
- **WHEN** a user visits the app in Chrome over HTTPS or localhost
- **THEN** the browser SHALL offer an install prompt after the PWA criteria are met (manifest + service worker)

### Requirement: App works fully offline after install
Once installed, the app SHALL function without any internet connection by serving all assets from the service worker cache.

#### Scenario: Offline load
- **WHEN** the user opens the app with no network connection
- **THEN** the app SHALL load and display the UI from cache with no network errors

#### Scenario: First visit caches all assets
- **WHEN** the service worker installs for the first time
- **THEN** it SHALL pre-cache all required HTML, CSS, and JavaScript assets

### Requirement: App shell loads quickly
The app shell (HTML + CSS + core JS) SHALL be served from cache on repeat visits so the UI renders before any dynamic data is fetched.

#### Scenario: Repeat visit renders from cache
- **WHEN** a returning user opens the app
- **THEN** the app shell SHALL be served from the service worker cache without a network round-trip
