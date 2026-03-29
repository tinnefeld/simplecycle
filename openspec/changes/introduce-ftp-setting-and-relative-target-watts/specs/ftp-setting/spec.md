## ADDED Requirements

### Requirement: User can enter and save their FTP
The app SHALL provide an input field where the user can enter their FTP (Functional Threshold Power) in watts. The value SHALL be persisted in localStorage so it survives page reloads and PWA restarts.

#### Scenario: User saves FTP
- **WHEN** the user enters a positive integer in the FTP field and confirms (blur or Enter)
- **THEN** the app SHALL save the value to localStorage and use it for subsequent workout loads

#### Scenario: FTP persists across reloads
- **WHEN** the user reloads or reopens the app
- **THEN** the FTP input field SHALL be pre-populated with the previously saved value

#### Scenario: Invalid FTP is rejected
- **WHEN** the user enters a non-positive or non-numeric value
- **THEN** the app SHALL display a validation error and not overwrite the stored FTP

### Requirement: FTP defaults to 200W when not set
If no FTP has been saved, the app SHALL default to 200W so that `targetPercent`-based workouts can load without requiring the user to set FTP first.

#### Scenario: Default FTP used on first launch
- **WHEN** the app is opened for the first time with no stored FTP
- **THEN** the FTP input SHALL display 200 and the app SHALL use 200W for any FTP-relative calculations
