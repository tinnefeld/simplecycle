/**
 * Bluetooth trainer abstraction.
 *
 * Wraps the Web Bluetooth API so the rest of the app never calls
 * navigator.bluetooth directly — making non-Bluetooth logic testable.
 *
 * Usage:
 *   const trainer = createTrainer();
 *   trainer.onPower = (watts) => { ... };
 *   trainer.onCadence = (rpm) => { ... };
 *   trainer.onDisconnect = () => { ... };
 *   await trainer.connect();
 *   await trainer.setTargetPower(200);
 *   await trainer.disconnect();
 */

import {
  FTMS_SERVICE_UUID,
  INDOOR_BIKE_DATA_UUID,
  CONTROL_POINT_UUID,
  CYCLING_POWER_SERVICE_UUID,
  CYCLING_POWER_MEASUREMENT_UUID,
  OP_REQUEST_CONTROL,
  OP_START_RESUME,
  parseIndoorBikeData,
  parseCyclingPowerMeasurement,
  buildSetTargetPowerCommand,
} from './ftms.js';

/**
 * @typedef {Object} Trainer
 * @property {((watts: number) => void) | null} onPower
 * @property {((rpm: number) => void) | null} onCadence
 * @property {(() => void) | null} onDisconnect
 * @property {() => Promise<void>} connect
 * @property {() => Promise<void>} disconnect
 * @property {(watts: number) => Promise<void>} setTargetPower
 * @property {'disconnected'|'connecting'|'connected'} status
 */

/**
 * Create a trainer instance.
 * @returns {Trainer}
 */
export function createTrainer() {
  let device = null;
  let controlPointChar = null;

  /** @type {Trainer} */
  const trainer = {
    onPower: null,
    onCadence: null,
    onDisconnect: null,
    status: 'disconnected',

    async connect() {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth is not supported in this browser. Please use Chrome.');
      }

      trainer.status = 'connecting';

      try {
        device = await navigator.bluetooth.requestDevice({
          filters: [
            { services: [FTMS_SERVICE_UUID] },
            { services: [CYCLING_POWER_SERVICE_UUID] },
          ],
        });
      } catch (err) {
        trainer.status = 'disconnected';
        throw err;
      }

      device.addEventListener('gattserverdisconnected', () => {
        trainer.status = 'disconnected';
        controlPointChar = null;
        if (trainer.onDisconnect) trainer.onDisconnect();
      });

      let server;
      try {
        server = await device.gatt.connect();
      } catch (err) {
        trainer.status = 'disconnected';
        throw new Error(`Could not connect to trainer: ${err.message}`);
      }

      // Try FTMS first, fall back to Cycling Power Profile.
      try {
        const service = await server.getPrimaryService(FTMS_SERVICE_UUID);
        const dataChar = await service.getCharacteristic(INDOOR_BIKE_DATA_UUID);
        controlPointChar = await service.getCharacteristic(CONTROL_POINT_UUID).catch(() => null);

        dataChar.addEventListener('characteristicvaluechanged', (event) => {
          const { watts, cadence } = parseIndoorBikeData(event.target.value);
          if (watts !== null && trainer.onPower) trainer.onPower(watts);
          if (cadence !== null && trainer.onCadence) trainer.onCadence(cadence);
        });
        await dataChar.startNotifications();

        // FTMS requires subscribing to Control Point indications before writing,
        // then Request Control + Start before resistance commands are accepted.
        if (controlPointChar) {
          try {
            await controlPointChar.startNotifications();
            await controlPointChar.writeValueWithResponse(new Uint8Array([OP_REQUEST_CONTROL]));
            await controlPointChar.writeValueWithResponse(new Uint8Array([OP_START_RESUME]));
          } catch (err) {
            console.warn('FTMS control point handshake failed:', err);
          }
        }
      } catch {
        // Fall back to Cycling Power Profile
        try {
          const service = await server.getPrimaryService(CYCLING_POWER_SERVICE_UUID);
          const measureChar = await service.getCharacteristic(CYCLING_POWER_MEASUREMENT_UUID);

          measureChar.addEventListener('characteristicvaluechanged', (event) => {
            const { watts, cadence } = parseCyclingPowerMeasurement(event.target.value);
            if (watts !== null && trainer.onPower) trainer.onPower(watts);
            if (cadence !== null && trainer.onCadence) trainer.onCadence(cadence);
          });
          await measureChar.startNotifications();
        } catch (err) {
          trainer.status = 'disconnected';
          throw new Error(`Trainer does not expose a supported service (FTMS or Cycling Power): ${err.message}`);
        }
      }

      trainer.status = 'connected';
    },

    async disconnect() {
      if (device && device.gatt.connected) {
        device.gatt.disconnect();
      }
      trainer.status = 'disconnected';
    },

    async setTargetPower(watts) {
      if (!controlPointChar) return; // not all trainers support control point
      const command = buildSetTargetPowerCommand(Math.round(watts));
      await controlPointChar.writeValueWithResponse(command);
    },
  };

  return trainer;
}
