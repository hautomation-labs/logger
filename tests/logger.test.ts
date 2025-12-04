import { afterEach, describe, expect, it, vi } from 'vitest';

import { configure, createLogger, resetConfig } from '../src/index.js';

afterEach(() => {
	resetConfig();
	vi.restoreAllMocks();
});

describe('createLogger', () => {
	it('creates a logger with all methods', () => {
		const log = createLogger();
		expect(log.trace).toBeTypeOf('function');
		expect(log.debug).toBeTypeOf('function');
		expect(log.info).toBeTypeOf('function');
		expect(log.warn).toBeTypeOf('function');
		expect(log.error).toBeTypeOf('function');
		expect(log.fatal).toBeTypeOf('function');
	});

	it('respects source option', () => {
		const log = createLogger({ source: 'TestService' });
		expect(log.source).toBe('TestService');
	});

	it('respects custom emoji option', () => {
		const log = createLogger({ emoji: '🚀' });
		expect(log.emoji).toBe('🚀');
	});

	it('logs to console', () => {
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const log = createLogger();
		log.info('test message');
		expect(spy).toHaveBeenCalled();
	});

	it('respects minLevel config', () => {
		configure({ minLevel: 'warn' });
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const log = createLogger();
		log.info('should not log');
		expect(spy).not.toHaveBeenCalled();
	});

	it('respects enabled config', () => {
		configure({ enabled: false });
		const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const log = createLogger();
		log.info('should not log');
		expect(spy).not.toHaveBeenCalled();
	});
});
