import { describe, expect, it } from 'vitest';
import { formatCost, formatCount, formatDuration, formatPercent } from '../src/formatting/index.js';

describe('formatCost', () => {
	it('formats zero', () => {
		expect(formatCost(0)).toBe('$0.00');
	});

	it('formats standard amounts', () => {
		expect(formatCost(1.5)).toBe('$1.50');
		expect(formatCost(123.456)).toBe('$123.46');
	});

	it('formats sub-cent amounts with more precision', () => {
		expect(formatCost(0.00423)).toBe('$0.0042');
	});
});

describe('formatCount', () => {
	it('formats count progress', () => {
		expect(formatCount(42, 100)).toBe('[42/100]');
		expect(formatCount(0, 50)).toBe('[0/50]');
	});
});

describe('formatPercent', () => {
	it('formats percentage', () => {
		expect(formatPercent(42, 100)).toBe('42%');
		expect(formatPercent(1, 3)).toBe('33%');
	});

	it('handles zero total', () => {
		expect(formatPercent(0, 0)).toBe('0%');
	});
});

describe('formatDuration', () => {
	it('formats seconds', () => {
		expect(formatDuration(42000)).toBe('42s');
	});

	it('formats minutes and seconds', () => {
		expect(formatDuration(150000)).toBe('2m 30s');
	});

	it('formats hours and minutes', () => {
		expect(formatDuration(3900000)).toBe('1h 5m');
	});
});
