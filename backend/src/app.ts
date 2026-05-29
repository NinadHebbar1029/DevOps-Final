import cors from 'cors';
import express from 'express';
import { config } from './config';
import { pingDatabase } from './db';
import { billsRouter } from './routes/todos';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.clientOrigin
    })
  );
  app.use(express.json());

  app.get('/health', async (_request, response, next) => {
    try {
      const connected = await pingDatabase();
      response.json({
        status: 'ok',
        database: connected ? 'connected' : 'in-memory',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/health', async (_request, response, next) => {
    try {
      const connected = await pingDatabase();
      response.json({
        status: 'ok',
        database: connected ? 'connected' : 'in-memory',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  app.use('/api/bills', billsRouter);

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' });
  });

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : 'Internal server error';
    response.status(500).json({ message });
  });

  return app;
}