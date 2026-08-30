## Context

The monorepo uses pnpm workspaces with three main packages:
- `packages/relay` - Backend/API server
- `packages/shared-schema` - Shared types and utilities
- `apps/mobile/agent-checkpoint-app` - React Native mobile app using Expo

The mobile app already has `expo lint` configured but lacks standardized formatting. No centralized ESLint, Prettier, or commit validation exists across the monorepo. Developers work independently without enforced code quality standards or commit message conventions.

The backend and shared packages use ES modules (`"type": "module"`). The mobile app uses Expo's setup with TypeScript. All packages need coordinated linting to prevent inconsistent quality and enable easy code review.

## Goals / Non-Goals

**Goals:**
- Enforce consistent code style across backend, shared packages, and mobile app
- Prevent commits with linting errors using Git hooks
- Maintain conventional commit history for automated changelog generation
- Centralize configuration at monorepo root for ease of maintenance
- Allow package-specific rule overrides where needed
- Support both JavaScript and TypeScript (ES Modules and CommonJS)
- Work seamlessly with pnpm workspaces

**Non-Goals:**
- Replace Expo's built-in linting with ESLint (integrate alongside it for mobile)
- Set up automated CI linting checks (focus on pre-commit validation only)
- Add pre-push hooks or other Git hooks beyond pre-commit
- Create type checking (TypeScript compilation is separate)
- Set up automated code formatting/fixing in CI
- Add security scanning (beyond ESLint plugin capabilities)

## Decisions

### 1. Use Lefthook for Pre-commit Hooks
**Decision**: Implement Git hooks using Lefthook (a fast, written-in-Go library for Git hooks that works across all languages and package managers).

**Rationale**:
- Significantly faster than Husky (Go binary vs Node.js startup overhead)
- Minimal setup with simple YAML configuration
- Works across all languages and package managers (not Node-specific)
- Supports skipping hooks with `--no-verify` for emergencies
- Active maintenance and lower resource consumption
- No npm scripts or prepare hooks needed for installation

**Alternatives**:
- **Husky**: Popular but slower due to Node.js startup overhead; requires prepare script
- **Simple shell scripts**: Manual hook scripts in `.git/hooks/` are cumbersome and don't survive `git clone`

### 2. Centralized ESLint Config at Monorepo Root
**Decision**: Create a single `.eslintrc.json` at the monorepo root that all packages inherit from.

**Rationale**:
- Maintains consistency across all packages
- Reduces duplication of configuration
- Easier to update rules across the entire monorepo
- Packages can extend and override as needed

**File structure**:
```
agent-checkpoint/
├── .eslintrc.json (root config)
├── .eslintignore (root ignore patterns)
├── lefthook.yaml (hook configuration)
├── packages/
│   ├── relay/
│   ├── shared-schema/
│   └── pi-extension/
└── apps/
    └── mobile/agent-checkpoint-app/
        └── .eslintrc.json (if package-specific overrides needed)
```

### 3. ESLint Rules Configuration
**Decision**: Use recommended configs from `eslint:recommended` and `@typescript-eslint/recommended` with minimal customization.

**Rationale**:
- Recommended configs provide solid baseline without bikeshedding
- TypeScript rules are essential given the mixed TypeScript/JavaScript codebase
- Can be extended later with project-specific rules (e.g., naming conventions)

**Packages**:
- `eslint` - Core
- `eslint-plugin-import` - Import/require statement validation
- `@typescript-eslint/eslint-plugin` - TypeScript support
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `typescript` - Peer dependency for TypeScript eslint
- `lefthook` - Fast Git hooks manager

### 4. Commitlint with Conventional Commits
**Decision**: Use Commitlint with conventional-changelog-config to enforce Conventional Commits.

**Rationale**:
- Conventional Commits enable automated changelog generation and semantic versioning
- Commitlint is the standard tool for this in JavaScript ecosystem
- Clear, enforceable format improves code review and history navigation
- Works seamlessly with Git hooks via Husky

**Commit format**: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, perf, test, chore, ci, revert
- Scope: optional, brief area of code affected
- Subject: lowercase, no period, 50 chars preferred

**Packages**:
- `commitlint` - Core
- `@commitlint/config-conventional` - Conventional Commits config
- `@commitlint/cli` - CLI for validation

### 5. Lefthook Hook Configuration
**Decision**: Configure Lefthook hooks in `lefthook.yaml` with two hooks:
1. `pre-commit` hook runs ESLint on staged files
2. `commit-msg` hook runs Commitlint

**Rationale**:
- Separates concerns: `pre-commit` validates code, `commit-msg` validates message
- Prevents bad commits at the earliest point (before they're added)
- YAML configuration is cleaner and more maintainable than shell scripts
- Lefthook auto-installs hooks on first run when configured in package.json

**Implementation**:
- Lefthook manages hooks via `lefthook.yaml` configuration file
- Configuration is declarative and version-controlled
- Developers run `lefthook install` once (typically automated via npm script)

### 6. npm Scripts for Local Linting and Hook Installation
**Decision**: Add lint scripts to root `package.json` for running linting locally, plus script for Lefthook initialization.

**Rationale**:
- Developers can lint before committing if they want to catch errors early
- Scripts can be used by CI/CD if integrated later
- Standard npm ecosystem practice
- Lefthook needs to be installed via `lefthook install` command

**Scripts**:
```
"lint": "eslint . --ext .js,.jsx,.ts,.tsx",
"lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
"prepare": "lefthook install" (auto-installs hooks on pnpm install)
```

### 7. Prettier Integration (Optional but Recommended)
**Decision**: Set up Prettier for code formatting alongside ESLint.

**Rationale**:
- ESLint + Prettier is a best practice in modern JavaScript projects
- Prettier handles formatting; ESLint handles logic/quality
- Reduces style debates with opinionated formatting
- Can be configured to skip in pre-commit and run separately

**Note**: This is included in the implementation but not enforced in pre-commit to avoid slowing down the commit process.

## Risks / Trade-offs

### Risk: Slow pre-commit hooks
**Impact**: ESLint on all staged files could be slow in large commits.
**Mitigation**: Lefthook is fast due to Go binary. If needed, use lint-staged in future iteration to only lint changed files. For now, pre-commit linting is acceptable for the current codebase size.

### Risk: Developer friction from strict rules
**Impact**: Developers frustrated by linting failures on edge cases.
**Mitigation**: Start with recommended configs; adjust rules based on team feedback. Provide clear error messages. Allow bypass with `--no-verify` for emergencies.

### Risk: Inconsistency with Expo's linter
**Impact**: Mobile app has both `expo lint` and ESLint, may report different issues.
**Mitigation**: Configure ESLint to work alongside Expo's linter. ESLint provides stricter rules; Expo lint serves as fallback.

### Trade-off: Centralized vs. Package-Specific Config
**Choice**: Centralized with allowance for overrides.
**Benefit**: Simplicity and consistency.
**Cost**: Less flexibility per package (but can be added later).

### Trade-off: Pre-commit vs. Pre-push
**Choice**: Pre-commit hooks only.
**Benefit**: Catch errors immediately; less likely to push broken code.
**Cost**: Slight delay in each commit.

### Risk: Git hooks not installed in CI
**Impact**: CI may not run hooks if environment doesn't call `lefthook install`.
**Mitigation**: Add `lefthook install` to CI setup scripts or rely on separate linting job in CI (hooks are for local development only).
