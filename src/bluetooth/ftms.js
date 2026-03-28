// FTMS (Fitness Machine Service) GATT UUIDs and measurement parsing.

export const FTMS_SERVICE_UUID = '00001826-0000-1000-8000-00805f9b34fb';
export const INDOOR_BIKE_DATA_UUID = '00002ad2-0000-1000-8000-00805f9b34fb';
export const CONTROL_POINT_UUID = '00002ad9-0000-1000-8000-00805f9b34fb';

// Fallback: Cycling Power Service (for trainers that expose CPP only)
export const CYCLING_POWER_SERVICE_UUID = '00001818-0000-1000-8000-00805f9b34fb';
export const CYCLING_POWER_MEASUREMENT_UUID = '00002a63-0000-1000-8000-00805f9b34fb';

// FTMS Control Point op codes
export const OP_REQUEST_CONTROL = 0x00;
export const OP_SET_TARGET_POWER = 0x05;
export const OP_START_RESUME = 0x07;
export const OP_STOP_PAUSE = 0x08;

/**
 * Parse an Indoor Bike Data (0x2AD2) notification.
 * Returns { watts: number|null, cadence: number|null }.
 * @param {DataView} dataView
 * @returns {{ watts: number|null, cadence: number|null }}
 */
export function parseIndoorBikeData(dataView) {
  // Flags field (16-bit, little-endian) — see FTMS spec Table 4.9
  const flags = dataView.getUint16(0, true);

  const moreDataPresent        = (flags & 0x0001) !== 0; // bit 0: instantaneous speed absent when 0
  const instantCadencePresent  = (flags & 0x0004) !== 0; // bit 2
  const instantPowerPresent    = (flags & 0x0040) !== 0; // bit 6

  let offset = 2; // skip flags

  // Instantaneous Speed (uint16, 0.01 km/h resolution) — always present when bit 0 = 0
  if (!moreDataPresent) {
    offset += 2; // skip speed, not needed
  }

  // Average Speed (uint16) — bit 1
  if (flags & 0x0002) offset += 2;

  // Instantaneous Cadence (uint16, 0.5 rpm resolution) — bit 2
  let cadence = null;
  if (instantCadencePresent && offset + 2 <= dataView.byteLength) {
    cadence = Math.round(dataView.getUint16(offset, true) * 0.5);
    offset += 2;
  }

  // Average Cadence (uint16) — bit 3
  if (flags & 0x0008) offset += 2;

  // Total Distance (uint24) — bit 4
  if (flags & 0x0010) offset += 3;

  // Resistance Level (sint16) — bit 5
  if (flags & 0x0020) offset += 2;

  // Instantaneous Power (sint16, 1 W resolution) — bit 6
  let watts = null;
  if (instantPowerPresent && offset + 2 <= dataView.byteLength) {
    watts = dataView.getInt16(offset, true);
    offset += 2;
  }

  return { watts, cadence };
}

/**
 * Parse a Cycling Power Measurement (0x2A63) notification.
 * Returns { watts: number, cadence: number|null }.
 * @param {DataView} dataView
 * @returns {{ watts: number, cadence: number|null }}
 */
export function parseCyclingPowerMeasurement(dataView) {
  const flags = dataView.getUint16(0, true);
  const watts = dataView.getInt16(2, true);

  // Crank Revolution Data present — bit 5
  let cadence = null;
  if (flags & 0x0020) {
    // Cumulative Crank Revolutions (uint16) at offset 4, Last Crank Event Time (uint16) at offset 6
    // Cadence calculation requires two consecutive readings; return null for first reading.
    cadence = null;
  }

  return { watts, cadence };
}

/**
 * Build a Set Target Power control point write buffer.
 * @param {number} targetWatts
 * @returns {Uint8Array}
 */
export function buildSetTargetPowerCommand(targetWatts) {
  const buf = new Uint8Array(3);
  const view = new DataView(buf.buffer);
  view.setUint8(0, OP_SET_TARGET_POWER);
  view.setInt16(1, targetWatts, true); // sint16, little-endian
  return buf;
}
