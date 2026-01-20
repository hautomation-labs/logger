/**
 * Format a dollar amount for display
 *
 * @example
 * formatCost(0.00423) // "$0.0042"
 * formatCost(1.5)     // "$1.50"
 * formatCost(0)       // "$0.00"
 * formatCost(123.456) // "$123.46"
 */
export function formatCost(dollars: number): string {
	if (dollars === 0) {
		return '$0.00';
	}

	// For very small amounts, show more precision
	if (dollars < 0.01) {
		// Show 4 decimal places for sub-cent amounts
		return `$${dollars.toFixed(4)}`;
	}

	// Standard 2 decimal places
	return `$${dollars.toFixed(2)}`;
}
