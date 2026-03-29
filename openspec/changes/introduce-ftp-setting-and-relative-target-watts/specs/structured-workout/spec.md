## MODIFIED Requirements

### Requirement: Workout plan defines a sequence of intervals
A structured workout SHALL be defined as an ordered list of intervals, each with a duration (in seconds) and a target power specified as either an absolute wattage (`targetWatts`) or a percentage of the rider's FTP (`targetPercent`). Exactly one of `targetWatts` or `targetPercent` MUST be present on each interval; specifying both or neither is invalid.

#### Scenario: Valid workout plan loads
- **WHEN** a workout plan is loaded into the app
- **THEN** the app SHALL parse it into an ordered interval list and make it available to the session

#### Scenario: Empty workout plan is rejected
- **WHEN** a workout plan with no intervals is provided
- **THEN** the app SHALL reject it and display a validation error

#### Scenario: Interval with targetWatts loads correctly
- **WHEN** an interval specifies `targetWatts` as a positive number
- **THEN** the app SHALL use that absolute wattage as the resistance target

#### Scenario: Interval with targetPercent is resolved to watts using FTP
- **WHEN** an interval specifies `targetPercent` (e.g. 88) and the rider's FTP is 250W
- **THEN** the app SHALL resolve the target to `Math.round(88 / 100 * 250)` = 220W before passing it to the session

#### Scenario: Interval with both targetWatts and targetPercent is rejected
- **WHEN** an interval specifies both `targetWatts` and `targetPercent`
- **THEN** the app SHALL reject the plan with a descriptive validation error

#### Scenario: Interval with neither targetWatts nor targetPercent is rejected
- **WHEN** an interval specifies neither `targetWatts` nor `targetPercent`
- **THEN** the app SHALL reject the plan with a descriptive validation error

## ADDED Requirements

### Requirement: targetPercent is validated as a positive number in range 1–300
The `targetPercent` field SHALL be validated as a number between 1 and 300 inclusive.

#### Scenario: targetPercent of 0 is rejected
- **WHEN** an interval specifies `targetPercent: 0`
- **THEN** the app SHALL reject the plan with a descriptive validation error

#### Scenario: targetPercent above 300 is rejected
- **WHEN** an interval specifies `targetPercent: 301`
- **THEN** the app SHALL reject the plan with a descriptive validation error

#### Scenario: targetPercent of 150 is accepted (sprint interval)
- **WHEN** an interval specifies `targetPercent: 150` and FTP is 200W
- **THEN** the app SHALL resolve to 300W and accept the plan
