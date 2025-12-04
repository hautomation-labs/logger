import { describe, expect, it } from 'vitest';

import { extractErrorMessage } from '../src/index.js';

describe('extractErrorMessage', () => {
	it('extracts from Error', () => {
		expect(extractErrorMessage(new Error('oops'))).toBe('oops');
	});

	it('returns string as-is', () => {
		expect(extractErrorMessage('plain error')).toBe('plain error');
	});

	it('extracts from object with message', () => {
		expect(extractErrorMessage({ message: 'api error' })).toBe('api error');
	});

	it('converts other types to string', () => {
		expect(extractErrorMessage(42)).toBe('42');
		expect(extractErrorMessage(null)).toBe('null');
	});
});
