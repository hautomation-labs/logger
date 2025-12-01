/**
 * Extract a string message from any error type
 *
 * Handles:
 * - Error objects (returns error.message)
 * - Strings (returns as-is)
 * - Objects with 'message' property
 * - Everything else (converts to string)
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   const message = extractErrorMessage(error);
 *   log.error(`Operation failed: ${message}`);
 * }
 *
 * @example
 * // Works with any error type
 * extractErrorMessage(new Error('Something broke')); // 'Something broke'
 * extractErrorMessage('Plain string error');          // 'Plain string error'
 * extractErrorMessage({ message: 'API error' });      // 'API error'
 * extractErrorMessage(42);                            // '42'
 * extractErrorMessage(null);                          // 'null'
 */
export function extractErrorMessage(error: unknown): string {
	// Handle Error objects
	if (error instanceof Error) {
		return error.message;
	}

	// Handle strings
	if (typeof error === 'string') {
		return error;
	}

	// Handle objects with 'message' property (like API errors)
	if (error !== null && typeof error === 'object' && 'message' in error) {
		const msg = (error as { message: unknown }).message;
		return typeof msg === 'string' ? msg : String(msg);
	}

	// Fallback: convert to string
	return String(error);
}
