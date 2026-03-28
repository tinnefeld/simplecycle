## ADDED Requirements

### Requirement: User can initiate Bluetooth device discovery
The app SHALL allow the user to scan for and select a nearby Bluetooth smart trainer using the Web Bluetooth API.

#### Scenario: Successful device discovery
- **WHEN** the user clicks the "Connect Trainer" button
- **THEN** the browser SHALL display a device picker showing nearby FTMS-compatible or Cycling Power Profile devices

#### Scenario: No devices found
- **WHEN** the user initiates discovery and no compatible devices are in range
- **THEN** the app SHALL display a message indicating no devices were found

### Requirement: App connects to a selected smart trainer
After selection, the app SHALL establish a GATT connection to the trainer and subscribe to relevant characteristics.

#### Scenario: Successful connection
- **WHEN** the user selects a device from the picker
- **THEN** the app SHALL connect to the device, discover the FTMS (or Cycling Power) service, and subscribe to power and cadence notifications

#### Scenario: Connection failure
- **WHEN** the GATT connection attempt fails
- **THEN** the app SHALL display an error message and allow the user to retry

### Requirement: App receives live power and cadence data
Once connected, the app SHALL continuously receive power (watts) and cadence (RPM) measurements from the trainer.

#### Scenario: Live data updates
- **WHEN** the trainer sends a new measurement notification
- **THEN** the app SHALL parse the value and update the internal workout session state within 1 second

### Requirement: App can set resistance target on trainer
The app SHALL be able to write a target resistance (in watts or as a resistance level) to the trainer via the FTMS Control Point characteristic.

#### Scenario: Set target power
- **WHEN** a structured workout interval requires a specific wattage target
- **THEN** the app SHALL write the target power to the FTMS Control Point and the trainer SHALL adjust resistance accordingly

### Requirement: App handles trainer disconnection gracefully
If the Bluetooth connection drops, the app SHALL notify the user and pause any active workout session.

#### Scenario: Unexpected disconnection
- **WHEN** the Bluetooth connection is lost during a workout
- **THEN** the app SHALL pause the session, display a disconnection warning, and offer a reconnect option
