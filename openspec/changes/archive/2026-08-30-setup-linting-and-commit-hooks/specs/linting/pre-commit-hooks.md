## Purpose

Provides Git pre-commit hooks using Lefthook to automatically run linting and validation checks before code is committed, ensuring code quality standards are met before changes are added to the repository.

## ADDED Requirements

### Requirement: Pre-commit hook installation
The system SHALL install Lefthook hooks that run automatically before each commit attempt.

#### Scenario: Hooks installed after clone
- **WHEN** a developer clones the repository and runs `pnpm install` (which triggers prepare script)
- **THEN** Git pre-commit hooks are set up and ready to run via Lefthook

#### Scenario: Hooks are configured
- **WHEN** Lefthook is installed
- **THEN** the `lefthook.yaml` configuration file defines all hook rules

### Requirement: ESLint runs before commit
The system SHALL automatically run ESLint on staged files before allowing a commit.

#### Scenario: ESLint passes
- **WHEN** a user commits with no linting errors
- **THEN** ESLint completes successfully and the commit is allowed

#### Scenario: ESLint fails blocks commit
- **WHEN** staged files have ESLint violations
- **THEN** ESLint fails and the commit is prevented with error output

### Requirement: Commitlint validates commit message
The system SHALL validate the commit message using commitlint before the commit completes.

#### Scenario: Commit message is valid
- **WHEN** the commit message follows Conventional Commits format
- **THEN** commitlint validates successfully and commit proceeds

#### Scenario: Commit message is invalid blocks commit
- **WHEN** the commit message does not follow format
- **THEN** commitlint rejects it and the commit is prevented

### Requirement: Hook configuration persistence
The system SHALL maintain hook configurations in the repository so they persist across team member checkouts.

#### Scenario: Hooks survive repository clones
- **WHEN** `lefthook.yaml` is committed to the repository
- **THEN** new team members can run `pnpm install` (or `lefthook install`) to activate them

### Requirement: Bypass mechanism for emergencies
The system SHALL allow bypassing hooks with the --no-verify flag when absolutely necessary.

#### Scenario: Emergency commit bypass
- **WHEN** a developer runs `git commit --no-verify`
- **THEN** hooks are skipped and the commit proceeds without validation

### Requirement: Clear error messages on hook failure
The system SHALL provide clear, actionable error messages when hooks fail so developers understand what to fix.

#### Scenario: Linting error feedback
- **WHEN** ESLint fails on commit
- **THEN** the developer sees clear output indicating which files and rules failed
