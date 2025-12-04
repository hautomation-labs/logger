import { consoleTransport } from './transports/console.js';
import { getConfig } from './config.js';
import { formatTimestamp } from './formatters.js';
import type { CreateLoggerOptions, LogEntry, Logger, LogLevel } from './types.js';
import { LEVEL_EMOJIS, LEVEL_PRIORITY } from './types.js';

let defaultTransport: ReturnType<typeof consoleTransport> | null = null;

function getDefaultTransport() {
	if (!defaultTransport) defaultTransport = consoleTransport();
	return defaultTransport;
}

/**
 * Create a logger instance with optional source name and custom emoji.
 */
export function createLogger(options: CreateLoggerOptions = {}): Logger {
	const { source, emoji } = options;

	const resolveEmoji = (message: string, level: LogLevel): string => {
		if (emoji) {
			return typeof emoji === 'function' ? emoji(message, level) : emoji;
		}
		// Default: info with URL gets 🔗, otherwise use level emoji
		if (level === 'info' && /https?:\/\//.test(message)) {
			return '🔗';
		}
		return LEVEL_EMOJIS[level];
	};

	const logMethod = (level: LogLevel, message: string, data?: unknown): void => {
		const config = getConfig();

		if (!config.enabled) return;

		if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[config.minLevel]) {
			return;
		}

		const entry: LogEntry = {
			timestamp: formatTimestamp(config.timestampFormat),
			level,
			source,
			emoji: config.showEmoji ? resolveEmoji(message, level) : '',
			message,
			data,
		};

		const transports = config.transports ?? [getDefaultTransport()];

		for (const transport of transports) {
			try {
				transport.write(entry);
			} catch (err) {
				console.error('Logger transport error:', err);
			}
		}
	};

	return {
		trace: (message, data) => logMethod('trace', message, data),
		debug: (message, data) => logMethod('debug', message, data),
		info: (message, data) => logMethod('info', message, data),
		warn: (message, data) => logMethod('warn', message, data),
		error: (message, data) => logMethod('error', message, data),
		fatal: (message, data) => logMethod('fatal', message, data),

		get source() {
			return source;
		},
		get emoji() {
			return emoji;
		},
	};
}
