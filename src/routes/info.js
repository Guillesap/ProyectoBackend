import express from 'express';
import { logger } from '../utils/logger.js';
import * as os from 'os';

const info = express.Router();
const numCPUs = os.cpus().length;

info.get("/", (req, res) => {
    logger('info', "Info page requested");
    res.json({
        'Version de node': process.version,
        'Sistema operativo': process.platform,
        'Path de ejecución': process.execPath,
        'ID de proceso': process.pid,
        'Carpeta de ejecución': process.cwd(),
        'Memoria total reservada (rss)': process.memoryUsage().rss,
        'Argumentos de entrada': process.argv,
        'Numero de procesadores presentes en el servidor': numCPUs,
    });
});

export default info;