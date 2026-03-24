import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

export interface ConsoleTransportOptions {
	format?: OutputFormat;
	/**
	 * Called immediately before writing a log entry to the console.
	 * Useful for coordinating with interactive terminal UI elements.
	 */
	onBeforeWrite?: () => void;
	/**
	 * Called immediately after writing a log entry to the console.
	 * Useful for coordinating with interactive terminal UI elements.
	 */
	onAfterWrite?: () => void;
}

export function consoleTransport(options?: ConsoleTransportOptions): LogTransport {
	return {
		write(entry: LogEntry): void {
			const format = options?.format ?? getConfig().format;

			const consoleFn =
				entry.level === 'error' || entry.level === 'fatal'
					? console.error
					: entry.level === 'warn'
						? console.warn
						: entry.level === 'debug' || entry.level === 'trace'
							? console.debug
							: console.log;

			try {
				options?.onBeforeWrite?.();
				if (format === OutputFormat.JSON) {
					consoleFn(formatJson(entry));
				} else {
					const output = formatPretty(entry);
					const dataStr = formatData(entry.data);
					if (dataStr) {
						consoleFn(output, dataStr);
					} else {
						consoleFn(output);
					}
				}
			} finally {
				options?.onAfterWrite?.();
			}
		},
	};
}
