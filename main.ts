import Forza from '../forza.js';
import { sendTelemetry } from './serial';

const forza = new Forza();

const main = async () => {
    forza.on('telemetry', sendTelemetry);

    await forza.loadGames();
    forza.startAllGameSockets();
};

if (require.main === module) main();
