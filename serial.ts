import SerialPort from 'serialport';
import { Telemetry } from '../forza.js';

const port = new SerialPort(process.env.SERIAL_PORT || 'COM3');

const connectedMessage = 'Serial Connected';
let isConnected = false;

port.on('open', () => {
    console.log('Serial Port Connected!');
});

const onConnected = () => {
    console.log('Serial Port Ready!');
};

port.on('readable', () => {
    if (!isConnected) return;
    const data = port.read(connectedMessage.length);

    if (connectedMessage === data?.toString()) {
        isConnected = true;
        onConnected();
    }
});

export const sendTelemetry = async (telemetry: Telemetry) => {
    const engineRedlineRpm = numberToShort(
        Number(process.env.ENGINE_REDLINE_RPM) || 0
    );
    const engineCurrentRpm = numberToShort(telemetry.currentEngineRpm);

    const payload: number[] = [
        0xff,
        0xff,
        ...engineRedlineRpm,
        ...engineCurrentRpm,
        telemetry.gear
    ];

    if (payload.length !== 7) {
        throw new Error('Invalid payload length, not sending!');
    }

    port.write(payload);
};

// An int is 2 bytes on Arduino, represented as a short here
const numberToShort = (num: number): [number, number] => {
    const first = num >> 8;
    const second = Math.floor(num - (first << 8));

    return [first, second];
};
