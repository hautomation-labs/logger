import { describe, expect, it } from 'vitest';

import { formatJson, formatPretty } from '../src/index.js';

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
