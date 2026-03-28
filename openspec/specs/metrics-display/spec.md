## ADDED Requirements

### Requirement: Display shows live power output
The metrics display SHALL show the current power output in watts, updated in real time as readings arrive from the trainer.

#### Scenario: Power updates in display
- **WHEN** a new power reading is received
- **THEN** the displayed wattage value SHALL update within 1 second

### Requirement: Display shows elapsed session time
The metrics display SHALL show elapsed time in MM:SS format, updating every second during an active session.

#### Scenario: Time display increments
- **WHEN** the session is active
- **THEN** the time display SHALL increment each second

### Requirement: Display shows current cadence
The metrics display SHALL show the current cadence in RPM.

#### Scenario: Cadence updates in display
- **WHEN** a new cadence reading is received
- **THEN** the displayed RPM value SHALL update within 1 second

### Requirement: Display shows accumulated distance
The metrics display SHALL show total distance covered in the session, in kilometers, to two decimal places.

#### Scenario: Distance updates during session
- **WHEN** the session is active and distance accumulates
- **THEN** the distance display SHALL update at least once per second

### Requirement: Display shows current interval info
When a structured workout is active, the display SHALL show the current interval's target power and remaining interval time.

#### Scenario: Interval target is shown
- **WHEN** a structured workout interval is active
- **THEN** the display SHALL show the target wattage and a countdown to the end of the interval

#### Scenario: Interval type is indicated
- **WHEN** the current interval is a warmup or cooldown
- **THEN** the display SHALL visually distinguish it from a regular work interval

### Requirement: Connection status is always visible
The display SHALL show the current Bluetooth connection status (disconnected / connecting / connected) at all times.

#### Scenario: Status reflects connection state
- **WHEN** the trainer connection state changes
- **THEN** the connection status indicator SHALL update immediately to reflect the new state
