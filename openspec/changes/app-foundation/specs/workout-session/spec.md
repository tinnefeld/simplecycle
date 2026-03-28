## ADDED Requirements

### Requirement: Session tracks elapsed time
The app SHALL maintain an elapsed time counter for an active workout session, updating every second.

#### Scenario: Timer increments during active session
- **WHEN** a session is in the `active` state
- **THEN** the elapsed time SHALL increment by one second each second

#### Scenario: Timer pauses when session is paused
- **WHEN** a session transitions to the `paused` state
- **THEN** the elapsed time counter SHALL stop incrementing

### Requirement: Session tracks current power output
The app SHALL record the most recent power reading (in watts) received from the trainer as the current power output.

#### Scenario: Power updates on new reading
- **WHEN** a new power measurement is received from the Bluetooth trainer
- **THEN** the session's current power value SHALL be updated to the new reading

### Requirement: Session tracks cadence
The app SHALL record the most recent cadence reading (in RPM) from the trainer.

#### Scenario: Cadence updates on new reading
- **WHEN** a new cadence measurement is received from the Bluetooth trainer
- **THEN** the session's current cadence value SHALL be updated

### Requirement: Session calculates accumulated distance
The app SHALL calculate and accumulate distance (in meters) throughout the session based on power and cadence data.

#### Scenario: Distance accumulates over time
- **WHEN** the session is active and power/cadence readings are received
- **THEN** the accumulated distance SHALL increase each second using an appropriate cycling physics estimate

### Requirement: Session has a state machine
A workout session SHALL exist in one of these states: `idle`, `active`, `paused`, `completed`.

#### Scenario: Start from idle
- **WHEN** the user starts a new workout
- **THEN** the session SHALL transition from `idle` to `active`

#### Scenario: Pause an active session
- **WHEN** the user pauses during an active session
- **THEN** the session SHALL transition from `active` to `paused`

#### Scenario: Resume a paused session
- **WHEN** the user resumes a paused session
- **THEN** the session SHALL transition from `paused` to `active`

#### Scenario: Complete a session
- **WHEN** the structured workout plan ends or the user manually stops the session
- **THEN** the session SHALL transition to `completed`
