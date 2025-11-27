# DevDockX Monorepo

A modern TypeScript-based monorepo powered by [Turborepo](https://turborepo.com/) and [pnpm](https://pnpm.io/) workspaces, featuring a modular Express API, Next.js applications, and shared component libraries.

## 📦 Project Structure

```
devdockx/
├── apps/
│   ├── api/              # Express API (Node.js backend)
│   ├── web/              # Next.js web application
│   └── docs/             # Next.js documentation site
├── packages/
│   ├── ui/               # Shared React UI components
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── turbo.json            # Turborepo configuration
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package manifest
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 9.0.0+

### Installation

```bash
# Install dependencies across all workspaces
pnpm install
```

## 📚 Available Commands

```bash
# Development mode (run all apps with hot-reload)
pnpm dev

# Build all apps and packages
pnpm build

# Lint entire monorepo
pnpm lint

# Format code with Prettier
pnpm format

# Type-check all TypeScript packages
pnpm check-types
```

### Filtering Commands

Run commands for specific apps/packages using Turborepo filters:

```bash
# Develop only the API
pnpm turbo dev --filter=devdockx-api

# Build only the web app
pnpm turbo build --filter=./apps/web

# Lint only UI package
pnpm turbo lint --filter=@repo/ui
```

## 🏗️ Apps & Packages

### Apps

#### API (`apps/api`)
Modular Express.js backend with TypeScript, featuring:
- Stripe integration for payments
- Supabase for authentication & database
- Structured logging with color-coded output
- Modular route architecture
- [See API README](./apps/api/README.md) for details

#### Web (`apps/web`)
Next.js application for the main product interface.

#### Docs (`apps/docs`)
Next.js documentation site.

### Packages

#### UI (`packages/ui`)
Shared React component library used across web and docs apps.

#### ESLint Config (`packages/eslint-config`)
Centralized ESLint configuration extending base, Next.js, and React rules.

#### TypeScript Config (`packages/typescript-config`)
Shared TypeScript compiler options for various project types.

## 🔧 Technology Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Language**: TypeScript
- **Frontend**: Next.js, React
- **Backend**: Express.js
- **Auth & Database**: Supabase
- **Payments**: Stripe
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: pnpm

## 📖 Development Guide

### Starting Development

```bash
# Start all development servers
pnpm dev

# Or start a specific app
pnpm --filter ./apps/api dev
pnpm --filter ./apps/web dev
```

### Adding Dependencies

Use pnpm filters to add dependencies to specific workspaces:

```bash
# Add to API package
pnpm --filter ./apps/api add <package-name>

# Add dev dependency to shared UI
pnpm --filter @repo/ui add -D <package-name>
```

### Code Quality

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint -- --fix

# Format code
pnpm format

# Check types
pnpm check-types
```

## 🤝 Contributing

1. Create a feature branch
2. Make changes following the project conventions
3. Run `pnpm lint` and `pnpm format` to ensure code quality
4. Commit and push changes
5. Open a pull request

## 📝 License

MIT License
