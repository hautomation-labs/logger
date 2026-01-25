# Changelog

## [1.3.0] - 2026-01-25

### Added
- `multiLineCount` option on `createSpinner()` for proper multi-line text clearing
- `multiLine` option on `createTaskSpinner()` for tree-style two-line display format
- `startTimeMs` option on `createTaskSpinner()` for external start time (useful for resume scenarios)

## [1.2.0] - 2026-01-22

### Added
- `spinnerManager` - coordinates spinners with logging to prevent line mixing
- `BAR_FRAMES` - smooth braille bar animation (now the default)
- `clearLine()` and `render()` methods on Spinner interface for log coordination

### Changed
- Console transport now pauses/resumes spinners during logging
- Task spinner shows real-time elapsed time updates
- Default spinner animation changed from dots to braille bar

### Removed
- `DOTS_FRAMES` and `HOURGLASS_FRAMES` exports (use `BAR_FRAMES` or `CLOCK_FRAMES`)

## [1.1.0] - 2026-01-20

### Added
- CLI utilities: `createSpinner()`, `createProgressBar()`, `createTaskSpinner()` with TTY detection
- Warning aggregator: `createWarningAggregator()` for batch warning collection
- Display formatters: `formatCost()`, `formatCount()`, `formatPercent()`, `formatDuration()`, `formatElapsed()`
- Tests for new modules (formatting, warning-aggregator)

### Changed
- Updated documentation (README.md, CLAUDE.md) to reflect new features

## [1.0.2] - 2026-01-17

### Fixed
- Error objects now serialize properly in JSON output (captures `name`, `message`, `stack` and custom properties)

## [1.0.1] - 2025-12-04

### Added
- Test suite with vitest (config, formatters, logger, extract-message tests)

### Changed
- Simplified codebase by removing verbose JSDoc comments
- Streamlined README with more concise documentation
- Updated LICENSE year to 2025
- Reduced code verbosity while maintaining functionality

## [1.0.0] - 2025-12-04

### Added
- Initial release
- Log levels: trace, debug, info, warn, error, fatal
- Emoji indicators for each log level
- Smart URL detection with auto 🔗 emoji
- Custom emoji support (static or dynamic)
- Pretty and JSON output formats
- Timestamp options: TIME_ONLY, ISO, NONE
- Console and file transports
- Custom transport support
- Global configuration via `configure()`
- `extractErrorMessage()` utility
- ESM and CommonJS dual module support
