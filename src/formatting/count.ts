/**
 * Format a count progress indicator
 *
 * @example
 * formatCount(42, 100) // "[42/100]"
 * formatCount(0, 50)   // "[0/50]"
 * formatCount(10, 10)  // "[10/10]"
 */
export function formatCount(current: number, total: number): string {
	return `[${current}/${total}]`;
}

/**
 * Format a percentage
 *
 * @example
 * formatPercent(42, 100) // "42%"
 * formatPercent(1, 3)    // "33%"
 */
export function formatPercent(current: number, total: number): string {
	if (total === 0) return '0%';
	const percent = Math.floor((current / total) * 100);
	return `${percent}%`;
}
