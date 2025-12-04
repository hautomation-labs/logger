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

## License

MIT
