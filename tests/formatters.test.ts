import { describe, expect, it } from 'vitest';

import { formatData, formatJson, formatPretty } from '../src/index.js';

describe('formatters', () => {
	const entry = {
		timestamp: '10:30:00',
		level: 'info' as const,
		source: 'Test',
		emoji: '📌',
		message: 'hello',
	};

	it('formatPretty produces readable output', () => {
		const output = formatPretty(entry);
		expect(output).toContain('10:30:00');
		expect(output).toContain('📌');
		expect(output).toContain('[INFO ]');
		expect(output).toContain('[Test]');
		expect(output).toContain('hello');
	});

	it('formatJson produces valid JSON', () => {
		const output = formatJson(entry);
		const parsed = JSON.parse(output);
		expect(parsed.level).toBe('INFO');
		expect(parsed.message).toBe('hello');
	});
});

describe('formatData - Error serialization', () => {
	it('serializes Error objects with name, message, and stack', () => {
		const error = new Error('Test error');
		const output = formatData({ error });
		const parsed = JSON.parse(output);
		expect(parsed.error.name).toBe('Error');
		expect(parsed.error.message).toBe('Test error');
		expect(parsed.error.stack).toBeDefined();
	});

	it('serializes nested Error objects', () => {
		const error = new Error('Nested');
		const output = formatData({ outer: { inner: error } });
		const parsed = JSON.parse(output);
		expect(parsed.outer.inner.message).toBe('Nested');
	});

	it('preserves custom Error properties', () => {
		const error = new Error('Custom') as Error & { code: string };
		error.code = 'ERR_CUSTOM';
		const output = formatData({ error });
		const parsed = JSON.parse(output);
		expect(parsed.error.code).toBe('ERR_CUSTOM');
	});

	it('handles arrays containing Errors', () => {
		const errors = [new Error('First'), new Error('Second')];
		const output = formatData({ errors });
		const parsed = JSON.parse(output);
		expect(parsed.errors).toHaveLength(2);
		expect(parsed.errors[0].message).toBe('First');
		expect(parsed.errors[1].message).toBe('Second');
	});
});

describe('formatJson - Error serialization', () => {
	it('serializes Error in data field', () => {
		const entry = {
			timestamp: '10:30:00',
			level: 'error' as const,
			source: 'Test',
			emoji: '❌',
			message: 'Something failed',
			data: { error: new Error('DynamoDB error') },
		};
		const output = formatJson(entry);
		const parsed = JSON.parse(output);
		expect(parsed.data.error.name).toBe('Error');
		expect(parsed.data.error.message).toBe('DynamoDB error');
	});
});
