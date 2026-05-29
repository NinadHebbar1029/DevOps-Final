import { config } from './config';
import { initDatabase } from './db';
import { createApp } from './app';

async function bootstrap() {
  await initDatabase();

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Server startup failed';
  console.error(message);
  process.exit(1);
});