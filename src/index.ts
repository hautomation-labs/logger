// Core API
export { configure, getConfig, resetConfig } from './config.js';
export { createLogger } from './logger.js';

// Utilities
export { extractErrorMessage } from './extract-message.js';

// Transports
export { consoleTransport, fileTransport } from './transports/index.js';

// Formatters (for custom transports)
export { formatData, formatJson, formatPretty, formatTimestamp } from './formatters.js';

// Types
export type { LogEntry, Logger, LoggerConfig, LogLevel, LogTransport } from './types.js';
export { OutputFormat, TimestampFormat } from './types.js';
