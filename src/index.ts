// Core API
export { configure, getConfig, resetConfig } from './config.js';
export { createLogger } from './logger.js';

// Utilities
export { extractErrorMessage } from './extract-message.js';

// Transports
export { consoleTransport, fileTransport } from './transports/index.js';

// Formatters (for custom transports)
export { formatData, formatJson, formatPretty, formatTimestamp } from './formatters.js';

// Types
export type { LogEntry, Logger, LoggerConfig, LogLevel, LogTransport } from './types.js';
export { OutputFormat, TimestampFormat } from './types.js';

// CLI utilities
export {
	BAR_FRAMES,
	CLOCK_FRAMES,
	createProgressBar,
	createSpinner,
	createTaskSpinner,
	formatElapsed,
	type ProgressBar,
	type ProgressBarOptions,
	type Spinner,
	spinnerManager,
	type SpinnerOptions,
	type TaskSpinner,
	type TaskSpinnerOptions,
} from './cli/index.js';

// Warning aggregation
export {
	type AggregatedWarning,
	createWarningAggregator,
	type WarningAggregator,
	type WarningAggregatorOptions,
} from './aggregation/index.js';

// Display formatters
export { formatCost, formatCount, formatDuration, formatPercent } from './formatting/index.js';
