# PRD: AI Agent Approval Inbox

**Owner:** [Your name]
**Status:** Draft v1
**Last updated:** August 29, 2026

---

## 1. Problem Statement

AI coding agents (Claude Code, Pi, OpenSpec-driven workflows) routinely stop mid-task to wait for a human checkpoint — approving a spec delta, reviewing a risky diff, confirming a destructive command. If the developer isn't physically at that terminal, the agent sits idle, sometimes for hours. Today's workarounds (leaving a laptop open, avoiding agents for anything sensitive) are all bad. There is no way to review and act on an agent checkpoint from anywhere other than the machine the agent is running on.

## 2. Goal

Let a developer approve, reject, or review an AI agent's pending checkpoint from their phone — via a push notification, without needing to open a laptop — so agent workflows keep moving even when the developer is away from their desk.

## 3. Target User (v1)

Solo developers and small teams running **Pi** with permission gates enabled, who regularly step away from their machine mid-session (meetings, commute, out of the house) and want the agent to keep making progress.

Not in scope for v1: teams, multiple simultaneous agents per user, non-technical users.

## 4. Non-Goals (v1)

- Supporting every AI coding agent on day one (Claude Code, Codex, OpenCode adapters are future scope)
- Multi-user or team accounts
- Rich diff rendering with syntax highlighting
- Offline queueing / conflict handling across multiple devices
- Voice/automation triggers (Shortcuts, Tasker) beyond basic notification actions

---

## 5. System Overview

Three components:

1. **Agent-side adapter** — a Pi extension that intercepts a permission-gate event, sends the pending request to the relay, and blocks until a decision comes back.
2. **Relay (backend service)** — holds state between "agent asked" and "human answered," triggers push notifications, and relays the decision back to the adapter.
3. **Mobile app (React Native)** — receives the push, lets the user view the diff/summary, and approve or reject — either from the notification directly or from within the app.

```
Pi (with extension) --> Relay API --> Push (FCM) --> Phone
                                                        |
Pi (blocked/polling) <-- Relay API <-- Decision --------+
```

---

## 6. Current Scope (v1 — build now)

### 6.1 Agent integration
- Pi extension only. Intercepts permission-gate checkpoints.
- Adapter posts: `{ id, summary, diff, timestamp }` to the relay.
- Adapter blocks (or polls, TBD during implementation) until a decision is returned.

### 6.2 Backend / Relay
- Simple REST API: submit pending request, fetch pending requests, submit decision.
- Hosting: **Railway or Render** (git-push deploy, free/hobby tier sufficient at this scale).
- Database: **Supabase** (Postgres, and its realtime subscriptions can optionally let the app watch for new pending rows directly instead of relying solely on push).
- Auth: a single shared token for v1 — no multi-user auth yet.
- Push delivery: **Firebase Cloud Messaging** (covers both iOS and Android through one API).

### 6.3 Mobile app — both iOS and Android
- Built in React Native; core screens (pending list, diff detail view, approve/reject) are shared.
- Push notification received; tapping opens the diff detail screen.
- **Interactive notification actions** (Approve/Reject buttons directly on the notification) — this is the core "aha" feature and must ship in v1, not be deferred.
- Diff shown as plain monospace text — no syntax highlighting or rich rendering yet.
- Platform-specific native work required on **both** platforms (not shared by RN):
  - iOS: `UNNotificationCategory` config for notification actions.
  - Android: `NotificationChannel` + `NotificationCompat.Action` config for notification actions.
  - Background delivery handling differs (iOS Notification Service Extension considerations vs. Android Doze/battery-optimization handling).
  - Signing/release pipelines are entirely separate (Apple certificates/provisioning vs. Android keystore) — plan for two release processes, not one.

### 6.4 Explicitly deferred out of v1
- App Intents (iOS Shortcuts/Siri) and Android App Actions / Tasker plugin.
- Multi-agent adapters (Claude Code, Codex, OpenCode).
- Multi-user/team support.
- Offline queueing and multi-device conflict resolution.
- Rich diff viewer (syntax highlighting, inline comments).

---

## 7. Future Scope (post-v1)

Roughly in priority order:

1. **Agent-agnostic protocol.** Define a shared request/decision schema so any agent can plug in. Prefer **MCP** as the transport for agents that already support it (expose the relay as an MCP server with a `request_human_approval` tool) — this avoids building a bespoke adapter per agent. Reserve custom adapters (like the Pi extension) for agents whose native hook is richer than a generic MCP tool call.
2. **Additional agent adapters** — Claude Code, Codex, OpenCode, via the protocol above.
3. **Automation layer** — iOS App Intents (Siri/Shortcuts custom actions: `ApproveLatestDiff`, `GetAgentStatus`) and an Android equivalent (App Actions and/or a Tasker plugin using Android's Intent-based plugin contract).
4. **Richer diff viewer** — syntax highlighting, side-by-side view, inline comments.
5. **Multi-user/team support** — shared visibility into teammates' pending approvals, real auth (not shared token).
6. **Offline queueing and conflict handling** — for decisions made across multiple devices or with no signal.

---

## 8. Costs

| Item | Cost | Notes |
|---|---|---|
| Apple Developer Program | $99/year | Required for push entitlement and App Groups — unavoidable even for personal/sideload use, since push is core to the product |
| Google Play Developer | $25 one-time | Can be deferred — Firebase App Distribution lets you test on Android devices without a Play listing |
| Backend hosting (Railway/Render + Supabase) | $0 | Free tiers cover solo/low-traffic use |
| Push delivery (FCM) | $0 | Free at any volume you'd hit as a solo user |
| **Total to start** | **~$99 (iOS only), ~$124 if publishing to Play** | Recurring cost is the $99/year Apple renewal |

---

## 9. Success Criteria (before investing in future scope)

Use it personally for a few weeks and answer honestly: did you actually approve/reject agent checkpoints from your phone instead of waiting until you were back at your desk? If yes — even occasionally — the core loop is validated and future scope (second agent, richer automation) is worth building. If not, the notification/diff-review UX needs fixing before scope is added.

---

## 10. Open Questions

- Should the Pi extension block on a held-open relay connection, or poll? Affects timeout/retry design and whether Fly.io (long-lived process) is a better hosting fit than Railway/Render.
- Where should the shared request/decision schema live once we start the multi-agent protocol work — versioned separately from the relay codebase?