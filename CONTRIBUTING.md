# Contributing Guide

Welcome to Agent Checkpoint! This guide will help you set up your development environment and follow our code quality and contribution standards.

## Initial Setup

After cloning the repository, run:

```bash
pnpm install
```

This automatically installs Git hooks via Lefthook (configured in the `prepare` script in `package.json`). You're now ready to contribute!

## Code Quality Standards

### ESLint and Prettier

We use **ESLint** for code quality checks and **Prettier** for automatic code formatting across the monorepo.

- **ESLint configuration**: Root `.eslintrc.json` and `eslint.config.js` with shared rules across all packages
- **Prettier configuration**: Root `.prettierrc.json` with consistent formatting rules
- **Runs automatically**: Before each commit via Lefthook pre-commit hook

#### Manual linting

You can manually run linting before committing:

```bash
# Check all files for issues
pnpm lint

# Automatically fix auto-fixable issues
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Git Hooks and Lefthook

We use **Lefthook** to run Git hooks automatically:

- **Pre-commit hook**: Runs ESLint on staged files before allowing a commit
  - If linting fails, the commit is blocked with clear error messages
  - Run manually: `npx lefthook run pre-commit`

- **Commit-msg hook**: Validates commit messages follow Conventional Commits format
  - Triggered automatically when you commit
  - Run manually: `npx lefthook run commit-msg`

## Commit Message Format

All commits must follow the **Conventional Commits** specification:

```
type(scope): subject
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, or other non-code changes
- **ci**: CI/CD configuration changes
- **revert**: Reverting a previous commit

### Examples

```bash
# New feature
git commit -m "feat(auth): add login endpoint"

# Bug fix
git commit -m "fix(relay): resolve connection timeout"

# Documentation
git commit -m "docs: update readme with setup instructions"

# Chore
git commit -m "chore: update dependencies"
```

### Scope (Optional)

The scope is optional and should indicate the area of code affected (e.g., `auth`, `relay`, `mobile`).

### Subject Rules

- Lowercase (don't capitalize the first letter)
- No period at the end
- Imperative mood ("add" not "added" or "adds")
- Keep it concise (50 chars preferred, max 100)

## Pre-commit Validation

Before your commit is finalized:

1. **ESLint** checks staged files for code quality issues
2. **Commitlint** validates your commit message format

If either check fails, the commit is blocked with error messages explaining what needs to be fixed.

### Fixing Linting Errors

If ESLint reports errors:

```bash
# Auto-fix fixable issues
pnpm lint:fix

# Then re-stage and commit
git add .
git commit -m "type(scope): message"
```

### Bypassing Hooks (Emergency Only)

In rare cases, you can bypass hooks with `--no-verify`:

```bash
git commit --no-verify -m "emergency: hotfix message"
```

⚠️ **Use sparingly** - hooks exist to maintain code quality!

## Package-Specific Setup

### Mobile App (apps/mobile/agent-checkpoint-app)

The mobile app uses Expo and has its own linting configuration that extends the root ESLint rules.

```bash
# Install dependencies for mobile app
cd apps/mobile/agent-checkpoint-app
pnpm install

# Run Expo lint (in addition to ESLint)
pnpm lint
```

### Backend Packages

Backend packages in `packages/` follow the root ESLint configuration. Each package can override rules if needed by creating a local `.eslintrc.json` file.

## Troubleshooting

### "Hooks not running"

If Git hooks aren't running:

```bash
# Reinstall hooks
npx lefthook install
```

### "Unexpected token" or module errors in ESLint

Ensure you have the latest dependencies installed:

```bash
pnpm install
```

### Commitlint rejects valid message

Check that your message follows the exact format (lowercase, no period). Examples:

- ✅ `feat(api): add user endpoint`
- ❌ `Feat(api): add user endpoint` (capital F)
- ❌ `feat(api): add user endpoint.` (period at end)

## Pull Request Checklist

Before submitting a PR:

- [ ] Run `pnpm lint` and fix any issues
- [ ] Run `pnpm format` for consistent formatting
- [ ] Commit messages follow Conventional Commits format
- [ ] All tests pass (if applicable)
- [ ] No console.log statements (unless intentional)
- [ ] TypeScript errors resolved

## Questions?

If you have questions about the contribution process or code standards, please:
1. Check this guide first
2. Look at recent commits to see examples
3. Open an issue or ask in discussions

Thank you for contributing! 🙏
