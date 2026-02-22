import winston from 'winston'

// Logger configuration
const logger = winston.createLogger({
  level: 'info', // Minimum log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Time stamp
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Console par log dikhega
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Sirf errors file me store
    new winston.transports.File({ filename: 'combined.log' }) // Saare logs file me store
  ],
});

export default logger