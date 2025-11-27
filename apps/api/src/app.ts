import express from 'express';
import logger from './lib/logger';
import routes from './routes/index.js';
import logRequests from './middleware/logRequests.js';

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logRequests);

  // Mount modular routes
  const apiBasePath = '/api';
  app.use(apiBasePath, routes);

  // 404 fallback
  app.use((_req, res) => {
    logger.warn('Route not found');
    res.status(404).json({ error: 'Not Found' });
  });

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: any, res: any, _next: any) => {
    logger.error(err?.message || 'Unexpected error');
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

export default createApp;
