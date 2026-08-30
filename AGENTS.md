# AGENTS.md

## Execution Rule
- **Graph-First Mandate**: Never run broad file scans (`find`, raw `grep`). Always query the knowledge graph first to fetch minimal context subgraphs.

## Tool Shortcuts & Graph Navigation
- **Graphify Query**: `graphify query "<topic>"` (Locate AST nodes without disk reads)
- **Graphify Path**: `graphify path <NodeA> <NodeB>` (Trace dependency flow)
- **Graphify Explain**: `graphify explain "<Concept>"` (Fetch focused subgraph summaries)
- **OpenSpec Draft**: Create proposed specs in `openspec/changes/<id>-<feature>.md`
- **OpenSpec Archive**: Move validated specs to `openspec/archive/` and update `openspec/specs/`

## Monorepo Boundaries & Path Conventions
- **Mobile App**: `apps/mobile/agent-checkpoint-app/src/features/<feature-name>/`
- **Shared Packages**: `packages/` (Scope modifications strictly to intended workspace targets)
- **Shared UI/Utils**: Global UI primitives in `apps/mobile/agent-checkpoint-app/src/components/ui/`

## Skill Triggers
- **Behavior**: Use `.pi/skills/gherkin-spec/SKILL.md` for Given/When/Then feature scenarios.
- **Architecture**: Use `.pi/skills/c4-diagram.md` (Mermaid) for component/container additions.
## Standard Execution Workflow
1. `graphify query` -> 2. Draft Delta Spec -> 3. Add BDD/C4 Specs -> 4. Pi Execution -> 5. `graphify update .` -> 6. Archive Spec