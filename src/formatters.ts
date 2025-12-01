import type { LogEntry } from './types.js';
import { TimestampFormat } from './types.js';

/**
 * Format timestamp based on format setting
 */
export function formatTimestamp(format: TimestampFormat): string | undefined {
	if (format === TimestampFormat.NONE) {
		return undefined;
	}

	const now = new Date();

	if (format === TimestampFormat.TIME_ONLY) {
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}

	return now.toISOString();
}

/**
 * Format a log entry as pretty human-readable output
 * Format: timestamp emoji [LEVEL] [source] message
 */
export function formatPretty(entry: LogEntry): string {
	const parts: string[] = [];

	if (entry.timestamp) {
		parts.push(entry.timestamp);
	}

	if (entry.emoji) {
		parts.push(entry.emoji);
	}

	const paddedLevel = entry.level.toUpperCase().padEnd(5);
	parts.push(`[${paddedLevel}]`);

	if (entry.source) {
		parts.push(`[${entry.source}]`);
	}

	parts.push(entry.message);

	return parts.join(' ');
}

/**
 * Format data for pretty output
 */
export function formatData(data: unknown): string {
	if (data === undefined || data === null) {
		return '';
	}

	try {
		if (typeof data === 'object') {
			return JSON.stringify(data);
		}
		return String(data);
	} catch {
		return String(data);
	}
}

/**
 * Format a log entry as JSON
 */
export function formatJson(entry: LogEntry): string {
	const output: Record<string, unknown> = {};

	if (entry.timestamp) {
		output.timestamp = entry.timestamp;
	}

	output.level = entry.level.toUpperCase();

	if (entry.source) {
		output.source = entry.source;
	}

	if (entry.emoji) {
		output.emoji = entry.emoji;
	}

	output.message = entry.message;

	if (entry.data !== undefined) {
		output.data = entry.data;
	}

	return JSON.stringify(output);
}
