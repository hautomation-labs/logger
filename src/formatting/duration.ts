/**
 * Format milliseconds into human-readable duration
 *
 * Re-exports formatElapsed under a semantic alias.
 * "Duration" implies a known length, "elapsed" implies ongoing measurement.
 *
 * @example
 * formatDuration(42000)   // "42s"
 * formatDuration(150000)  // "2m 30s"
 * formatDuration(3900000) // "1h 5m"
 */
export { formatElapsed as formatDuration } from '../cli/elapsed.js';
