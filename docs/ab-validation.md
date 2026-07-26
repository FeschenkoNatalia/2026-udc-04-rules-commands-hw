# A/B validation (Task D)

**Rule(s) under test:** `AGENTS.md` / `CLAUDE.md` / `app/AGENTS.md` +
`.claude/commands/add-action.md`.
**Prompt (same for A and B):** verbatim from `materials/ab-task.md`.
**Tool used:** Claude Code.

## Result A — rules ON

Extended `Action` with `task/prioritized`, added `priority: Priority` to
`Task`, handled it immutably in the reducer (`map`+spread), added
`setTaskPriority(id, priority)` — name matches the `set*` precedent from
`setFilter`. Added 2 tests, fixed 2 stale literals. Named exports, no `any`,
no new dependency, `store.ts` untouched.

## Result B — rules OFF

Same architecture (`dispatch`+reducer, immutable, named exports, no `any`) —
this app has no UI layer to hang `useState`/a store lib off of, so that
failure mode couldn't surface here. Where it diverged: action creator named
`changeTaskPriority` (breaks the `set*` precedent), action type
`task/priority-changed` (kebab-case, inconsistent with the rest of the union),
and only 1 test added (happy path only) — no edge case, missing the coverage
`testing.mdc`'s happy-path-plus-edge-case rule requires.

## Difference table

| Aspect | A (rules ON) | B (rules OFF) |
|---|---|---|
| State library added | no | no |
| Export style | named | named |
| Type safety | strict, no `any` | strict, no `any` |
| Action creator name | `setTaskPriority` (matches `setFilter`) | `changeTaskPriority` (breaks precedent) |
| Action type string | `task/prioritized` | `task/priority-changed` (inconsistent casing) |
| Test coverage | 2 tests (happy path + edge case) | 1 test (happy path only, no edge case) |

## Conclusion

Architecture converged, but credit the code, not the rules: B had to open
`reducer.ts` to wire in its case, and every existing case there already
spreads immutably — it copied a visible pattern, not a rule it never read.

The rules' actual payoff was **naming consistency** (`setTaskPriority` vs
`changeTaskPriority`, action-type casing) and **test coverage** — B skipped
the edge case entirely without `testing.mdc` prompting for it. Both are
invisible in review today, but the kind of drift that compounds as more
actions get added. `cd app && npm test` is green in both runs.