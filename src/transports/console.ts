import { spinnerManager } from '../cli/spinner-manager.js';
import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

export interface ConsoleTransportOptions {
	format?: OutputFormat;
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

			// Pause any active spinners before logging to prevent line mixing
			const hadSpinners = spinnerManager.hasActiveSpinners();
			if (hadSpinners) {
				spinnerManager.pause();
			}

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

			// Resume spinners after logging
			if (hadSpinners) {
				spinnerManager.resume();
			}
		},
	};
}
