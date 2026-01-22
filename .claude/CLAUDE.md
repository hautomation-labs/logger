# @hautomation-labs/logger

## Commands

```bash
yarn build       # Build with tsup (ESM + CJS)
yarn typecheck   # Type check
yarn lint        # ESLint
yarn lint:fix    # Fix lint issues
yarn test        # Run tests
```

## Publish

```bash
yarn build && yarn npm publish --access public
```

## Structure

```
src/
├── index.ts           # Public exports
├── logger.ts          # createLogger() factory
├── config.ts          # configure(), getConfig(), resetConfig()
├── types.ts           # Interfaces, enums, LEVEL_EMOJIS, LEVEL_PRIORITY
├── formatters.ts      # formatPretty(), formatJson(), formatTimestamp()
├── extract-message.ts # extractErrorMessage()
├── transports/
│   ├── console.ts     # consoleTransport()
│   └── file.ts        # fileTransport() (Node.js only)
├── cli/
│   ├── spinner.ts     # createSpinner() - animated terminal spinner
│   ├── spinner-manager.ts # spinnerManager - coordinates spinners with logging
│   ├── progress-bar.ts # createProgressBar() - terminal progress bar
│   ├── task-spinner.ts # createTaskSpinner() - spinner with state tracking
│   └── elapsed.ts     # formatElapsed() - time formatting
├── aggregation/
│   └── warning-aggregator.ts # createWarningAggregator() - batch warning collection
└── formatting/
    ├── cost.ts        # formatCost() - dollar amounts
    ├── count.ts       # formatCount(), formatPercent()
    └── duration.ts    # formatDuration() (re-exports formatElapsed)
```

## Key Types

- `createLogger(options?)` → `Logger` with trace/debug/info/warn/error/fatal methods
- `configure(config)` → sets minLevel, format, timestampFormat, showEmoji, transports
- `LogEntry` → { timestamp?, level, source?, emoji, message, data? }
- `EmojiResolver` → `string | (message, level) => string`

## Default Behavior

- Info level: 📌 default, 🔗 when message contains URL
- Other levels use LEVEL_EMOJIS
- Custom emoji overrides all defaults
