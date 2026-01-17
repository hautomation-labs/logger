import type { LogEntry } from './types.js';
import { TimestampFormat } from './types.js';

/**
 * Recursively serialize data, converting Error objects to plain objects.
 * Error properties (message, stack) are non-enumerable and don't survive JSON.stringify.
 */
function serializeData(data: unknown): unknown {
	if (data instanceof Error) {
		const serialized: Record<string, unknown> = {
			name: data.name,
			message: data.message,
			stack: data.stack,
		};
		// Include any custom properties on the error
		for (const key of Object.keys(data)) {
			if (!['name', 'message', 'stack'].includes(key)) {
				serialized[key] = serializeData((data as unknown as Record<string, unknown>)[key]);
			}
		}
		return serialized;
	}
	if (Array.isArray(data)) {
		return data.map(serializeData);
	}
	if (data !== null && typeof data === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			result[key] = serializeData(value);
		}
		return result;
	}
	return data;
}

export function formatTimestamp(format: TimestampFormat): string | undefined {
	if (format === TimestampFormat.NONE) return undefined;

	const now = new Date();
	if (format === TimestampFormat.TIME_ONLY) {
		return [now.getHours(), now.getMinutes(), now.getSeconds()].map((n) => n.toString().padStart(2, '0')).join(':');
	}
	return now.toISOString();
}

export function formatPretty(entry: LogEntry): string {
	const parts: string[] = [];
	if (entry.timestamp) parts.push(entry.timestamp);
	if (entry.emoji) parts.push(entry.emoji);
	parts.push(`[${entry.level.toUpperCase().padEnd(5)}]`);
	if (entry.source) parts.push(`[${entry.source}]`);
	parts.push(entry.message);
	return parts.join(' ');
}

export function formatData(data: unknown): string {
	if (data === undefined || data === null) return '';
	try {
		const serialized = serializeData(data);
		return typeof serialized === 'object' ? JSON.stringify(serialized) : String(serialized);
	} catch {
		return String(data);
	}
}

export function formatJson(entry: LogEntry): string {
	const output: Record<string, unknown> = {};
	if (entry.timestamp) output.timestamp = entry.timestamp;
	output.level = entry.level.toUpperCase();
	if (entry.source) output.source = entry.source;
	if (entry.emoji) output.emoji = entry.emoji;
	output.message = entry.message;
	if (entry.data !== undefined) output.data = serializeData(entry.data);
	return JSON.stringify(output);
}
