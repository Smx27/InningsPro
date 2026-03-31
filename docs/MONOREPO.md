# Monorepo & Turborepo Guide

> **Master the InningsPro monorepo architecture and optimize your development workflow with Turborepo.**

---

## 📚 Table of Contents

- [Overview](#overview)
- [Why Monorepo?](#why-monorepo)
- [Directory Structure](#directory-structure)
- [Turborepo Fundamentals](#turborepo-fundamentals)
- [Working with pnpm Workspaces](#working-with-pnpm-workspaces)
- [Development Workflow](#development-workflow)
- [Building & Caching](#building--caching)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

**InningsPro** is organized as a **pnpm monorepo** with **Turborepo** for intelligent task orchestration and caching.

### Key Benefits

- 🚀 **Fast Builds** — Incremental compilation and caching
- 🔗 **Shared Code** — Reusable packages across apps
- 📦 **Single Dependency Tree** — One `node_modules` for all packages
- 🎯 **Task Orchestration** — Run tasks across packages in parallel
- 💾 **Smart Caching** — Never rebuild unchanged code
- 🔄 **Type Safety** — Shared TypeScript contracts

---

## Why Monorepo?

### Problems Solved

**Before Monorepo:**

- Duplicated domain logic (scoring engine copied in mobile and web)
- Inconsistent types across applications
- Complex dependency management
- Slow build/test cycles

**After Monorepo:**

- ✅ Single source of truth for shared code
- ✅ Consistent types across all packages
- ✅ Unified dependency management
- ✅ Fast, incremental builds with Turborepo caching

### Our Architecture

```
InningsPro (Monorepo)
├── apps/
│   ├── mobile/              # React Native app
│   └── report-web/          # Next.js web app
├── packages/
│   ├── shared-types/        # Cricket domain models (imported by all)
│   ├── ui-tokens/           # Design tokens (used by mobile & web)
│   └── export-schema/       # Export validation (used by all)
└── turbo.json + pnpm-workspace.yaml
```

### Dependency Flow

```
apps/mobile ──┐
              ├──→ packages/shared-types
apps/report-web ──┤
                  ├──→ packages/ui-tokens
packages/export-schema ──┤
                         └──→ external npm packages
```

---

## Directory Structure

### Root Level

```
InningsPro/
├── apps/                    # Applications
├── packages/                # Shared packages
├── tooling/                 # Dev tools & configs
├── docs/                    # Documentation
├── package.json             # Root package (private workspace root)
├── pnpm-workspace.yaml      # Workspace definition
├── pnpm-lock.yaml           # Lock file (auto-generated)
├── turbo.json               # Turborepo configuration
└── tsconfig.base.json       # Shared TypeScript config
```

### `apps/` — Applications

```
apps/
├── mobile/
│   ├── app/                 # Expo app directory
│   ├── src/                 # Source code
│   ├── package.json         # App dependencies
│   └── tsconfig.json        # App TypeScript config
└── report-web/
    ├── app/                 # Next.js app directory
    ├── src/                 # Source code
    ├── package.json
    └── tsconfig.json
```

### `packages/` — Shared Code

```
packages/
├── shared-types/
│   ├── src/
│   │   ├── match.ts         # Match types
│   │   ├── innings.ts       # Innings types
│   │   ├── delivery.ts      # Delivery types
│   │   └── index.ts         # Exports
│   └── package.json
├── ui-tokens/
│   ├── src/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   └── package.json
└── export-schema/
    ├── src/
    │   ├── schemas/
    │   ├── validators.ts
    │   └── index.ts
    └── package.json
```

### `tooling/` — Development Tools

```
tooling/
├── eslint-config/           # Shared ESLint config
├── typescript-config/       # Shared TypeScript configs
└── prettier-config/         # Shared Prettier config
```

---

## Turborepo Fundamentals

### What is Turborepo?

**Turborepo** is a high-performance build system that:

- 🔍 **Analyzes dependencies** between packages
- 🎯 **Runs tasks in optimal order** (parallelizes when safe)
- 💾 **Caches outputs** to skip redundant work
- ⚡ **Speeds up CI/CD** with remote caching

### `turbo.json` Configuration

```json
{
  "version": "1",
  "extends": ["//"],
  "globalDependencies": ["package.json", "tsconfig.base.json"],
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "typecheck": {
      "cache": true
    },
    "lint": {
      "cache": true
    }
  }
}
```

### Task Definition Syntax

```yaml
build: # Task name
  dependsOn: # Dependencies
    - ^build # "^" = depends on pkg dependencies' build
  outputs: # Folders to cache
    - 'dist/**'
  cache: true # Enable caching
  persistent: true # Keep running (for dev servers)
```

---

## Working with pnpm Workspaces

### What is pnpm?

**pnpm** (performant npm) provides:

- 📦 **Monorepo support** via workspaces
- 💾 **Efficient storage** (links instead of copies)
- 🔒 **Strict dependency isolation** (prevents accidental cross-package imports)
- ⚡ **Fast installs** (parallelized)

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*' # All packages in apps/
  - 'packages/*' # All packages in packages/
  - 'tooling/*' # All packages in tooling/
```

### Cross-Package Dependencies

When **mobile** needs code from **shared-types**, add to `apps/mobile/package.json`:

```json
{
  "dependencies": {
    "@inningspro/shared-types": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to use the local version (no npm download).

---

## Development Workflow

### 1. Install Dependencies

```bash
# First time setup
pnpm install

# Add a new dependency to a specific package
pnpm add lodash --filter=mobile

# Add a dev dependency
pnpm add --save-dev @types/lodash --filter=mobile

# Add a workspace package as dependency
pnpm add @inningspro/shared-types --filter=report-web
```

### 2. Run Development Servers

```bash
# Start all dev servers
pnpm dev

# Start specific app
pnpm dev --filter=mobile
pnpm dev --filter=report-web

# Watch for changes in a package
pnpm dev --filter=shared-types --filter=mobile
```

### 3. Structure of `package.json` Scripts

```json
{
  "scripts": {
    "dev": "turbo dev",              # All dev servers
    "build": "turbo build",          # Build all packages
    "test": "turbo test",            # Test all packages
    "typecheck": "turbo typecheck",  # Type check all
    "lint": "turbo lint",            # Lint all
    "format": "prettier --write ."   # Format entire monorepo
  }
}
```

### 4. Running Filtered Tasks

```bash
# Run build only for mobile and its dependencies
pnpm build --filter=mobile

# Run tests only for shared-types
pnpm test --filter=shared-types

# Run typecheck excluding a package
pnpm typecheck --filter="!report-web"

# Run with output
pnpm build --filter=mobile -- --verbose
```

---

## Building & Caching

### Understanding Cache

**Turborepo caches:**

- Task outputs (build artifacts, compiled code)
- Test results
- Lint/typecheck results

**Turbo skips re-running a task if:**

- Source code hasn't changed
- Dependencies haven't changed
- Output cache exists locally

### Cache Control

```bash
# Skip cache (rebuild everything)
pnpm build -- --force

# View cache info
turbo build --graph

# Clear local cache
rm -rf .turbo
rm -rf node_modules/.turbo
```

### Production Build

```bash
# Build all packages and apps
pnpm build

# Build specific app
pnpm build --filter=mobile

# View build output
ls -la apps/mobile/dist/
ls -la apps/report-web/.next/
```

---

## Common Tasks

### Adding a New Package

```bash
# Create directory
mkdir -p packages/my-package
cd packages/my-package

# Initialize package
cat > package.json << 'EOF'
{
  "name": "@inningspro/my-package",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {}
}
EOF

# Add TypeScript config
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Create src directory
mkdir -p src
echo 'export const hello = "world";' > src/index.ts

# Install dependencies
pnpm install

# Verify
pnpm build --filter=@inningspro/my-package
```

### Adding a New App

```bash
# Use Expo CLI for mobile
npx create-expo-app apps/new-mobile

# Use Next.js for web
pnpm dlx create-next-app apps/new-web

# Update pnpm-workspace.yaml if patterns don't match
```

### Importing from Shared Packages

In **apps/mobile/src/scoring.ts**:

```typescript
// Import from shared-types
import { Match, Innings, Delivery } from '@inningspro/shared-types';
import { theme } from '@inningspro/ui-tokens';

// Your code
export function recordDelivery(match: Match, delivery: Delivery) {
  // ...
}
```

### Updating Shared Package Version

1. Update `packages/shared-types/package.json` version
2. Run `pnpm install` (updates lock file)
3. Commit the change
4. All apps automatically use new version

---

## Dependency Graph & Visualization

### View Dependency Graph

```bash
# Generate graph in terminal
turbo build --graph

# Generate graph file (requires Graphviz)
turbo build --graph=graph.png
turbo build --graph=graph.html
```

### Reading the Graph

```
mobile → shared-types
       → ui-tokens
           ↓
     export-schema
           ↓
         npm packages
```

---

## Performance Tips

### 1. Optimize Cache Usage

```bash
# Good: Let Turbo manage cache
pnpm build

# Bad: Force rebuild unnecessarily
pnpm build -- --force
```

### 2. Keep Dependency Tree Shallow

```bash
# ❌ Avoid deep chains
App → PkgA → PkgB → PkgC

# ✅ Prefer direct imports
App → PkgA
   → PkgB
   → PkgC
```

### 3. Use `dependsOn` Wisely

In `turbo.json`:

```json
{
  "build": {
    "dependsOn": ["^build"] // Build dependencies first
  },
  "dev": {
    "cache": false, // Don't cache dev servers
    "persistent": true // Keep running
  }
}
```

### 4. Parallelize Independent Tasks

```bash
# These run in parallel (no dependency)
pnpm lint & pnpm typecheck & pnpm test

# Turbo does this automatically!
pnpm lint
```

---

## Troubleshooting

### Issue: Module not found error

```
Cannot find module '@inningspro/shared-types'
```

**Solution:**

```bash
# Make sure package is in pnpm-workspace.yaml
# Reinstall dependencies
pnpm install

# Verify import path matches package.json name
```

### Issue: Changes not reflected in dependent package

```bash
# Rebuild dependent package
pnpm build --filter=mobile -- --force

# Or restart dev server
pnpm dev
```

### Issue: Lockfile conflicts

```bash
# Remove lock file and reinstall
rm pnpm-lock.yaml
pnpm install
```

### Issue: Out of memory during build

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 pnpm build

# Or build packages individually
pnpm build --filter=shared-types
pnpm build --filter=mobile
```

### Issue: Package version mismatch

```bash
# Check what's installed
pnpm list @inningspro/shared-types

# Update workspace package
pnpm add @inningspro/shared-types@latest --filter=mobile

# Or use specific version
pnpm add @inningspro/shared-types@0.1.0 --filter=mobile
```

---

## Best Practices

### ✅ Do's

- ✅ **Use workspace dependencies** — `workspace:*` for local packages
- ✅ **Keep packages focused** — One responsibility per package
- ✅ **Export public APIs clearly** — Use `src/index.ts` as entry point
- ✅ **Update turbo.json** — When adding new task types
- ✅ **Cache build outputs** — Let Turbo manage incremental builds
- ✅ **Use TypeScript** — Enforce type safety across packages
- ✅ **Document package purpose** — Clear README in each package
- ✅ **Test shared packages thoroughly** — They affect multiple apps

### ❌ Don'ts

- ❌ **Don't bypass exports** — Import from `src/` directly
- ❌ **Don't create circular dependencies** — Package A → B → A
- ❌ **Don't duplicate domain logic** — Use shared packages instead
- ❌ **Don't forget workspace:\* prefix** — Use for local dependencies
- ❌ **Don't commit node_modules** — It's auto-generated
- ❌ **Don't modify pnpm-lock.yaml manually** — Let pnpm manage it
- ❌ **Don't ignore TypeScript errors** — Fix or use // @ts-ignore with reason

---

## Advanced: Remote Caching

### Setup Turborepo Remote Cache

For CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```bash
# Generate auth token
turbo login

# Enable remote caching
turbo build --remote-only
```

This speeds up CI by caching artifacts across runs.

---

## Learning Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/)
- [Turborepo Monorepo Handbook](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

## Quick Reference

| Command                              | Purpose                  |
| ------------------------------------ | ------------------------ |
| `pnpm install`                       | Install all dependencies |
| `pnpm dev`                           | Start all dev servers    |
| `pnpm build`                         | Build all packages       |
| `pnpm test`                          | Test all packages        |
| `pnpm lint`                          | Lint all packages        |
| `pnpm build --filter=mobile`         | Build only mobile        |
| `pnpm add pkg --filter=mobile`       | Add to mobile package    |
| `turbo build --graph`                | View dependency graph    |
| `pnpm list @inningspro/shared-types` | Check installed version  |

---

**Master the monorepo. Build faster. Ship better.** ⚡
