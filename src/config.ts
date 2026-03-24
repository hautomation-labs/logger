import { resetDefaultTransport } from './default-transport.js';
import type { LoggerConfig, LogLevel, LogTransport } from './types.js';
import { OutputFormat, TimestampFormat } from './types.js';

interface ResolvedConfig {
	minLevel: LogLevel;
	enabled: boolean;
	format: OutputFormat;
	timestampFormat: TimestampFormat;
	showEmoji: boolean;
	transports: LogTransport[] | null;
}

const VALID_LEVELS: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

function getDefaultMinLevel(): LogLevel {
	const envLevel = process.env.LOG_LEVEL?.toLowerCase();
	if (envLevel && VALID_LEVELS.includes(envLevel as LogLevel)) {
		return envLevel as LogLevel;
	}
	return 'info';
}

const defaults: ResolvedConfig = {
	minLevel: getDefaultMinLevel(),
	enabled: true,
	format: OutputFormat.PRETTY,
	timestampFormat: TimestampFormat.TIME_ONLY,
	showEmoji: true,
	transports: null,
};

let globalConfig: ResolvedConfig = { ...defaults };

export function configure(config: LoggerConfig): void {
	if (config.minLevel !== undefined) globalConfig.minLevel = config.minLevel;
	if (config.enabled !== undefined) globalConfig.enabled = config.enabled;
	if (config.format !== undefined) globalConfig.format = config.format;
	if (config.timestampFormat !== undefined) globalConfig.timestampFormat = config.timestampFormat;
	if (config.showEmoji !== undefined) globalConfig.showEmoji = config.showEmoji;
	if (config.transports !== undefined) globalConfig.transports = config.transports;
}

export function getConfig(): Readonly<ResolvedConfig> {
	return globalConfig;
}

export function resetConfig(): void {
	globalConfig = { ...defaults, minLevel: getDefaultMinLevel() };
	resetDefaultTransport();
}
