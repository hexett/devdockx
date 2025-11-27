# DevDockX API

A modular, production-ready Express.js API built with TypeScript, featuring Stripe payment integration, Supabase authentication and database, and structured logging with color-coded output.

## 🎯 Features

- **Modular Route Architecture**: Clean separation of concerns with organized route modules
- **Authentication**: Supabase JWT-based authentication with protected endpoints
- **Payment Processing**: Stripe integration for subscription and one-time payments
- **Structured Logging**: Color-coded, symbol-annotated logs with source tracking
- **Type Safety**: Full TypeScript support with strict mode enabled
- **Request Middleware**: Automatic request/response logging with timing
- **ESM Modules**: Modern ES modules throughout the codebase

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Development Setup

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Configure your environment variables (see .env.example)
```

### Environment Variables

Create a `.env` file in the `apps/api` directory with the following variables:

```env
# Port the API listens on (default: 4000)
PORT=4000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...

# Debugging
DEBUG=false
```

## 🚀 Running the API

### Development Mode

```bash
# From monorepo root
pnpm --filter ./apps/api dev

# Or with Turborepo from root
pnpm turbo dev --filter=devdockx-api
```

The API will start on `http://localhost:4000` with hot-reload enabled.

### Build & Production

```bash
# Build TypeScript to JavaScript
pnpm --filter ./apps/api build

# Start production server
node dist/server.js
```

## 📚 API Routes

All routes are prefixed with `/api`.

### Health Check

```
GET /api/v1/health
```

Returns API health status and uptime.

### Authentication (`/api/v1/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login with email/password
- `POST /logout` - Logout current session
- `GET /me` - Get current user (requires auth)

### Projects (`/api/v1/projects`)

- `GET /` - List all projects
- `GET /:id` - Get project details
- `POST /` - Create a new project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `GET /:id/stats` - Get project statistics

### Integrations (`/api/v1/integrations`)

- `GET /` - List integrations
- `POST /github` - Connect GitHub integration
- `DELETE /:id` - Remove integration

### API Tokens (`/api/v1/tokens`)

- `GET /` - List API tokens
- `POST /` - Create new token
- `DELETE /:id` - Revoke token

### Billing (`/api/v1/billing`)

- `POST /create-checkout` - Create Stripe checkout session
- `POST /webhook` - Handle Stripe webhooks
- `GET /subscription` - Get subscription details

## 🏗️ Project Structure

```
src/
├── app.ts                 # Express app factory
├── server.ts              # Server entrypoint
├── lib/
│   ├── logger.ts         # Structured logging utility
│   ├── supabase.ts       # Supabase client initialization
│   └── stripe.ts         # Stripe client initialization
├── middleware/
│   ├── logRequests.ts    # Request/response logging middleware
│   └── requireAuth.ts    # JWT authentication middleware
└── routes/
    ├── index.ts          # Route aggregator
    └── v1/
        ├── index.ts      # v1 routes aggregator
        ├── health.ts     # Health check routes
        ├── auth.ts       # Authentication routes
        ├── projects.ts   # Project management routes
        ├── integrations.ts # Integration routes
        ├── apitokens.ts  # API token routes
        └── billing.ts    # Billing/payment routes
```

## 🔧 Development

### Code Quality

```bash
# Lint the API package
pnpm --filter ./apps/api lint

# Fix linting issues
pnpm --filter ./apps/api lint -- --fix

# Type check
pnpm --filter ./apps/api check-types
```

### Adding New Routes

1. Create a new file in `src/routes/v1/` (e.g., `myfeature.ts`)
2. Define your router:

```typescript
import { Router } from 'express';
import { createLogger } from '../../lib/logger.js';

const log = createLogger('myfeature');
const router = Router();

router.get('/', async (req: any, res: any) => {
  log.info('Fetching features');
  res.json({ features: [] });
});

export default router;
```

3. Register it in `src/routes/v1/index.ts`:

```typescript
import myFeatureRoutes from './myfeature.js';

// In the router setup:
router.use('/myfeature', myFeatureRoutes);
```

### Using the Logger

```typescript
import { createLogger } from '../lib/logger.js';

const log = createLogger('my-module');

log.info('Information message');      // Blue info log
log.success('Success message');       // Green success log
log.warn('Warning message');          // Orange warning log
log.error('Error message');           // Red error log
log.debug('Debug message');           // Magenta debug (when DEBUG=true)
```

Output format: `[TIMESTAMP] [SYMBOL] [TYPE] [SOURCE] message`

### Authentication & Protected Routes

Use the `requireAuth` middleware on routes that need authentication:

```typescript
import { requireAuth } from '../../middleware/requireAuth.js';

router.get('/protected', requireAuth, async (req: any, res: any) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

### Supabase Integration

```typescript
import { supabase } from '../../lib/supabase.js';

// Query example
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);
```

### Stripe Integration

```typescript
import stripe from '../../lib/stripe.js';

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: 'usd',
});
```

## 📋 Configuration Files

### `tsconfig.json`

TypeScript compiler options:
- Target: ES2020
- Module: ES2020 (ESM)
- Strict mode enabled with `noImplicitAny: false`
- Source maps included for debugging

### `eslint.config.js`

ESLint configuration extending the monorepo's shared config with rules allowing explicit `any` types for flexibility during development.

### `package.json`

Scripts:
- `dev` - Start with ts-node-dev (hot-reload)
- `build` - Compile TypeScript to JavaScript
- `start` - Run compiled production build
- `lint` - Run ESLint

## 🐛 Debugging

Enable debug logs by setting the environment variable:

```bash
DEBUG=true pnpm --filter ./apps/api dev
```

This will include detailed debug logs in the output.

## 📦 Dependencies

### Production
- **express** - Web framework
- **@supabase/supabase-js** - Supabase client
- **stripe** - Stripe SDK
- **chalk** - Terminal color styling
- **log-symbols** - Symbol-based logging

### Development
- **typescript** - Type checking
- **ts-node-dev** - TypeScript development server
- **eslint** - Code linting
- **@types/express** - Express type definitions
- **@types/node** - Node.js type definitions

## 🚢 Deployment

### Build Steps

```bash
# From monorepo root
pnpm turbo build --filter=devdockx-api
```

This generates a `dist/` folder with compiled JavaScript.

### Environment Setup

Ensure these environment variables are set in your hosting environment:
- `PORT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`

### Running in Production

```bash
node dist/server.js
```

Or via Docker (example):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist ./dist
COPY node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

## 📝 License

MIT License
