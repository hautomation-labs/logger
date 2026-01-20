import { formatElapsed } from './elapsed.js';

export interface ProgressBarOptions {
	/** Total number of items */
	total: number;
	/** Width of the bar in characters (default: 30) */
	width?: number;
	/** Character for completed portion (default: '█') */
	complete?: string;
	/** Character for incomplete portion (default: '░') */
	incomplete?: string;
	/** Show count [current/total] (default: true) */
	showCount?: boolean;
	/** Show elapsed time (default: true) */
	showElapsed?: boolean;
	/** Output stream (default: process.stdout) */
	stream?: NodeJS.WriteStream;
}

export interface ProgressBar {
	/** Update progress to a specific value */
	update(current: number, text?: string): void;
	/** Increment progress by delta (default: 1) */
	increment(delta?: number, text?: string): void;
	/** Stop the progress bar and move to next line */
	stop(finalText?: string): void;
	/** Get current progress value */
	getCurrent(): number;
}

/**
 * Create a terminal progress bar
 *
 * Falls back to periodic logging in non-TTY environments
 *
 * @example
 * const bar = createProgressBar({ total: 100 });
 * for (let i = 0; i <= 100; i++) {
 *   bar.update(i, `Processing item ${i}`);
 * }
 * bar.stop('Complete!');
 */
export function createProgressBar(options: ProgressBarOptions): ProgressBar {
	const {
		total,
		width = 30,
		complete = '█',
		incomplete = '░',
		showCount = true,
		showElapsed = true,
		stream = process.stdout,
	} = options;

	let current = 0;
	let text = '';
	const startTime = Date.now();
	const isTTY = stream.isTTY ?? false;
	let lastLoggedPercent = -10; // For non-TTY: log every 10%

	const clearLine = () => {
		if (isTTY) {
			stream.write('\r\x1B[K');
		}
	};

	const render = () => {
		const percent = Math.min(100, Math.floor((current / total) * 100));
		const filledWidth = Math.floor((current / total) * width);
		const emptyWidth = width - filledWidth;

		const bar = complete.repeat(filledWidth) + incomplete.repeat(emptyWidth);

		let line = `[${bar}]`;

		if (showCount) {
			line += ` ${current}/${total}`;
		}

		if (showElapsed) {
			line += ` (${formatElapsed(Date.now() - startTime)})`;
		}

		if (text) {
			line += ` ${text}`;
		}

		if (isTTY) {
			clearLine();
			stream.write(line);
		} else {
			// Non-TTY: log at 0%, 10%, 20%, ..., 100%
			if (percent >= lastLoggedPercent + 10 || current === total) {
				lastLoggedPercent = Math.floor(percent / 10) * 10;
				stream.write(`[${percent}%] ${current}/${total}${text ? ` - ${text}` : ''}\n`);
			}
		}
	};

	return {
		update(newCurrent: number, newText?: string) {
			current = Math.min(total, Math.max(0, newCurrent));
			if (newText !== undefined) text = newText;
			render();
		},

		increment(delta = 1, newText?: string) {
			current = Math.min(total, current + delta);
			if (newText !== undefined) text = newText;
			render();
		},

		stop(finalText?: string) {
			if (isTTY) {
				clearLine();
				const elapsed = formatElapsed(Date.now() - startTime);
				const displayText = finalText ?? `Completed ${total} items`;
				stream.write(`✓ ${displayText} (${elapsed})\n`);
			} else if (finalText) {
				stream.write(`✓ ${finalText}\n`);
			}
		},

		getCurrent() {
			return current;
		},
	};
}
