# Architecture brief — the task-board app

This is the **source of truth** for the rules you write in Task A. It describes
how the seeded `app/` is *intended* to work, so your rules can encode real,
verifiable expectations (not generic "write good code" fluff).

Read the actual code alongside this brief: `app/src/`.

## Domain

A minimal "task board": a list of `Task { id, title, done }` plus a `filter`
(`"all" | "active" | "done"`). State shape lives in `app/src/types.ts`.

## Architecture — a custom state store (NOT Redux/Zustand)

State is managed by a small **in-house store**, deliberately not a library:

- `app/src/store.ts` — `createStore()` returns `{ getState, dispatch, subscribe }`.
  This is the **only** way state changes. It is NOT Redux, Zustand, MobX, or
  Jotai — do not "modernize" it by swapping in a library.
- `app/src/types.ts` — `AppState`, `Task`, and the `Action` **discriminated
  union** (on `type`). New behavior starts by adding an `Action` variant here.
- `app/src/reducer.ts` — a **pure** reducer `(state, action) => newState`. It
  never mutates state in place; it returns new objects/arrays. This is where you
  handle new actions.
- `app/src/actions.ts` — **action creators** (`addTask`, `toggleTask`,
  `removeTask`, `setFilter`). UI/consumers call these instead of building action
  objects by hand.
- `app/src/selectors.ts` — pure **read helpers** (`visibleTasks`,
  `remainingCount`). Reads go through selectors, not `state.tasks` directly.

**The golden path to extend the app:** add an `Action` variant in `types.ts` →
handle it in `reducer.ts` → add an action creator in `actions.ts` → add a
colocated test. Never mutate state directly; never reach for a state library.

## Protected core (do-not-touch)

`app/src/store.ts` (the dispatch/notify engine) and `app/src/types.ts` (the core
types + `Action` union) are load-bearing. Changing them ripples through the
whole app. Treat them as "do-not-touch without approval" in your rules — normal
feature work extends `reducer.ts`/`actions.ts`, not these.

## In-house library — `app/src/lib/text.ts` (fixed API)

A small custom text lib. Its **entire supported surface** is exactly:

- `slugify(input: string): string`
- `truncate(input: string, maxLength: number, suffix?: string): string`
- `normalizeSpaces(input: string): string`

It is NOT lodash/underscore. Helpers like `capitalize`, `camelCase`, `deburr`
**do not exist** — an agent may hallucinate them. A `custom-lib` rule that
documents this real API is your defence.

## Conventions

- TypeScript strict (`noUncheckedIndexedAccess` is on) — no `any`, no `@ts-ignore`.
- **Named exports only** (no default exports).
- **Immutable** state updates in the reducer (spread/`map`/`filter`, never mutate).
- Tests are **colocated** `*.test.ts` using **vitest**; `cd app && npm test`.
- Files: kebab-case (`text-utils` style); types/interfaces PascalCase.

## Commands available

```bash
cd app
npm test        # vitest run
npm run typecheck   # tsc --noEmit
# lint: NOT configured in this sample (say so in AGENTS.md rather than inventing one)
```
