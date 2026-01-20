import { describe, expect, it, vi } from 'vitest';
import { createWarningAggregator } from '../src/aggregation/index.js';

describe('createWarningAggregator', () => {
	it('aggregates warnings by category', () => {
		const aggregator = createWarningAggregator();

		aggregator.add('image-size', 'Size not supported', 'file1.png');
		aggregator.add('image-size', 'Size not supported', 'file2.png');
		aggregator.add('quality', 'Low quality', 'file3.png');

		expect(aggregator.getCount('image-size')).toBe(2);
		expect(aggregator.getCount('quality')).toBe(1);
		expect(aggregator.getTotalCount()).toBe(3);
	});

	it('limits examples to maxExamples', () => {
		const aggregator = createWarningAggregator({ maxExamples: 2 });

		aggregator.add('cat', 'msg', 'a');
		aggregator.add('cat', 'msg', 'b');
		aggregator.add('cat', 'msg', 'c');

		const summary = aggregator.getSummary();
		expect(summary[0].examples).toHaveLength(2);
	});

	it('flushes warnings to logger and resets', () => {
		const aggregator = createWarningAggregator();
		const logger = { warn: vi.fn() } as any;

		aggregator.add('test', 'Test message', 'detail');
		aggregator.flush(logger);

		expect(logger.warn).toHaveBeenCalledOnce();
		expect(aggregator.hasWarnings()).toBe(false);
	});

	it('hasWarnings returns correct state', () => {
		const aggregator = createWarningAggregator();

		expect(aggregator.hasWarnings()).toBe(false);
		aggregator.add('cat', 'msg');
		expect(aggregator.hasWarnings()).toBe(true);
	});
});
