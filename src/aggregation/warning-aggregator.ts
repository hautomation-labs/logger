import type { Logger } from '../types.js';

export interface WarningAggregatorOptions {
	/** Maximum number of example details to keep per category (default: 3) */
	maxExamples?: number;
}

export interface AggregatedWarning {
	/** Warning category identifier */
	category: string;
	/** Number of occurrences */
	count: number;
	/** First occurrence message */
	message: string;
	/** First N unique detail strings */
	examples: string[];
}

export interface WarningAggregator {
	/**
	 * Add a warning to the aggregator
	 * @param category - Category identifier (e.g., 'image-size', 'image-quality')
	 * @param message - Warning message (first one is kept as representative)
	 * @param detail - Optional detail string for examples
	 */
	add(category: string, message: string, detail?: string): void;

	/** Get count of warnings in a category */
	getCount(category: string): number;

	/** Get total count across all categories */
	getTotalCount(): number;

	/** Get summary of all aggregated warnings */
	getSummary(): AggregatedWarning[];

	/**
	 * Emit all warnings as single log entries per category and reset
	 * @param logger - Logger instance to use for output
	 */
	flush(logger: Logger): void;

	/** Clear all aggregated warnings */
	reset(): void;

	/** Check if there are any warnings */
	hasWarnings(): boolean;
}

interface WarningBucket {
	message: string;
	count: number;
	examples: Set<string>;
}

/**
 * Create a warning aggregator for batch operations
 *
 * Collects warnings by category and emits a single summary per category
 * instead of flooding the log with repetitive warnings.
 *
 * @example
 * const aggregator = createWarningAggregator({ maxExamples: 3 });
 *
 * // During batch processing:
 * aggregator.add('image-size', "Size '512x512' not supported", 'file1.png');
 * aggregator.add('image-size', "Size '512x512' not supported", 'file2.png');
 * aggregator.add('image-quality', "Quality 'low' not supported", 'file3.png');
 *
 * // After batch:
 * aggregator.flush(logger);
 * // Output:
 * // ⚠️ image-size: 2 occurrences (e.g., Size '512x512' not supported)
 * // ⚠️ image-quality: 1 occurrence (e.g., Quality 'low' not supported)
 */
export function createWarningAggregator(options: WarningAggregatorOptions = {}): WarningAggregator {
	const { maxExamples = 3 } = options;
	const buckets = new Map<string, WarningBucket>();

	return {
		add(category: string, message: string, detail?: string) {
			let bucket = buckets.get(category);

			if (!bucket) {
				bucket = {
					message,
					count: 0,
					examples: new Set(),
				};
				buckets.set(category, bucket);
			}

			bucket.count++;

			if (detail && bucket.examples.size < maxExamples) {
				bucket.examples.add(detail);
			}
		},

		getCount(category: string) {
			return buckets.get(category)?.count ?? 0;
		},

		getTotalCount() {
			let total = 0;
			for (const bucket of buckets.values()) {
				total += bucket.count;
			}
			return total;
		},

		getSummary(): AggregatedWarning[] {
			const summary: AggregatedWarning[] = [];

			for (const [category, bucket] of buckets) {
				summary.push({
					category,
					count: bucket.count,
					message: bucket.message,
					examples: Array.from(bucket.examples),
				});
			}

			return summary;
		},

		flush(logger: Logger) {
			for (const [category, bucket] of buckets) {
				const countText = bucket.count === 1 ? '1 occurrence' : `${bucket.count} occurrences`;
				const examplesText = bucket.examples.size > 0 ? ` [${Array.from(bucket.examples).join(', ')}]` : '';

				logger.warn(`${category}: ${countText} (e.g., ${bucket.message})${examplesText}`);
			}

			this.reset();
		},

		reset() {
			buckets.clear();
		},

		hasWarnings() {
			return buckets.size > 0;
		},
	};
}
