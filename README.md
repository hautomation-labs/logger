# @hautomation-labs/logger

Lightweight TypeScript logger with emoji support.

## Install

```bash
echo "@hautomation-labs:registry=https://npm.pkg.github.com" >> .npmrc
yarn add @hautomation-labs/logger
```

## Usage

```typescript
import { createLogger } from '@hautomation-labs/logger';

const log = createLogger({ source: 'MyService' });

log.info('Starting up');              // 📌 [INFO ] [MyService] Starting up
log.info('GET https://api.com');      // 🔗 [INFO ] [MyService] GET https://api.com
log.debug('Details', { foo: 'bar' }); // 🐛 [DEBUG] [MyService] Details {"foo":"bar"}
log.error('Something broke');         // ❌ [ERROR] [MyService] Something broke
```

## Log Levels

| Level | Emoji | Level | Emoji |
|-------|-------|-------|-------|
| trace | 🔍 | warn  | ⚠️ |
| debug | 🐛 | error | ❌ |
| info  | 📌 (🔗 with URL) | fatal | 💀 |

## Configuration

```typescript
import { configure, OutputFormat, TimestampFormat } from '@hautomation-labs/logger';

configure({
  minLevel: 'info',                    // trace | debug | info | warn | error | fatal
  format: OutputFormat.JSON,           // PRETTY (default) | JSON
  timestampFormat: TimestampFormat.ISO, // TIME_ONLY (default) | ISO | NONE
  showEmoji: false,                    // true (default) | false
});
```

## Custom Emoji

```typescript
// Static emoji
const log = createLogger({ source: 'DB', emoji: '🗄️' });

// Dynamic emoji
const log = createLogger({
  source: 'Api',
  emoji: (message, level) => level === 'error' ? '💥' : '🌐'
});
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
      myService.send(entry);
    }
  }]
});
```

## Error Handling

```typescript
import { extractErrorMessage } from '@hautomation-labs/logger';

try {
  await riskyOperation();
} catch (error) {
  log.error(`Failed: ${extractErrorMessage(error)}`);
}
```

## License

MIT
