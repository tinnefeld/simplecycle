## ADDED Requirements

### Requirement: Workout plan defines a sequence of intervals
A structured workout SHALL be defined as an ordered list of intervals, each with a target power (in watts or as % of FTP) and a duration (in seconds).

#### Scenario: Valid workout plan loads
- **WHEN** a workout plan is loaded into the app
- **THEN** the app SHALL parse it into an ordered interval list and make it available to the session

#### Scenario: Empty workout plan is rejected
- **WHEN** a workout plan with no intervals is provided
- **THEN** the app SHALL reject it and display a validation error

### Requirement: Workout plan is provided as a JSON file
The app SHALL accept structured workout plans in JSON format, loaded by the user from their local filesystem.

#### Scenario: User loads a JSON workout file
- **WHEN** the user selects a `.json` file using the file picker
- **THEN** the app SHALL parse the file and load the workout plan

#### Scenario: Invalid JSON is rejected
- **WHEN** the selected file is not valid JSON or does not match the expected schema
- **THEN** the app SHALL display a descriptive error message

### Requirement: Active interval advances automatically
During a session, the app SHALL advance to the next interval when the current interval's duration has elapsed.

#### Scenario: Interval advances on completion
- **WHEN** the elapsed time for the current interval reaches its defined duration
- **THEN** the app SHALL move to the next interval and update the resistance target on the trainer

#### Scenario: Workout ends after last interval
- **WHEN** the last interval completes
- **THEN** the session SHALL transition to the `completed` state

### Requirement: Workout plan can include a warmup and cooldown
A workout plan MAY include designated warmup and cooldown intervals. These SHALL be treated as regular intervals for timing and resistance purposes, but displayed distinctly in the UI.

#### Scenario: Warmup displayed distinctly
- **WHEN** the current interval is marked as `warmup` or `cooldown`
- **THEN** the metrics display SHALL indicate its type visually
