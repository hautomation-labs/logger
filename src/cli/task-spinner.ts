/**
 * Task Spinner - A spinner for long-running tasks with state tracking
 *
 * Provides a higher-level API over createSpinner for tasks that have
 * distinct states (e.g., batch processing workflows).
 */

import { formatElapsed } from './elapsed.js';
import { createSpinner, HOURGLASS_FRAMES, type SpinnerOptions } from './spinner.js';

export interface TaskSpinnerOptions extends Omit<SpinnerOptions, 'showElapsed'> {
	/**
	 * Mapping of state strings to display labels
	 * If a state is not in the map, the raw state string is used
	 *
	 * @example
	 * {
	 *   'processing': '⚙️  Processing',
	 *   'completed': '✅ Completed',
	 *   'failed': '❌ Failed'
	 * }
	 */
	stateLabels?: Record<string, string>;
}

export interface TaskSpinner {
	/** Start the spinner */
	start(): void;

	/**
	 * Update the spinner with current state and elapsed time
	 * @param state - Current state (looked up in stateLabels)
	 * @param elapsedMs - Elapsed time in milliseconds
	 */
	update(state: string, elapsedMs: number): void;

	/**
	 * Stop with success
	 * @param elapsedMs - Total elapsed time
	 * @param message - Optional custom message (defaults to "Completed in {elapsed}")
	 */
	succeed(elapsedMs: number, message?: string): void;

	/**
	 * Stop with failure
	 * @param message - Error message to display
	 */
	fail(message: string): void;
}

/**
 * Create a task spinner for long-running operations with state tracking
 *
 * @example
 * // Define state labels for your workflow
 * const stateLabels = {
 *   'submitted': '📤 Submitted',
 *   'processing': '⚙️  Processing',
 *   'completed': '✅ Completed',
 * };
 *
 * const spinner = createTaskSpinner('Processing batch', { stateLabels });
 * spinner.start();
 *
 * // Update with state changes
 * spinner.update('processing', 30000);
 *
 * // On completion
 * spinner.succeed(120000);
 */
export function createTaskSpinner(label: string, options: TaskSpinnerOptions = {}): TaskSpinner {
	const { stateLabels = {}, frames = HOURGLASS_FRAMES, interval = 500, ...rest } = options;

	const spinner = createSpinner(label, {
		frames,
		interval,
		showElapsed: false, // We handle elapsed display ourselves
		...rest,
	});

	return {
		start() {
			spinner.start();
		},

		update(state: string, elapsedMs: number) {
			const stateText = stateLabels[state] ?? state;
			const elapsed = formatElapsed(elapsedMs);
			spinner.update(`${stateText} (${elapsed})`);
		},

		succeed(elapsedMs: number, message?: string) {
			const elapsed = formatElapsed(elapsedMs);
			spinner.succeed(message ?? `Completed in ${elapsed}`);
		},

		fail(message: string) {
			spinner.fail(message);
		},
	};
}
