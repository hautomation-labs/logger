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

const defaults: ResolvedConfig = {
	minLevel: 'debug',
	enabled: true,
	format: OutputFormat.PRETTY,
	timestampFormat: TimestampFormat.TIME_ONLY,
	showEmoji: true,
	transports: null,
};

let globalConfig: ResolvedConfig = { ...defaults };

export function configure(config: LoggerConfig): void {
	Object.entries(config).forEach(([key, value]) => {
		if (value !== undefined) {
			(globalConfig as unknown as Record<string, unknown>)[key] = value;
		}
	});
}

export function getConfig(): Readonly<ResolvedConfig> {
	return globalConfig;
}

export function resetConfig(): void {
	globalConfig = { ...defaults };
}
