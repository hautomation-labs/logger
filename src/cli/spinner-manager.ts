/**
 * Spinner Manager - Coordinates spinners with logging
 *
 * Prevents log messages from interfering with spinner animations
 * by pausing spinners before logging and resuming after.
 */

import type { Spinner } from './spinner.js';

interface ManagedSpinner {
	spinner: Spinner;
	lastText: string;
}

class SpinnerManager {
	private spinners = new Map<symbol, ManagedSpinner>();
	private isPaused = false;

	/**
	 * Register a spinner with the manager
	 */
	register(spinner: Spinner): symbol {
		const id = Symbol('spinner');
		this.spinners.set(id, { spinner, lastText: '' });
		return id;
	}

	/**
	 * Unregister a spinner from the manager
	 */
	unregister(id: symbol): void {
		this.spinners.delete(id);
	}

	/**
	 * Update the last known text for a spinner
	 */
	updateText(id: symbol, text: string): void {
		const managed = this.spinners.get(id);
		if (managed) {
			managed.lastText = text;
		}
	}

	/**
	 * Pause all active spinners (clear their lines)
	 * Call before logging
	 */
	pause(): void {
		if (this.isPaused || this.spinners.size === 0) return;

		for (const { spinner } of this.spinners.values()) {
			if (spinner.isSpinning()) {
				// Clear the line without stopping the spinner
				spinner.clearLine();
			}
		}
		this.isPaused = true;
	}

	/**
	 * Resume all active spinners
	 * Call after logging
	 */
	resume(): void {
		if (!this.isPaused) return;
		this.isPaused = false;

		for (const { spinner } of this.spinners.values()) {
			if (spinner.isSpinning()) {
				spinner.render();
			}
		}
	}

	/**
	 * Check if any spinners are active
	 */
	hasActiveSpinners(): boolean {
		for (const { spinner } of this.spinners.values()) {
			if (spinner.isSpinning()) return true;
		}
		return false;
	}

	/**
	 * Reset all state. Intended for test isolation — clears all registered
	 * spinners and resets the paused flag so no state leaks between tests.
	 */
	reset(): void {
		this.spinners.clear();
		this.isPaused = false;
	}
}

// Global singleton instance
export const spinnerManager = new SpinnerManager();
