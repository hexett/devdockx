import { createLogger, debug } from '../lib/logger.js';

/**
 * Request logging middleware.
 * Logs at start and when the response finishes using the format: [TYPE] [SOURCE] message
 * SOURCE will be set to the request method and path (e.g. "GET /api/v1/auth/login").
 */
function logRequests(req: any, res: any, next: any) {
  const sourceLabel = `${req.method} ${req.originalUrl || req.url}`;
  const log = createLogger(sourceLabel);

  // Log incoming request (do not include sensitive fields)
  const safeBody = req.body && typeof req.body === 'object' ? { ...req.body } : req.body;
  if (safeBody && safeBody.password) safeBody.password = '••••';
  log.info(`incoming: ${req.method} ${req.originalUrl}`);
  debug && debug(`headers=${JSON.stringify(req.headers)}`);

  const start = process.hrtime();

  function onFinish() {
    res.removeListener('finish', onFinish);
    res.removeListener('close', onFinish);

    const [s, ns] = process.hrtime(start);
    const ms = Math.round(s * 1000 + ns / 1e6);
    const msg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`;

    if (res.statusCode >= 500) log.error(msg);
    else if (res.statusCode >= 400) log.warn(msg);
    else log.success(msg);
  }

  res.on('finish', onFinish);
  res.on('close', onFinish);

  next();
};

export default logRequests;
