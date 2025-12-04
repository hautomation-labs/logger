import { afterEach, describe, expect, it } from 'vitest';

import { configure, getConfig, resetConfig } from '../src/index.js';

afterEach(() => {
	resetConfig();
});

describe('configure', () => {
	it('updates minLevel', () => {
		configure({ minLevel: 'error' });
		expect(getConfig().minLevel).toBe('error');
	});

	it('updates showEmoji', () => {
		configure({ showEmoji: false });
		expect(getConfig().showEmoji).toBe(false);
	});

	it('resetConfig restores defaults', () => {
		configure({ minLevel: 'fatal', showEmoji: false });
		resetConfig();
		expect(getConfig().minLevel).toBe('debug');
		expect(getConfig().showEmoji).toBe(true);
	});
});
