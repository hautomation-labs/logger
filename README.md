# @hautomation-labs/logger

Lightweight TypeScript logger with emoji support for Node.js and React Native.

## Install

```bash
echo "@hautomation-labs:registry=https://npm.pkg.github.com" >> .npmrc
yarn add @hautomation-labs/logger
```

## Usage

```typescript
import { createLogger } from '@hautomation-labs/logger';

const log = createLogger({ source: 'MyService' });

log.info('Starting up');           // 📌 [INFO ] [MyService] Starting up
log.info('GET https://api.com');   // 🔗 [INFO ] [MyService] GET https://api.com
log.debug('Details', { id: 123 }); // 🐛 [DEBUG] [MyService] Details {"id":123}
log.error('Something broke');      // ❌ [ERROR] [MyService] Something broke
```

**Levels:** `trace` 🔍 · `debug` 🐛 · `info` 📌 · `warn` ⚠️ · `error` ❌ · `fatal` 💀

## Configuration

```typescript
import { configure, OutputFormat, TimestampFormat } from '@hautomation-labs/logger';

configure({
  minLevel: 'info',                     // trace | debug | info | warn | error | fatal
  format: OutputFormat.JSON,            // PRETTY (default) | JSON
  timestampFormat: TimestampFormat.ISO, // TIME_ONLY (default) | ISO | NONE
  showEmoji: false,
  enabled: false,
});

// Custom emoji per logger
const log = createLogger({ source: 'DB', emoji: '🗄️' });
```

## Transports

```typescript
import { configure, consoleTransport, fileTransport } from '@hautomation-labs/logger';

configure({
  transports: [
    consoleTransport(),
    fileTransport('./app.log'),  // Node.js only
  ],
});

// Custom transport
configure({
  transports: [{
    write(entry) {
      // entry: { timestamp, level, source, emoji, message, data }
      myExternalService.send(entry);
    }
  }]
});
```

## Utilities

```typescript
import { extractErrorMessage } from '@hautomation-labs/logger';

try {
  await riskyOperation();
} catch (error) {
  log.error(`Failed: ${extractErrorMessage(error)}`);
}
```

## CLI Utilities

Terminal spinners and progress bars with TTY detection (falls back gracefully in CI/pipes).

```typescript
import { createSpinner, createProgressBar } from '@hautomation-labs/logger';

// Spinner
const spinner = createSpinner('Loading...');
spinner.start();
// ... do work ...
spinner.succeed('Done!');  // Also: .fail(), .warn(), .info()

// Progress bar
const bar = createProgressBar({ total: 100 });
for (let i = 0; i <= 100; i++) {
  bar.update(i, `Processing item ${i}`);
}
bar.stop('Complete!');
```

## Warning Aggregator

Collect warnings during batch operations and emit a summary instead of flooding logs.

```typescript
import { createWarningAggregator, createLogger } from '@hautomation-labs/logger';

const log = createLogger({ source: 'Batch' });
const warnings = createWarningAggregator({ maxExamples: 3 });

// During processing:
warnings.add('image-size', "Size '512x512' not supported", 'file1.png');
warnings.add('image-size', "Size '512x512' not supported", 'file2.png');

// After batch:
warnings.flush(log);
// Output: ⚠️ image-size: 2 occurrences (e.g., Size '512x512' not supported) [file1.png, file2.png]
```

## Display Formatters

```typescript
import { formatCost, formatCount, formatPercent, formatDuration } from '@hautomation-labs/logger';

formatCost(0.00423);       // "$0.0042"
formatCost(1.5);           // "$1.50"
formatCount(42, 100);      // "[42/100]"
formatPercent(42, 100);    // "42%"
formatDuration(150000);    // "2m 30s"
```

## License

MIT
