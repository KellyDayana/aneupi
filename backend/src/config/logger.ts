import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Nivel de log (info, warn, error)
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        logFormat
    ),
    transports: [
        // Guardar todos los logs de nivel 'error' en `error.log`
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // Guardar todos los logs en `combined.log`
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    exceptionHandlers: [
        // Manejar excepciones no capturadas
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        // Manejar promesas no capturadas
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(), // Añade colores a la consola
            logFormat
        ),
    }));
}

export default logger;