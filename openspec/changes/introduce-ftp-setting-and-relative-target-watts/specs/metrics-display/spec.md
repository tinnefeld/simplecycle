## ADDED Requirements

### Requirement: FTP value is visible and editable in the UI
The metrics display SHALL include an FTP input field showing the current FTP value at all times. The user SHALL be able to update it without navigating away from the main screen.

#### Scenario: FTP field shows stored value on load
- **WHEN** the app loads
- **THEN** the FTP input field SHALL display the stored FTP value, or 200 if none is set

#### Scenario: FTP field is editable when session is not active
- **WHEN** no session is active and the user enters a new value in the FTP field
- **THEN** the app SHALL validate and save the value on confirmation (blur or Enter)

#### Scenario: FTP field is disabled during active session
- **WHEN** a session is active or paused
- **THEN** the FTP input field SHALL be disabled to prevent mid-session confusion
