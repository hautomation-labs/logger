import type { LoggerConfig, LogLevel, LogTransport } from './types.js';
import { OutputFormat, TimestampFormat } from './types.js';

/**
 * Internal config state with resolved defaults
 */
interface ResolvedConfig {
	minLevel: LogLevel;
	enabled: boolean;
	format: OutputFormat;
	timestampFormat: TimestampFormat;
	showEmoji: boolean;
	transports: LogTransport[] | null; // null means use default console transport
}

/**
 * Global mutable configuration
 */
let globalConfig: ResolvedConfig = {
	minLevel: 'debug',
	enabled: true,
	format: OutputFormat.PRETTY,
	timestampFormat: TimestampFormat.TIME_ONLY,
	showEmoji: true,
	transports: null,
};

/**
 * Configure global logger settings
 *
 * @example
 * configure({ minLevel: 'warn', format: OutputFormat.JSON });
 */
export function configure(config: LoggerConfig): void {
	if (config.minLevel !== undefined) {
		globalConfig.minLevel = config.minLevel;
	}
	if (config.enabled !== undefined) {
		globalConfig.enabled = config.enabled;
	}
	if (config.format !== undefined) {
		globalConfig.format = config.format;
	}
	if (config.timestampFormat !== undefined) {
		globalConfig.timestampFormat = config.timestampFormat;
	}
	if (config.showEmoji !== undefined) {
		globalConfig.showEmoji = config.showEmoji;
	}
	if (config.transports !== undefined) {
		globalConfig.transports = config.transports;
	}
}

/**
 * Get current global configuration
 */
export function getConfig(): Readonly<ResolvedConfig> {
	return globalConfig;
}

/**
 * Reset configuration to defaults (useful for testing)
 */
export function resetConfig(): void {
	globalConfig = {
		minLevel: 'debug',
		enabled: true,
		format: OutputFormat.PRETTY,
		timestampFormat: TimestampFormat.TIME_ONLY,
		showEmoji: true,
		transports: null,
	};
}
