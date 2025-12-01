// Main API
export { configure, getConfig, resetConfig } from './config.js';
export { extractErrorMessage } from './extract-message.js';
export { createLogger } from './logger.js';

// Transports
export type { ConsoleTransportOptions, FileTransportOptions } from './transports/index.js';
export { consoleTransport, fileTransport } from './transports/index.js';

// Formatters (for custom transports)
export { formatData, formatJson, formatPretty, formatTimestamp } from './formatters.js';

// Types and enums
export type {
	CreateLoggerOptions,
	EmojiResolver,
	LogEntry,
	Logger,
	LoggerConfig,
	LogLevel,
	LogTransport,
} from './types.js';
export { LEVEL_EMOJIS, LEVEL_PRIORITY, OutputFormat, TimestampFormat } from './types.js';
