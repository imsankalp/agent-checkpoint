# commitlint-config Specification

## Purpose

Enforces the Conventional Commits message format for all commits in the monorepo to maintain a clean, parseable commit history and enable automated changelog generation.

## Requirements

### Requirement: Commit message format validation
The system SHALL validate that all commit messages follow the Conventional Commits specification (type(scope): subject).

#### Scenario: Valid commit message
- **WHEN** a user commits with message format "feat(auth): add login endpoint"
- **THEN** the commit is accepted

#### Scenario: Invalid commit message format
- **WHEN** a user commits with message "added a new feature" (no type/scope)
- **THEN** commitlint rejects the commit with an error message

### Requirement: Supported commit types
The system SHALL recognize and allow the following commit types: feat, fix, docs, style, refactor, perf, test, chore, ci, and revert.

#### Scenario: Feature type accepted
- **WHEN** a commit message starts with "feat:"
- **THEN** commitlint accepts the message

#### Scenario: Unsupported type rejected
- **WHEN** a commit message starts with "todo:"
- **THEN** commitlint rejects the message

### Requirement: Subject line validation
The system SHALL enforce that commit subjects are lowercase, start immediately after the colon, and do not end with a period.

#### Scenario: Proper subject format
- **WHEN** committing "fix(relay): resolve connection timeout"
- **THEN** the commit is accepted

#### Scenario: Capitalized subject rejected
- **WHEN** committing "fix: Resolve connection timeout"
- **THEN** commitlint rejects the message (capital first letter)

#### Scenario: Period at end rejected
- **WHEN** committing "fix: resolve connection timeout."
- **THEN** commitlint rejects the message (trailing period)

### Requirement: Optional scope in brackets
The system SHALL allow an optional scope in parentheses between type and colon (e.g., "feat(auth):" or "fix:").

#### Scenario: Commit with scope
- **WHEN** committing "feat(mobile): add navigation drawer"
- **THEN** the commit is accepted with scope identified

#### Scenario: Commit without scope
- **WHEN** committing "docs: update readme"
- **THEN** the commit is accepted without scope

### Requirement: Configuration applies to all commits
The system SHALL apply commitlint rules to all commits in the monorepo via pre-commit hooks.

#### Scenario: Commit validation on attempt
- **WHEN** a user attempts to commit
- **THEN** commitlint validates the message before allowing the commit
