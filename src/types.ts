export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export enum OutputFormat {
	PRETTY = 'pretty',
	JSON = 'json',
}

export enum TimestampFormat {
	TIME_ONLY = 'time',
	ISO = 'iso',
	NONE = 'none',
}

export interface LogEntry {
	timestamp?: string;
	level: LogLevel;
	source?: string;
	emoji: string;
	message: string;
	data?: unknown;
}

export interface LogTransport {
	write(entry: LogEntry): void;
}

export interface LoggerConfig {
	minLevel?: LogLevel;
	enabled?: boolean;
	format?: OutputFormat;
	timestampFormat?: TimestampFormat;
	showEmoji?: boolean;
	transports?: LogTransport[];
}

export type EmojiResolver = string | ((message: string, level: LogLevel) => string);

export interface CreateLoggerOptions {
	source?: string;
	emoji?: EmojiResolver;
}

export interface Logger {
	trace(message: string, data?: unknown): void;
	debug(message: string, data?: unknown): void;
	info(message: string, data?: unknown): void;
	warn(message: string, data?: unknown): void;
	error(message: string, data?: unknown): void;
	fatal(message: string, data?: unknown): void;
	readonly source: string | undefined;
	readonly emoji: EmojiResolver | undefined;
}

export const LEVEL_EMOJIS: Record<LogLevel, string> = {
	trace: '🔍',
	debug: '🐛',
	info: '📌',
	warn: '⚠️',
	error: '❌',
	fatal: '💀',
};

export const LEVEL_PRIORITY: Record<LogLevel, number> = {
	trace: 0,
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	fatal: 5,
};
