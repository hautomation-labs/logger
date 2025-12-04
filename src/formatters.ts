import type { LogEntry } from './types.js';
import { TimestampFormat } from './types.js';

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
		return typeof data === 'object' ? JSON.stringify(data) : String(data);
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
	if (entry.data !== undefined) output.data = entry.data;
	return JSON.stringify(output);
}
