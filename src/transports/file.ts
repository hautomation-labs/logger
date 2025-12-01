import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

/**
 * File transport options
 */
export interface FileTransportOptions {
	/** Override the global format setting (default: uses global config) */
	format?: OutputFormat;
}

/**
 * Check if we're running in Node.js
 */
function isNode(): boolean {
	return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

/**
 * Create a file transport (Node.js only)
 *
 * @param filePath - Path to the log file
 * @param options - Transport options
 *
 * @example
 * configure({ transports: [fileTransport('./app.log')] });
 *
 * @example
 * // Force JSON output to file
 * configure({
 *   transports: [
 *     consoleTransport(),
 *     fileTransport('./app.log', { format: OutputFormat.JSON })
 *   ]
 * });
 */
export function fileTransport(filePath: string, options?: FileTransportOptions): LogTransport {
	if (!isNode()) {
		throw new Error(
			'fileTransport is only available in Node.js environments. ' +
				'For React Native, use a custom transport or consoleTransport.'
		);
	}

	const fs: typeof import('fs') = require('fs');

	return {
		write(entry: LogEntry): void {
			const config = getConfig();
			const format = options?.format ?? config.format;

			if (format === OutputFormat.JSON) {
				fs.appendFileSync(filePath, formatJson(entry) + '\n', 'utf-8');
				return;
			}

			const output = formatPretty(entry);
			const dataStr = formatData(entry.data);
			const line = dataStr ? `${output} ${dataStr}` : output;

			fs.appendFileSync(filePath, line + '\n', 'utf-8');
		},
	};
}
