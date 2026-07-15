# UDC Workshop 4 — Homework (rules & commands)

Starter repo for the fourth homework of the UDC "Modern Development with Agentic
AI" course.

> Workshop 4: **Налаштування правил та команд для Agentic IDE** (Configuring rules & commands for an Agentic IDE)
> Автор: В'ячеслав Колдовський (Programming Mentor)

You build a **rule-set** and a **command-set** for a small, deliberately
opinionated TypeScript app (a task board with a **custom store**, not
Redux/Zustand), generalize a thin `AGENTS.md` into a cross-tool baseline, and
prove with an **A/B test** that your rules actually change how the AI behaves.
~2–2.5 hours.

## Quick start

```bash
gh repo fork koldovsky/2026-udc-04-rules-commands-hw --clone
cd 2026-udc-04-rules-commands-hw
git checkout -b ws04/<github-username>
cd app && npm install && npm test && cd ..
# follow docs/walkthrough.md
gh pr create --title "WS4: <your name>" --fill
```

Full step-by-step instructions: [`docs/walkthrough.md`](docs/walkthrough.md).

## What's in here

| Path | Purpose |
|---|---|
| `docs/walkthrough.md` | Step-by-step: setup, Tasks A–E, Definition of Done |
| `app/` | A tiny TS "task board" with a custom store — the code you write rules for |
| `app/src/store.ts`, `app/src/types.ts` | The **protected core** (do-not-touch target) |
| `app/src/lib/text.ts` | An in-house util lib with a **fixed API** (hallucination-rule target) |
| `app/AGENTS.md` | A deliberately thin, single-tool-flavored baseline (Task B target) |
| `materials/architecture-brief.md` | The intended architecture — source of truth for your rules |
| `materials/ab-task.md` | The change request you run for the A/B test (Task D) |
| `docs/templates/` | Fill-in skeletons for your deliverables |
| `.github/pull_request_template.md` | PR checklist (auto-applied) |
| `.coderabbit.yaml` | CodeRabbit auto-review tuned to this homework's DoD |
| `AGENTS.md` (repo root) | Baseline guidance for your Agentic IDE working in this repo |

You create: `.cursor/rules/*.mdc` (≥6), `.cursor/commands/*.md` (≥2), a
generalized `app/AGENTS.md`, `docs/ab-validation.md`, and (bonus)
`docs/cross-tool-check.md`.

## Tools

An Agentic IDE that supports rules and commands (Cursor, or Claude Code /
Copilot with their equivalents) + a GitHub account + Node 22+. Questions → the
course chat (feedback within 2 weeks).
