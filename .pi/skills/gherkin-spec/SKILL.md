---
name: gherkin-spec
description: Draft, refine, and validate domain-driven BDD Gherkin scenarios focused on React Native application behavior, single-action discipline, structured data tables, and Markdown context preservation.
---

# Skill: gherkin-spec

## Overview & Scope

Write and edit Gherkin scenarios as executable examples of application behavior. Focus on domain language, observable user outcomes, and business rules while keeping mobile UI mechanics, native bridge calls, and library implementation details inside step definitions.

Use this skill for standalone `.feature` files, inline acceptance criteria, or Gherkin embedded inside Markdown files.

> **Markdown Wrapper Rule**: When Gherkin is embedded inside Markdown code blocks, modify **only** the Gherkin content inside the fences. Preserve all surrounding headings, prose, and triple-backtick fences.

---

## Quick Reference

| Construct                | Use For                                                      | Syntax Note                          |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------- |
| `Feature:`               | High-level capability, screen flow, or epic                  | Requires `:`                         |
| `Rule:`                  | Group scenarios under an explicit business rule              | Requires `:`                         |
| `Scenario:` / `Example:` | Single concrete behavior test                                | Requires `:`                         |
| `Background:`            | Shared preconditions for 2+ scenarios                        | Requires `:`; one per Feature/Rule   |
| `Scenario Outline:`      | Identical behavior with varied input data                    | Requires `Examples:` table           |
| `Given`                  | Known initial state, permissions, or session context         | No `:`                               |
| `When`                   | Single meaningful trigger action                             | No `:`; **Exactly one per scenario** |
| `Then`                   | Observable outcome visible to user or API contract           | No `:`                               |
| `And` / `But`            | Extend previous step type                                    | No `:`                               |
| `"""`                    | Doc String for payload strings or multi-line messages        | Final step argument                  |
| `\|`                     | Data Table for structured records or screen props            | Final step argument                  |
| `@tag`                   | Filtering or test suite targeting (e.g., `@ios`, `@android`) | Place sparingly above target         |

---

## Core Authoring Principles

### 1. Business Language Over Mobile UI Mechanics

- Express scenarios from the mobile user's perspective using ubiquitous domain language.
- Avoid native UI component mechanics (`click TouchableOpacity`, `type into TextInput testID="email-input"`), lower-level state hooks (`set React state`), or native storage keys (`AsyncStorage.getItem`).
- Minimal technical terms (e.g., "Push Notification", "Biometric Prompt") are acceptable when they describe user-facing mobile behaviors.

### 2. Single-Focused Scenarios & Single `When` Rule

- **Default to Single-Focused**: Each scenario tests **one** specific business behavior. Avoid complex end-to-end multi-screen journeys unless explicitly requested.
- **Strict One `When` Action**: Limit each scenario to exactly **one** `When` step. If multiple setup steps are needed, move them into the `Given` context using data tables.

### 3. Data Tables in React Native Context

- **Vertical Data Tables** (Single Screen / Config Object): Use key-value pairs to set up complex initial screen states, user profiles, or app permissions without writing long inline strings.
- **Horizontal Data Tables** (Lists & Feed Data): Use header rows to mock collections that feed into components like `<FlatList>` or local offline stores.

```gherkin
# Vertical Table: Single user profile setup state
Given the user configures their account preferences:
  | Biometric Login    | Enabled |
  | Push Notifications | Active  |
  | Default Currency   | USD     |

# Horizontal Table: Dataset feeding a React Native list
Given the notification feed contains the following items:
  | Id  | Category | Title                | Read  |
  | 101 | Alert    | Payment Declined     | false |
  | 102 | Message  | Welcome to the App!  | true  |
```

### 4. Background and Scenario Outlines

- **Background**: Use liberally when 2+ scenarios share identical initial setup (e.g., user is authenticated, native permissions are granted). Keep under 4 lines.
  Scenario Outlines: Use regular `Scenario:` by default. Reserve `Scenario Outline:` only for cases where the same mobile flow validates against multiple data inputs (e.g., input field validation matrix).

### 5. Formatting & Escaping Rules

- **Indentation**: Use 2-space indentation consistently.

- **Table Escaping**: Escape pipe symbols as `\|`, newlines as `\n`, and backslashes as `\\` inside Data Table cells.

- **Line Comments**: Use `#` strictly for full-line comments.

## React Native Feature Template

```gherkin
Feature: Biometric Authentication Flow
As a mobile app user
I want to sign in using Face ID or Fingerprint
So that I can access my account securely without typing my password

Background:
Given the app is running on a device with hardware biometric support
And the user has a registered account

Scenario: Successful biometric login on app launch
Given the user has configured the following app security settings:
| Biometrics Enabled | True |
| Stored Session | Valid |
| Device Platform | iOS |
When they confirm their identity via the native biometric prompt
Then they are granted access to the main dashboard
And their active session is refreshed

Scenario Outline: Invalid biometric authorization attempts
Given the user attempts biometric authentication with <attempt_type>
When the native biometric verification fails
Then an alert states "<error_message>"
And the user remains on the lock screen

    Examples:
      | attempt_type     | error_message                          |
      | Unrecognized Face | Face not recognized. Try again.        |
      | Cancelled Prompt | Authentication cancelled by user.      |
```

## Anti-Pattern Fixes

| Anti-Pattern                                                                                    | Corrected Mobile Approach                                                       |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Component Directives**: `Given I tap testID="submit-btn"`                                     | `When the user submits the payment form`                                        |
| **Native Storage Verification**: `Then AsyncStorage key "user_token" is not null`               | `Then the user remains signed into their session`                               |
| **Multiple Trigger Actions**: `When I enter email And I enter password And I press login`       | `Given a user with valid credentials setup`<br>`When they log in`               |
| **Platform-Brittle Assertions**: `Then render native iOS alert controller`                      | `Then an authorization prompt is displayed to the user`                         |
| **Long Inline Parameters**: `Given user has name "Sam", age 28, and notification enabled true`  | Use a Vertical Data Table to define user props cleanly.                         |
| **Markdown Destruction**: Omitting Markdown headers/fences when updating inline Gherkin blocks. | Preserve all surrounding Markdown text; update only Gherkin within code fences. |
| **Overuse of Outlines**: Outlines used for a single data row.                                   | Use a standard `Scenario:` unless multiple test cases require varied data.      |

## Clarifying Question Protocol

### Before generating scenarios for vague requirements, ask:

- **Feature Scope**: What specific screen, mobile capability, or business rule are we defining?

- **Actor/Role**: Is this an authenticated user, guest user, or background sync worker?

- **Platform Constraints**: Are there specific iOS vs. Android behaviors or native permissions involved?

- **Preconditions**: Are there common setup states (auth, network, feature flags) shared across scenarios?

(Default to single-focused scenarios automatically without asking journey preference).

## Validation Checklist

- [ ] Gherkin block updated while preserving surrounding Markdown context (if applicable).

- [ ] Language focuses on business intent (no raw `testID` references, component names, or native bridge calls).

- [ ] Scenarios are single-focused and independent.

- [ ] Exactly one `When` step per scenario.

- [ ] Data tables used for complex component props, form inputs, or lists.

- [ ] Background used for common shared preconditions (e.g., auth state).

- [ ] Escaped special table characters (`\|`) and applied 2-space indentation.
