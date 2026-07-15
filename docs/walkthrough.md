# Домашнє завдання — Воркшоп 4

**Тема:** Налаштування правил та команд для Agentic IDE
**Формат:** artifacts-first — ви будуєте rule-set і команди для реального (хай і
маленького) проєкту й доводите A/B-тестом, що вони працюють
**Час:** ~2–2.5 години
**Здача:** Pull Request у starter-repo (CodeRabbit зробить авто-рев'ю)

---

## 0. Налаштування

```bash
# форк + клон
gh repo fork koldovsky/2026-udc-04-rules-commands-hw --clone
cd 2026-udc-04-rules-commands-hw

# робоча гілка
git checkout -b ws04/<github-username>

# «опініонований» sample-проєкт (ціль для правил)
cd app && npm install && npm test && cd ..
```

Що потрібно: **Agentic IDE з підтримкою правил і команд** (Cursor; або Claude
Code / GitHub Copilot з їхніми еквівалентами), Node 22+, GitHub account.

> Правила пишемо в `.cursor/rules/` на **корені репо** з `globs`, що вказують на
> `app/**`. Команди — у `.cursor/commands/`. Усі артефакти кладіть у погоджені
> шляхи, щоб авто-рев'ю їх знайшло.

### Що засіяно в репо

| Шлях | Що це |
|---|---|
| `app/src/types.ts` | `AppState`, `Task`, `Action` (discriminated union), `initialState` — **захищене ядро** |
| `app/src/store.ts` | `createStore` з `dispatch`/`subscribe` — **захищене ядро** (кастомний store, НЕ Redux/Zustand) |
| `app/src/reducer.ts` | Чистий reducer — місце, де застосунок «росте» новими діями |
| `app/src/actions.ts` | Action-creators (`addTask`, `toggleTask`, `removeTask`, `setFilter`) |
| `app/src/selectors.ts` | Read-хелпери (`visibleTasks`, `remainingCount`) |
| `app/src/lib/text.ts` | In-house util lib з **фіксованим API** (`slugify`, `truncate`, `normalizeSpaces`) |
| `app/src/*.test.ts` | Наявні тести — усі зелені (`cd app && npm test`) |
| `app/AGENTS.md` | Навмисно тонкий baseline (ціль Task B — узагальнити) |
| `materials/architecture-brief.md` | Опис задуманої архітектури — **джерело правди** для правил |
| `materials/ab-task.md` | Зміна для A/B-тесту (додати поле `priority`) |
| `docs/templates/` | Скелети: `rule-template.mdc`, `command-template.md`, `ab-validation.md`, `cross-tool-check.md` |

> **Спершу прочитайте `materials/architecture-brief.md`** — він пояснює, як saме
> має працювати застосунок (кастомний store, захищене ядро, фіксований API
> lib/text.ts). Ваші правила мають кодувати саме ці очікування.

---

## Task A — базовий rule-set (≥6 правил) _(~40 хв)_

**Мета:** формалізувати очікування від AI так, щоб вони були конкретні й
перевірювані.

Створіть у `.cursor/rules/*.mdc` **мінімум 6 правил**. Кожне правило —
з секцією **`How to verify`** (як перевірити, що правило спрацювало). Шаблон —
`docs/templates/rule-template.mdc`. Мінімальний набір:

1. `architecture.mdc` — кастомний store; зміни стану **лише** через
   `store.dispatch(action)`; нові дії — через `Action` union у `types.ts` →
   `reducer.ts`; **НЕ** Redux/Zustand/MobX. (`globs: app/**`)
2. `conventions.mdc` — named exports, без `any`/`@ts-ignore`, іммутабельні
   оновлення стану, kebab-case файли. (`globs: app/**/*.ts`)
3. `do-not-touch.mdc` — захищені файли `app/src/store.ts` і `app/src/types.ts`;
   змінювати лише з явного дозволу. (`alwaysApply: true`)
4. `testing.mdc` — colocated `*.test.ts`, vitest, патерн AAA. (`globs: app/**/*.test.ts`)
5. `custom-lib.mdc` — реальний API `app/src/lib/text.ts` (`slugify`, `truncate`,
   `normalizeSpaces`); чого **не існує** (`capitalize`, `camelCase`, …).
   (`globs: app/src/lib/**`)
6. **+1 власне** — напр. module/glob-правило для `selectors.ts` або
   `actions.ts`, або правило про залежності («без нових npm-пакетів без дозволу»).

**Перевірка:** у `.cursor/rules/` ≥6 `.mdc`-файлів; кожен має Context / Rule /
How to verify; правила конкретні (посилаються на реальні файли), а не «пишіть
хороший код».

> Порада: не переписуйте `architecture-brief.md` дослівно у правило. Правило —
> це стислі, actionable інструкції + як їх перевірити. Довгі пояснення «чому» —
> це документація, не правило.

---

## Task B — крос-tool `AGENTS.md` _(~20 хв)_

**Мета:** зробити один файл контексту «спільною мовою» для різних інструментів.

1. Відкрийте `app/AGENTS.md` — він навмисно тонкий і «заточений під один
   інструмент» (заголовок `# Cursor Rules`, розмиті формулювання).
2. Перепишіть його у повноцінний baseline: **Структура** проєкту, **Команди**
   (`npm test`, `npm run typecheck`; lint **не налаштований** — так і напишіть,
   а не вигадуйте команду), **Code style** (3–5 конвенцій), **Architecture**
   (кастомний store, НЕ Redux/Zustand), **Guardrails** (не чіпати
   `store.ts`/`types.ts`, без нових залежностей).
3. **(Бонус)** додайте поруч `CLAUDE.md` — для крос-tool сумісності.

**Перевірка:** `app/AGENTS.md` більше не прив'язаний до одного інструменту
(немає `# Cursor Rules` як заголовка), містить стек, команди, конвенції,
architecture і guardrails.

---

## Task C — власні команди (≥2) _(~20 хв)_

**Мета:** перетворити повторювані промпти на команди — «API до AI».

Створіть **мінімум 2 команди** у `.cursor/commands/*.md` (шаблон —
`docs/templates/command-template.md`), адаптовані під цей проєкт. Ідеї:

- `/add-action` — додати новий варіант `Action` у `types.ts`, обробити в
  `reducer.ts`, додати action-creator у `actions.ts`, додати colocated-тест,
  дотриматись `.cursor/rules/`.
- `/refactor` — рефактор виділеного коду за конвенціями проєкту (без зміни
  поведінки, без правок захищеного ядра).
- `/analyze-error` — прочитати помилку/стек, знайти причину, запропонувати фікс
  без `@ts-ignore`/`any` і без правок захищених файлів.

Кожна команда: `description` у frontmatter, `$ARGUMENTS` для вводу, посилання на
`.cursor/rules/`. Протестуйте хоча б одну на реальній задачі.

**Перевірка:** у `.cursor/commands/` ≥2 `.md`-файли з `description` і
`$ARGUMENTS`; принаймні одну команду ви реально запускали.

---

## Task D — A/B-валідація правил _(~20 хв)_

**Мета:** довести, що правила справді змінюють поведінку AI (єдиний надійний
спосіб — порівняти з правилами і без них).

1. Візьміть промпт із `materials/ab-task.md` (додати поле `priority` + спосіб
   його змінювати). **Не переформульовуйте його між прогонами.**
2. **A (правила ON):** дайте цей промпт у **новому** чаті → збережіть, що зробив
   AI (які файли, чи через `dispatch`+reducer, чи іммутабельно, чи без нових
   залежностей).
3. **B (правила OFF):** перейменуйте `.mdc` → `.mdc.off` (або приберіть убік),
   **той самий** промпт, **новий** чат → збережіть результат.
4. Заповніть `docs/ab-validation.md` (шаблон — `docs/templates/ab-validation.md`):
   промпт, результат A, результат B, таблиця відмінностей, висновок.
5. Якщо лишаєте зміну (варіант A) як реальний коміт — додайте тест і переконайтесь,
   що `cd app && npm test` зелений. Якщо ні — `git checkout -- app/` після
   фіксації обох результатів (наявні тести лишаються зеленими).

**Перевірка:** `docs/ab-validation.md` показує **конкретну** різницю ON vs OFF
(не плейсхолдери); `cd app && npm test` зелений.

> Чому це працює: `ab-task.md` навмисно не каже AI *як* робити. Без правил
> моделі часто тягнуть state-бібліотеку або мутують стан напряму; з правилами —
> розширюють `Action` union + reducer. Різниця = ваші правила в дії.

---

## Task E (bonus) — крос-tool перевірка _(~15 хв)_

**Мета:** перевірити на практиці портативність baseline (місток до WS3).

1. Переконайтесь, що **ті самі** `AGENTS.md` / rules керують поведінкою у
   **другому** інструменті (напр. Cursor + Claude Code або Copilot).
2. Дайте однаковий короткий промпт в обох (напр. «опиши конвенції цього проєкту»
   або «додай новий util за зразком `lib/text.ts`») і подивіться, чи дотримано
   правил без додаткових нагадувань.
3. Заповніть `docs/cross-tool-check.md` (шаблон у `docs/templates/`): інструменти,
   промпт, чи підхопились правила, розбіжності, висновок.

**Перевірка:** `docs/cross-tool-check.md` заповнений для 2 інструментів.
Необов'язкове; відсутність — не помилка.

---

## Definition of Done

- [ ] **Task A:** `.cursor/rules/*.mdc` — ≥6 правил, кожне з «How to verify»
- [ ] **Task B:** `app/AGENTS.md` узагальнений (+ бонус `CLAUDE.md`)
- [ ] **Task C:** `.cursor/commands/*.md` — ≥2 команди з `$ARGUMENTS`
- [ ] **Task D:** `docs/ab-validation.md` — реальна різниця ON vs OFF
- [ ] **Task E (bonus):** `docs/cross-tool-check.md` (опціонально)
- [ ] `cd app && npm test` зелений
- [ ] Жодних реальних секретів/PII у PR

## Здача

```bash
git add -A
git commit -m "WS4: <ім'я> — rules & commands"
git push -u origin ws04/<github-username>
gh pr create --title "WS4: <ім'я>" --fill
```

CodeRabbit автоматично відрев'ює PR за цим чек-лістом. Питання — у чат курсу
(фідбек до 2 тижнів). Сертифікат — за умови виконання всіх домашок курсу.
