/**
 * Task Spinner - A spinner for long-running tasks with state tracking
 *
 * Provides a higher-level API over createSpinner for tasks that have
 * distinct states (e.g., batch processing workflows).
 *
 * Features:
 * - Real-time elapsed time updates
 * - State label display
 * - Clean visual feedback with ASCII art animation
 */

import { formatElapsed } from './elapsed.js';
import { createSpinner, BAR_FRAMES, type SpinnerOptions } from './spinner.js';

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
 * Features:
 * - Real-time elapsed time that updates continuously
 * - State label that updates when `update()` is called
 * - Smooth braille bar animation
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
	const { stateLabels = {}, frames = BAR_FRAMES, interval = 80, ...rest } = options;

	let currentState = '';
	let startTimeMs = 0;

	// Build display text with current state and real-time elapsed
	const buildText = (): string => {
		const stateText = currentState ? (stateLabels[currentState] ?? currentState) : '';
		const elapsed = startTimeMs > 0 ? formatElapsed(Date.now() - startTimeMs) : '';

		if (stateText && elapsed) {
			return `${label} ${stateText} (${elapsed})`;
		} else if (stateText) {
			return `${label} ${stateText}`;
		} else if (elapsed) {
			return `${label} (${elapsed})`;
		}
		return label;
	};

	// Create spinner with real-time elapsed updates built into the render
	const spinner = createSpinner(label, {
		frames,
		interval,
		showElapsed: false, // We handle elapsed ourselves with continuous updates
		...rest,
	});

	// Keep updating the text to show real-time elapsed
	let textUpdateInterval: ReturnType<typeof setInterval> | null = null;

	return {
		start() {
			startTimeMs = Date.now();
			spinner.start();

			// Update text every 100ms for smooth elapsed time display
			textUpdateInterval = setInterval(() => {
				spinner.update(buildText());
			}, 100);
		},

		update(state: string, _elapsedMs: number) {
			currentState = state;
			// Immediately update text when state changes
			spinner.update(buildText());
		},

		succeed(elapsedMs: number, message?: string) {
			if (textUpdateInterval) {
				clearInterval(textUpdateInterval);
				textUpdateInterval = null;
			}
			const elapsed = formatElapsed(elapsedMs);
			spinner.succeed(message ?? `${label} completed in ${elapsed}`);
		},

		fail(message: string) {
			if (textUpdateInterval) {
				clearInterval(textUpdateInterval);
				textUpdateInterval = null;
			}
			spinner.fail(message);
		},
	};
}
