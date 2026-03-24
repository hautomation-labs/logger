/**
 * Default transport — owns the lazily-created console transport singleton
 * wired to the spinner manager for terminal coordination.
 *
 * This module exists to give the default transport a single owner with
 * clear lifecycle. Both `logger.ts` (which reads it) and `config.ts`
 * (which resets it) import from here, avoiding a circular dependency.
 *
 * @internal
 */

import { spinnerManager } from './cli/spinner-manager.js';
import { consoleTransport } from './transports/console.js';
import type { LogTransport } from './types.js';

let defaultTransport: LogTransport | null = null;

/**
 * Return the shared default transport, creating it on first use.
 *
 * The transport is a `consoleTransport` with `onBeforeWrite`/`onAfterWrite`
 * wired to `spinnerManager.pause()`/`resume()` so that log output and
 * spinner animations never interleave on the terminal.
 */
export function getDefaultTransport(): LogTransport {
	if (!defaultTransport) {
		defaultTransport = consoleTransport({
			onBeforeWrite: () => spinnerManager.pause(),
			onAfterWrite: () => spinnerManager.resume(),
		});
	}
	return defaultTransport;
}

/** Called by `resetConfig()` to discard the cached transport. */
export function resetDefaultTransport(): void {
	defaultTransport = null;
}
