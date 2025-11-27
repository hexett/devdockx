import createApp from './app.js';
import logger from './lib/logger.js';

const PORT = Number(process.env.PORT || 4000);

const app = createApp();

app.listen(PORT, () => {
  logger.success(`API listening on http://localhost:${PORT}`);
});
