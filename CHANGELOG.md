# Changelog

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
