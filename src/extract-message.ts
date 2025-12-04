/**
 * Extract a string message from any error type.
 * Handles Error objects, strings, objects with 'message' property, and anything else.
 */
export function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;
	if (error !== null && typeof error === 'object' && 'message' in error) {
		const msg = (error as { message: unknown }).message;
		return typeof msg === 'string' ? msg : String(msg);
	}
	return String(error);
}
