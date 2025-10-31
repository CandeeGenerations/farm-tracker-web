# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Farm Tracker is a full-stack monorepo application for tracking farm operations including animals, products, sales, and expenses. The project uses a monorepo structure with separate client (Next.js) and server (Express/Prisma) applications.

## Development Setup

### Prerequisites

- Node.js 22.x (managed with fnm)
- PNPM 10.x (managed with corepack)
- phase.dev CLI for environment variable management

### Initial Setup

```bash
# Install dependencies for all packages
pnpm run install:all

# Configure phase.dev for client
cd client && phase init

# Configure phase.dev for server
cd server && phase init
```

### Running the Application

```bash
# Start client (from client directory)
cd client
pnpm run dev          # Development mode with Turbopack on port 3000

# Start server (from server directory)
cd server
pnpm run start        # Development mode with auto-reload on port 7889

# Build for production
cd client && pnpm run build
cd server && pnpm run build
```

## Common Commands

### Linting and Formatting

```bash
# From root - runs for both client and server
pnpm run eslint       # Lint all TypeScript files
pnpm run prettier     # Format all files
pnpm run prettier:ci  # Check formatting (CI mode)

# From client or server directories
pnpm run fix         # Run eslint and prettier with fixes
```

### Database Operations (Server)

```bash
cd server
pnpm run generate    # Generate Prisma client
pnpm run db:push     # Push schema changes to database
```

### Testing & CI

```bash
# CI-specific install (no scripts)
pnpm run install:ci
```

### Release Management

```bash
# From root
pnpm run release     # Create a new minor version release with standard-version
```

## Architecture

### Monorepo Structure

The repository is organized as a monorepo with two main packages:

- `client/` - Next.js frontend application
- `server/` - Express.js backend API with Prisma ORM

### Client Architecture (Next.js)

**Framework**: Next.js 15 with TypeScript, using Pages Router (not App Router)

**Key Directories**:

- `src/pages/` - Next.js pages following file-based routing
  - Each feature has its own page directory (e.g., `animals/`, `products/`, `sales/`)
  - `api/` contains NextAuth configuration
- `src/components/` - Reusable React components
  - `TremorRaw/` - Tremor UI component library customizations
  - `Modal/`, `Tag/` - Feature-specific components
- `src/providers/` - React context providers (e.g., UserProvider)
- `src/helpers/` - Utility functions and constants
- `src/types/` - TypeScript type definitions

**Styling**: Tailwind CSS with Tremor React UI library

**Authentication**: NextAuth.js with email-based authentication. User email is passed to backend via `email` header.

**State Management**: React Context API (see `src/providers/`)

**API Communication**: Axios for HTTP requests to backend

### Server Architecture (Express + Prisma)

**Framework**: Express.js with TypeScript, Prisma ORM, MongoDB database

**Domain-Driven Structure**:
Each feature domain follows a consistent pattern under `src/domains/`:

```
src/domains/<domain>/
  ├── routes.ts    - Express route definitions
  ├── service.ts   - Business logic and database operations
  ├── morphs.ts    - Data transformation functions (DB ↔ API)
  └── types.ts     - TypeScript types for the domain
```

**Domains**: `animal`, `product`, `sale`, `expense`, `logged-product`, `product-sale`, `ping`

**API Structure**: All routes follow the pattern `/api/<domain>` with nested routes for relationships:

- `/api/animal`
- `/api/product`
  - `/api/product/:productId/logged-product`
  - `/api/product/:productId/expense`
  - `/api/product/:productId/sale`
- `/api/sale`

**Common Utilities** (`src/common/`):

- `client.ts` - Prisma client instance
- `config.ts` - Environment configuration
- `helpers.ts` - Request/response helpers, including `getEmail()` for auth
- `logger.ts` - Winston logger configuration
- `constants.ts` - Shared constants

**Database**: MongoDB with Prisma

- Schema located in `server/prisma/`
- Models split across separate files in `prisma/models/`
- Generated client outputs to `server/generated/prisma/client/`

**Authentication**: Email-based via `email` header extracted by `getEmail()` helper in routes

### Key Patterns

**Server Route Pattern**:

```typescript
router.post('/endpoint', async (req: Request, res: Response) => {
  try {
    const email = getEmail(req, res)
    const result = await service.operation(email, req.body)
    return handleSuccess(res, morphData(result))
  } catch (error) {
    return handleError(res, error as IException)
  }
})
```

**Service Layer**: Simple CRUD operations using Prisma client

- `getAll(owner)` - Fetch all records for owner
- `getSingle(id)` - Fetch single record with relations
- `create(data)` - Create new record
- `update(id, data)` - Update existing record
- `remove(id)` - Delete record

**Data Morphing**: Use morphs to transform between API and database representations

## Git Workflow

**Commit Convention**: Conventional Commits enforced via commitlint

- Husky pre-commit hook runs lint-staged (prettier, eslint, sort-package-json)
- Husky commit-msg hook validates commit message format

**Lint-Staged**: Auto-formats and lints changed files on commit

**Branches**: Main branch is `main`

## Environment Management

**phase.dev**: Used for secure environment variable management

- Each workspace (client/server) has its own `.phase.json` configuration
- Run `phase run 'command'` to inject environment variables
- Configure with `phase init` in each directory

**Environment Variables**:

- Server: `PORT` (default 7889), `DATABASE_URL`
- Client: `NEXT_PUBLIC_APP_VERSION` (from package.json)

## Node Version Management

Uses `fnm` (Fast Node Manager) with `.nvmrc` files in root, client, and server directories. Always use `fnm use` before running commands in each workspace.

## Important Notes

- Always run commands from the appropriate directory (root, client, or server)
- Use `pnpm` as the package manager (enforced via preinstall scripts)
- Prisma client must be regenerated after schema changes: `cd server && pnpm run generate`
- When adding new API routes, register them in `server/src/index.ts`
- When creating new domains, follow the existing domain structure pattern
- Client and server have separate dependencies and must be installed separately via `install:all`
- Plan markdown files should be placed in the `plans/` folder at the repository root
