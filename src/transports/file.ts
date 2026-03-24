import fs from 'fs';

import { getConfig } from '../config.js';
import { formatData, formatJson, formatPretty } from '../formatters.js';
import type { LogEntry, LogTransport } from '../types.js';
import { OutputFormat } from '../types.js';

export interface FileTransportOptions {
	format?: OutputFormat;
}

/**
 * Create a file transport (Node.js only).
 */
export function fileTransport(filePath: string, options?: FileTransportOptions): LogTransport {
	return {
		write(entry: LogEntry): void {
			const format = options?.format ?? getConfig().format;

			try {
				if (format === OutputFormat.JSON) {
					fs.appendFileSync(filePath, formatJson(entry) + '\n', 'utf-8');
					return;
				}

				const output = formatPretty(entry);
				const dataStr = formatData(entry.data);
				fs.appendFileSync(filePath, (dataStr ? `${output} ${dataStr}` : output) + '\n', 'utf-8');
			} catch (err) {
				throw new Error(`fileTransport: failed to write to "${filePath}": ${(err as Error).message}`);
			}
		},
	};
}
