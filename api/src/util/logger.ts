// logger.js
import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,          // Color output
                translateTime: 'SYS:HH:MM:ss', // Show human-readable time
                ignore: 'pid,hostname',  // Don’t show these keys
                singleLine: false,       // Multi-line pretty print
                messageFormat: '{msg}',  // Custom message template
            },
    },
    base: {
        env: process.env.NODE_ENV,
    },
});
export default logger;
