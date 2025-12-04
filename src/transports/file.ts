import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

export interface FileTransportOptions {
	format?: OutputFormat;
}

function isNode(): boolean {
	return typeof process !== 'undefined' && process.versions?.node != null;
}

/**
 * Create a file transport (Node.js only).
 */
export function fileTransport(filePath: string, options?: FileTransportOptions): LogTransport {
	if (!isNode()) {
		throw new Error('fileTransport is only available in Node.js environments.');
	}

	const fs: typeof import('fs') = require('fs');

	return {
		write(entry: LogEntry): void {
			const format = options?.format ?? getConfig().format;

			if (format === OutputFormat.JSON) {
				fs.appendFileSync(filePath, formatJson(entry) + '\n', 'utf-8');
				return;
			}

			const output = formatPretty(entry);
			const dataStr = formatData(entry.data);
			fs.appendFileSync(filePath, (dataStr ? `${output} ${dataStr}` : output) + '\n', 'utf-8');
		},
	};
}
