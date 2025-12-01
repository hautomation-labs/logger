/**
 * Log levels in order of severity
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Output format options
 */
export enum OutputFormat {
	PRETTY = 'pretty',
	JSON = 'json',
}

/**
 * Timestamp format options
 */
export enum TimestampFormat {
	/** HH:mm:ss (default) */
	TIME_ONLY = 'time',
	/** Full ISO 8601: 2024-01-15T10:30:00.000Z */
	ISO = 'iso',
	/** No timestamp */
	NONE = 'none',
}

/**
 * Log entry passed to transports
 */
export interface LogEntry {
	timestamp?: string;
	level: LogLevel;
	source?: string;
	emoji: string;
	message: string;
	data?: unknown;
}

/**
 * Transport interface - implement this for custom transports
 */
export interface LogTransport {
	write(entry: LogEntry): void;
}

/**
 * Global configuration options
 */
export interface LoggerConfig {
	/** Minimum log level to output (default: 'debug') */
	minLevel?: LogLevel;
	/** Enable/disable all logging (default: true) */
	enabled?: boolean;
	/** Output format (default: OutputFormat.PRETTY) */
	format?: OutputFormat;
	/** Timestamp format (default: TimestampFormat.TIME_ONLY) */
	timestampFormat?: TimestampFormat;
	/** Show emoji in output (default: true) */
	showEmoji?: boolean;
	/** Array of transports to write to (default: [consoleTransport()]) */
	transports?: LogTransport[];
}

/**
 * Emoji can be a static string or a function that returns emoji based on message/level
 */
export type EmojiResolver = string | ((message: string, level: LogLevel) => string);

/**
 * Options for creating a logger instance
 */
export interface CreateLoggerOptions {
	/** Source/context name (e.g., 'DatabaseService', 'ApiClient') */
	source?: string;
	/** Custom emoji - static string or function for dynamic emoji based on message */
	emoji?: EmojiResolver;
}

/**
 * Logger instance interface
 */
export interface Logger {
	trace(message: string, data?: unknown): void;
	debug(message: string, data?: unknown): void;
	info(message: string, data?: unknown): void;
	warn(message: string, data?: unknown): void;
	error(message: string, data?: unknown): void;
	fatal(message: string, data?: unknown): void;

	/** The source name for this logger */
	readonly source: string | undefined;
	/** The custom emoji resolver for this logger */
	readonly emoji: EmojiResolver | undefined;
}

/**
 * Default emojis for each log level
 */
export const LEVEL_EMOJIS: Record<LogLevel, string> = {
	trace: '🔍',
	debug: '🐛',
	info: '📌',
	warn: '⚠️',
	error: '❌',
	fatal: '💀',
};

/**
 * Numeric priority for log levels (higher = more severe)
 */
export const LEVEL_PRIORITY: Record<LogLevel, number> = {
	trace: 0,
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	fatal: 5,
};
