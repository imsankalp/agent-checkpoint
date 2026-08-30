## Why

The monorepo currently lacks standardized code quality tooling and commit message conventions. This leads to inconsistent code style across the backend and mobile app, potential code quality issues, and difficult commit history navigation. Implementing commit lint, pre-commit hooks, and ESLint will enforce consistent code quality standards, catch issues early, and maintain a clean commit history across all packages.

## What Changes

Establish a comprehensive linting and commit validation setup for the pnpm monorepo with:
- **Commitlint**: Enforce conventional commit message format
- **Pre-commit hooks**: Run linting and validation before commits are allowed using Lefthook
- **ESLint**: JavaScript/TypeScript linting with shared configuration across all packages
- **Prettier**: Code formatting (optional but recommended alongside ESLint)

All configurations will be centralized at the monorepo root with package-specific overrides where needed.

## Capabilities

### New Capabilities
- `linting/eslint-config`: Shared ESLint configuration for JavaScript/TypeScript across the monorepo
- `linting/commitlint-config`: Conventional commit message validation using commitlint
- `linting/pre-commit-hooks`: Pre-commit hooks setup using Lefthook to enforce linting before commits

### Modified Capabilities
None - this is pure tooling setup with no requirement changes to existing features.

## Impact

- **Affected code**: All TypeScript/JavaScript files in `packages/` and `apps/`
- **Dependencies**: Will add Lefthook, commitlint, ESLint, typescript, and related dev dependencies
- **Systems**: CI/CD pipeline may integrate these checks; developer workflow will require hooks setup
- **Developers**: Lefthook hooks are auto-installed via npm scripts; commits will be validated automatically
