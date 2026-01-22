import { formatElapsed } from './elapsed.js';
import { spinnerManager } from './spinner-manager.js';

/** Braille bar animation - smooth horizontal progress feel (default) */
export const BAR_FRAMES = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];

/** Clock faces animation - visual time progression */
export const CLOCK_FRAMES = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];

export interface SpinnerOptions {
	/** Spinner animation frames */
	frames?: string[];
	/** Animation interval in ms (default: 80) */
	interval?: number;
	/** Output stream (default: process.stdout) */
	stream?: NodeJS.WriteStream;
	/** Show elapsed time (default: true) */
	showElapsed?: boolean;
}

export interface Spinner {
	/** Start the spinner with optional text */
	start(text?: string): void;
	/** Stop the spinner and clear the line */
	stop(): void;
	/** Stop with success symbol (✓) */
	succeed(text?: string): void;
	/** Stop with failure symbol (✗) */
	fail(text?: string): void;
	/** Stop with warning symbol (⚠) */
	warn(text?: string): void;
	/** Stop with info symbol (ℹ) */
	info(text?: string): void;
	/** Update the spinner text without stopping */
	update(text: string): void;
	/** Check if spinner is currently running */
	isSpinning(): boolean;
	/** Clear the current line (for log coordination) */
	clearLine(): void;
	/** Render the spinner (for log coordination) */
	render(): void;
}

/**
 * Create an animated terminal spinner
 *
 * Falls back to simple logging in non-TTY environments (CI, pipes, etc.)
 *
 * @example
 * const spinner = createSpinner('Loading...');
 * spinner.start();
 * // ... do work ...
 * spinner.succeed('Done!');
 */
export function createSpinner(initialText: string, options: SpinnerOptions = {}): Spinner {
	const { frames = BAR_FRAMES, interval = 80, stream = process.stdout, showElapsed = true } = options;

	let text = initialText;
	let frameIndex = 0;
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let startTime: number | null = null;
	let managerId: symbol | null = null;
	const isTTY = stream.isTTY ?? false;

	const clearLine = () => {
		if (isTTY) {
			stream.write('\r\x1B[K');
		}
	};

	const render = () => {
		if (!isTTY) return;

		const frame = frames[frameIndex];
		frameIndex = (frameIndex + 1) % frames.length;

		let line = `${frame} ${text}`;
		if (showElapsed && startTime) {
			line += ` (${formatElapsed(Date.now() - startTime)})`;
		}

		clearLine();
		stream.write(line);
	};

	const stopWithSymbol = (symbol: string, finalText?: string) => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}

		// Unregister from manager
		if (managerId) {
			spinnerManager.unregister(managerId);
			managerId = null;
		}

		const elapsed = startTime ? Date.now() - startTime : 0;
		const displayText = finalText ?? text;

		clearLine();

		let line = `${symbol} ${displayText}`;
		if (showElapsed && elapsed > 0) {
			line += ` (${formatElapsed(elapsed)})`;
		}

		stream.write(line + '\n');
		startTime = null;

		// Show cursor again
		if (isTTY) {
			stream.write('\x1B[?25h');
		}
	};

	const spinner: Spinner = {
		start(newText?: string) {
			if (newText) text = newText;
			startTime = Date.now();

			// Register with manager
			managerId = spinnerManager.register(spinner);

			if (isTTY) {
				// Hide cursor for cleaner animation
				stream.write('\x1B[?25l');
				render();
				intervalId = setInterval(render, interval);
			} else {
				// Non-TTY: just log the initial text
				stream.write(`... ${text}\n`);
			}
		},

		stop() {
			if (intervalId) {
				clearInterval(intervalId);
				intervalId = null;
			}

			// Unregister from manager
			if (managerId) {
				spinnerManager.unregister(managerId);
				managerId = null;
			}

			clearLine();
			// Show cursor again
			if (isTTY) {
				stream.write('\x1B[?25h');
			}
			startTime = null;
		},

		succeed(finalText?: string) {
			stopWithSymbol('✓', finalText);
		},

		fail(finalText?: string) {
			stopWithSymbol('✗', finalText);
		},

		warn(finalText?: string) {
			stopWithSymbol('⚠', finalText);
		},

		info(finalText?: string) {
			stopWithSymbol('ℹ', finalText);
		},

		update(newText: string) {
			text = newText;
			if (managerId) {
				spinnerManager.updateText(managerId, text);
			}
			if (!isTTY && intervalId === null) {
				// Non-TTY: log updates as new lines
				stream.write(`... ${text}\n`);
			}
		},

		isSpinning() {
			return intervalId !== null;
		},

		clearLine() {
			clearLine();
		},

		render() {
			if (intervalId !== null) {
				render();
			}
		},
	};

	return spinner;
}
