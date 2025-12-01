import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

/**
 * Console transport options
 */
export interface ConsoleTransportOptions {
	/** Override the global format setting */
	format?: OutputFormat;
}

/**
 * Create a console transport
 *
 * @example
 * configure({ transports: [consoleTransport()] });
 *
 * @example
 * // Force JSON output for this transport
 * configure({ transports: [consoleTransport({ format: OutputFormat.JSON })] });
 */
export function consoleTransport(options?: ConsoleTransportOptions): LogTransport {
	return {
		write(entry: LogEntry): void {
			const config = getConfig();
			const format = options?.format ?? config.format;

			// Select appropriate console method for React Native LogBox compatibility
			const consoleFn =
				entry.level === 'error' || entry.level === 'fatal'
					? console.error
					: entry.level === 'warn'
						? console.warn
						: entry.level === 'debug' || entry.level === 'trace'
							? console.debug
							: console.log;

			if (format === OutputFormat.JSON) {
				consoleFn(formatJson(entry));
				return;
			}

			const output = formatPretty(entry);
			const dataStr = formatData(entry.data);

			if (dataStr) {
				consoleFn(output, dataStr);
			} else {
				consoleFn(output);
			}
		},
	};
}
