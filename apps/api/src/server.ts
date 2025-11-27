/* eslint-disable @typescript-eslint/no-unused-vars */
// Load .env early so env vars are available to all imports
import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
import createApp from './app.js';
import logger from './lib/logger.js';

const PORT = Number(process.env.PORT || 4000);

const app = createApp();

const server = app.listen(PORT, () => {
  logger.success(`API listening on http://localhost:${PORT}`);
  logger.info('Type "help" for available commands');
});

let isShuttingDown = false;
let isWritingPrompt = false;

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stderr,
  prompt: '> ',
  terminal: true,
});

// Intercept stderr writes to redraw prompt after logs
const originalStderrWrite = process.stderr.write.bind(process.stderr);

process.stderr.write = function (str: any, ...args: any[]) {
  // Prevent recursive calls when writing the prompt
  if (isWritingPrompt) {
    return originalStderrWrite(str, ...args);
  }

  // If this is a log line (not the prompt itself), redraw the prompt after
  if (str && str.toString && !str.toString().startsWith('> ') && str !== '> ') {
    originalStderrWrite(str, ...args);
    
    // Clear and redraw prompt on next tick if terminal is ready
    if (rl.terminal && !isShuttingDown) {
      setImmediate(() => {
        if (rl.terminal) {
          isWritingPrompt = true;
          process.stderr.write('\x1b[0G\x1b[K> ');
          isWritingPrompt = false;
        }
      });
    }
    return true;
  }

  return originalStderrWrite(str, ...args);
};

rl.on('line', async (input: string) => {
  const command = input.trim().toLowerCase();
  await handleCommand(command);

  if (!isShuttingDown) {
    rl.prompt();
  }
});

async function handleCommand(command: string) {
  switch (command) {
    case 'stop':
    case 'exit':
    case 'quit':
      if (!isShuttingDown) {
        isShuttingDown = true;
        logger.warn('Stopping API server...');
        rl.close();
        // Close server and then try to terminate parent process (nodemon) to avoid batch prompt on Windows
        server.close(async () => {
          logger.success('API server stopped');
          await killParentAndExit(0);
        });

        // Failsafe: force exit after 1 second
        setTimeout(() => {
          killParentAndExit(0);
        }, 1000);
      }
      break;

    case 'status':
      logger.info(`API is running on port ${PORT}`);
      logger.info(`Uptime: ${Math.round(process.uptime())}s`);
      break;

    case 'restart':
      logger.warn('Restarting API server...');
      rl.close();
      server.close(async () => {
        logger.success('API server stopped, restarting...');
        // Let nodemon detect the exit and restart — also try to ensure parent exits cleanly
        await killParentAndExit(0);
      });

      // Failsafe: exit after 1 second
      setTimeout(() => {
        killParentAndExit(0);
      }, 1000);
      break;

    case 'help':
      process.stderr.write('\n--- Available Commands ---\n');
      process.stderr.write('  stop, exit, quit    - Stop the API server\n');
      process.stderr.write('  status              - Show server status and uptime\n');
      process.stderr.write('  restart             - Restart the API server\n');
      process.stderr.write('  help                - Show this help message\n');
      process.stderr.write('  clear               - Clear the terminal\n');
      process.stderr.write('-------------------------\n');
      break;

    case 'clear':
      console.clear();
      break;

    case '':
      // Ignore empty input
      break;

    default:
      if (command.length > 0) {
        logger.warn(`Unknown command: "${command}". Type "help" for available commands.`);
      }
  }
}

rl.prompt();

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    logger.warn('SIGTERM signal received: closing HTTP server');
    rl.close();
    server.close(() => {
      logger.success('HTTP server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  if (!isShuttingDown) {
    isShuttingDown = true;
    logger.warn('SIGINT signal received: closing HTTP server');
    rl.close();
    server.close(() => {
      logger.success('HTTP server closed');
      process.exit(0);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  rl.close();
  process.exit(1);
});

// Try to kill parent process (nodemon / npm wrapper) so Windows won't prompt "Terminate batch job (Y/N)?"
async function killParentAndExit(code = 0) {
  try {
    const ppid = process.ppid;
    if (ppid && ppid !== 1) {
      if (process.platform === 'win32') {
        // Use taskkill to terminate parent process tree
        const { exec } = await import('child_process');
        exec(`taskkill /PID ${ppid} /T /F`, (err: any) => {
          // ignore errors, then exit
          process.exit(code);
        });
        return;
      } else {
        try {
          process.kill(ppid, 'SIGTERM');
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    // ignore
  }

  process.exit(code);
}
