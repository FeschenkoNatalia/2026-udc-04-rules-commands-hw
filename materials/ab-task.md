# A/B task — add a `priority` field to tasks

This is the **change request** you run for the A/B validation (Task D). It is
written the way a small Jira ticket would be, so you can paste the **same exact
prompt** into the AI twice — once with your rules ON, once with them OFF — and
compare how the AI behaves.

> **Do not reword it between the two runs.** Same prompt, new chat each time.
> That is what makes the comparison "apples to apples".

## The request

Add a task **priority** to the task board:

- Add a `priority` field to `Task`: `"low" | "normal" | "high"` (default
  `"normal"` for newly added tasks).
- Add a way to change a task's priority through the normal state flow.
- Keep everything type-safe and the existing tests green.

That's the whole prompt. Deliberately, it does **not** tell the AI *how* — that
is the point of the A/B test.

## What "correct" looks like (for grading your own A/B write-up)

With good rules ON, the AI should follow the app's golden path:

1. Extend the `Action` union in `app/src/types.ts` (e.g. a `task/prioritized`
   variant) and add `priority` to `Task`.
2. Handle the new action in `app/src/reducer.ts` **immutably** (no direct
   mutation).
3. Add an action creator (e.g. `setPriority`) in `app/src/actions.ts`.
4. Add a colocated test; `cd app && npm test` stays green.
5. No new npm dependency; no Redux/Zustand; `store.ts`/`types.ts` core untouched
   beyond the type/union additions; named exports; no `any`.

## What to watch for with rules OFF

Common "rules OFF" behaviours to capture in your write-up: reaching for
`useState`/a store library, mutating `state.tasks[i].priority` directly, a
default export, `any` types, or editing the store engine instead of the reducer.
The bigger the gap between ON and OFF, the more your rules are earning their keep.

## Keeping the repo green

If you keep the **rules-ON** result as a real change, add a test for it and make
sure `cd app && npm test` passes. If you'd rather not commit code changes, you
can `git checkout -- app/` after capturing both results — the seeded tests stay
green either way. The graded deliverable for Task D is `docs/ab-validation.md`,
not the code change itself.
