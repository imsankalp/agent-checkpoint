# Agent Checkpoint

A monorepo containing a dev tool with a backend and mobile app for checkpoint management.

## Project Structure

```
agent-checkpoint/
├── apps/
│   └── mobile/
│       └── agent-checkpoint-app/    # React Native mobile app (Expo)
├── packages/
│   ├── relay/                        # Backend/API server
│   ├── shared-schema/                # Shared types and utilities
│   └── pi-extension/                 # Pi extension
├── pnpm-workspace.yaml               # pnpm monorepo config
├── eslint.config.js                  # ESLint configuration
├── lefthook.yaml                     # Git hooks configuration
└── commitlint.config.js              # Commit message validation
```

## Quick Start

### Prerequisites

- Node.js 20+ (or use nvm: `nvm use`)
- pnpm 8+ ([install here](https://pnpm.io/installation))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd agent-checkpoint
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

   This automatically installs Git hooks via Lefthook during the prepare phase.

3. **Verify setup**:
   ```bash
   pnpm lint --version  # Should show ESLint version
   npx lefthook --version  # Should show Lefthook version
   ```

## Development

### Running the Backend (Relay)

```bash
cd packages/relay
pnpm dev
```

### Running the Mobile App

```bash
cd apps/mobile/agent-checkpoint-app
pnpm start
# or
pnpm ios    # Run on iOS simulator
pnpm android # Run on Android emulator
```

### Code Quality

We enforce code quality standards across the monorepo using ESLint, Prettier, and conventional commits.

**Automatic checks:**
- ESLint runs on pre-commit (staged files only)
- Prettier formatting is validated
- Commit messages must follow Conventional Commits format

**Manual checks:**
```bash
# Run ESLint on all files
pnpm lint

# Automatically fix issues
pnpm lint:fix

# Format all files
pnpm format
```

**Commit message format:**
```
type(scope): subject
```

Examples:
- `feat(api): add user authentication endpoint`
- `fix(mobile): resolve navigation issue`
- `docs: update readme with setup instructions`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

### Git Hooks

Git hooks are automatically installed via Lefthook when you run `pnpm install`. They validate code quality and commit messages before allowing commits.

- **Pre-commit hook**: Runs ESLint on staged files
- **Commit-msg hook**: Validates commit message format

To manually run hooks:
```bash
npx lefthook run pre-commit   # Validate staged files
npx lefthook run commit-msg   # Validate commit message
```

To bypass hooks (emergency only):
```bash
git commit --no-verify
```

## Available Scripts

**Monorepo root:**
```bash
pnpm lint              # Run ESLint on all files
pnpm lint:fix          # Fix auto-fixable ESLint issues
pnpm format            # Format all files with Prettier
pnpm commitlint        # Validate commit messages
```

**Per-workspace:**
```bash
pnpm -F <workspace> <command>  # Run command in specific workspace
```

## Troubleshooting

### Hooks not running?
```bash
npx lefthook install
```

### Module not found errors?
```bash
pnpm install
```

### TypeScript errors?
Ensure you're using TypeScript 5.x (typed-eslint doesn't support TS 7.0 yet):
```bash
pnpm add -D -w typescript@"^5.0.0"
```

## Documentation

- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- **Backend**: See `packages/relay/README.md`
- **Mobile**: See `apps/mobile/agent-checkpoint-app/README.md`

## License

[Add your license here]

## Support

For questions or issues:
1. Check relevant README files
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Open an issue in the repository
