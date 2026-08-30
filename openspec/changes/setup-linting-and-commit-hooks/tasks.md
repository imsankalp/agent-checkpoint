## 1. Install Dependencies at Monorepo Root

- [x] 1.1 Install Lefthook for Git hooks: `pnpm add -D lefthook`
- [x] 1.2 Install Commitlint CLI and conventional config: `pnpm add -D @commitlint/cli @commitlint/config-conventional`
- [x] 1.3 Install ESLint and TypeScript support: `pnpm add -D eslint typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser`
- [x] 1.4 Install ESLint plugins (import validation): `pnpm add -D eslint-plugin-import`
- [x] 1.5 Install Prettier for code formatting: `pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier`

## 2. Initialize Lefthook

- [x] 2.1 Initialize Lefthook in the repository: `pnpm lefthook install`
- [x] 2.2 Verify `.lefthook-local/` directory is created

## 3. Create ESLint Configuration

- [x] 3.1 Create `.eslintrc.json` at monorepo root with base configuration:
  - Include `eslint:recommended` as base
  - Add `@typescript-eslint/recommended` for TypeScript
  - Configure parser as `@typescript-eslint/parser`
  - Set up JavaScript files to use default parser
- [x] 3.2 Create `.eslintignore` at root to exclude:
  - `node_modules/`
  - Build directories (dist/, build/, .next/, etc.)
  - Coverage reports
  - Generated files (.expo/, .react-native/, etc.)
- [x] 3.3 Add ESLint rules section to root `.eslintrc.json`:
  - `no-unused-vars`: warn
  - `no-console`: warn
  - `import/no-unresolved`: error
  - Any other foundational rules

## 4. Configure Prettier

- [x] 4.1 Create `.prettierrc.json` at monorepo root with formatting rules:
  - `printWidth`: 100
  - `tabWidth`: 2
  - `useTabs`: false
  - `semi`: true
  - `singleQuote`: true
  - `trailingComma`: 'es5'
- [x] 4.2 Create `.prettierignore` to exclude build files and node_modules

## 5. Set Up Commitlint Configuration

- [x] 5.1 Create `commitlint.config.js` at monorepo root:
  - Extend `@commitlint/config-conventional`
  - Configure allowed types (feat, fix, docs, style, refactor, perf, test, chore, ci, revert)
  - Set subject-case rule to lowercase
- [x] 5.2 Verify commitlint configuration is complete and valid

## 6. Create Lefthook Configuration

- [x] 6.1 Create `lefthook.yaml` at monorepo root with hook definitions:
  - Define `pre-commit` hook that runs ESLint
  - Define `commit-msg` hook that runs Commitlint
  - Configure glob patterns and commands
  - Add skip conditions for CI environments if needed
- [x] 6.2 Example structure:
  ```yaml
  pre-commit:
    commands:
      lint:
        glob: "**/*.{js,jsx,ts,tsx}"
        run: pnpm eslint {staged_files} --max-warnings 0
  commit-msg:
    commands:
      commitlint:
        run: pnpm commitlint --edit $1
  ```
- [x] 6.3 Verify lefthook.yaml is syntactically correct

## 7. Verify Hook Execution

- [x] 7.1 Test the pre-commit hook by committing a file with linting errors
- [x] 7.2 Verify hook output shows lint violations and blocks commit
- [x] 7.3 Test the commit-msg hook with invalid and valid commit messages
- [x] 7.4 Verify commitlint rejects bad messages and allows good ones

## 8. Update Root package.json Scripts

- [x] 8.1 Add lint script: `"lint": "eslint . --ext .js,.jsx,.ts,.tsx"`
- [x] 8.2 Add lint:fix script: `"lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"`
- [x] 8.3 Add commitlint script: `"commitlint": "commitlint"`
- [x] 8.4 Add format script: `"format": "prettier --write ."` (optional, for manual formatting)
- [x] 8.5 Add prepare script: `"prepare": "lefthook install"` (auto-installs hooks on pnpm install)

## 9. Test Full Configuration

- [x] 9.1 Test ESLint configuration:
  - Run `pnpm lint` to check all files
  - Verify it catches TypeScript errors in packages/
  - Verify it catches JavaScript errors in apps/
- [x] 9.2 Test Prettier configuration:
  - Run `pnpm format` (or `prettier --check .`) on a test file
  - Verify formatting rules are applied consistently
- [x] 9.3 Verify Lefthook configuration is properly loaded:
  - Run `pnpm lefthook run pre-commit` manually to test hook
  - Verify it reports correct files and configuration
- [x] 9.4 Test with actual commit:
  - Create a file with linting errors
  - Stage it and attempt to commit
  - Verify Lefthook pre-commit hook blocks commit with clear error
- [x] 9.5 Test commit-msg hook:
  - Attempt a commit with invalid message format (e.g., "added feature")
  - Verify Lefthook blocks commit
  - Commit with valid format (e.g., "feat: add authentication")
  - Verify commit is allowed

## 10. Documentation and Team Setup

- [x] 10.1 Create or update CONTRIBUTING.md with:
  - Explanation of Lefthook (automatic on `pnpm install`)
  - Explanation of commit message format with examples
  - How to bypass hooks if necessary (`git commit --no-verify`)
  - Common linting issues and how to fix them
  - How to manually run Lefthook checks: `pnpm lefthook run pre-commit`
- [x] 10.2 Add setup instructions to README.md or getting started guide
- [x] 10.3 Test the setup with a fresh clone:
  - Clone the repository in a new directory
  - Run `pnpm install` (prepare script should run `lefthook install`)
  - Attempt a bad commit and verify Lefthook hooks work

## 12. Package-Specific Overrides (if needed)

- [x] 12.1 Review mobile app for any Expo-specific linting needs
- [x] 12.2 Create `.eslintrc.json` in `apps/mobile/agent-checkpoint-app/` if overrides are needed:
  - Extend root config with `"extends": "../../.eslintrc.json"`
  - Add React/React Native specific rules if needed
- [x] 12.3 Create `.eslintrc.json` in backend packages if they need specific rules
- [x] 12.4 Test package-specific configs to ensure they extend root properly

## 11. CI/CD Integration (Optional - Future)

- [ ] 11.1 (Future) Add ESLint check to CI pipeline: `pnpm lint --max-warnings 0`
- [ ] 11.2 (Future) In CI environment, skip Lefthook by setting `LEFTHOOK=0` environment variable
- [ ] 11.3 (Future) Consider adding lint-staged for more efficient pre-commit linting of only changed files
