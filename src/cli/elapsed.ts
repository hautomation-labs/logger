/**
 * Format milliseconds into human-readable elapsed time
 *
 * @example
 * formatElapsed(42000) // "42s"
 * formatElapsed(150000) // "2m 30s"
 * formatElapsed(3900000) // "1h 5m"
 */
export function formatElapsed(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	}

	if (minutes > 0) {
		const remainingSeconds = seconds % 60;
		return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
	}

	return `${seconds}s`;
}
