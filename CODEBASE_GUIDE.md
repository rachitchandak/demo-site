# CodeA11y — Complete Codebase Guide (for a brand‑new developer)

> **Who this is for:** someone joining the project with **zero prior context**. It explains *what* the project does, *how* it is built, *why* it is built that way, and walks through the **actual code, prompts, and data** so you can trace any feature end‑to‑end.
>
> Everything below is sourced directly from the code in this repository. File references look like [`src/extension.ts`](src/extension.ts) and are clickable.

---

## Table of contents

1. [What is CodeA11y, in plain words](#1-what-is-codea11y-in-plain-words)
2. [The 30‑second mental model](#2-the-30second-mental-model)
3. [The three programs in this repo](#3-the-three-programs-in-this-repo)
4. [Repository map — where everything lives](#4-repository-map--where-everything-lives)
5. [Key vocabulary (read this before the deep dives)](#5-key-vocabulary-read-this-before-the-deep-dives)
6. [The build pipeline — how source becomes a shippable extension](#6-the-build-pipeline--how-source-becomes-a-shippable-extension)
7. [End‑to‑end walkthrough: "Scan my project for accessibility issues"](#7-endtoend-walkthrough-scan-my-project-for-accessibility-issues)
8. [Deep dive A — The VS Code extension (`src/`)](#8-deep-dive-a--the-vs-code-extension-src)
9. [Deep dive B — The binary runtime (`binary/`)](#9-deep-dive-b--the-binary-runtime-binary)
10. [Deep dive C — The proxy server (`server/`)](#10-deep-dive-c--the-proxy-server-server)
11. [The four analysis engines compared](#11-the-four-analysis-engines-compared)
12. [The `.codea11y` event‑sourced store](#12-the-codea11y-eventsourced-store)
13. [Prompts, inputs and outputs — concrete examples](#13-prompts-inputs-and-outputs--concrete-examples)
14. [Architecture decisions and the "why" behind them](#14-architecture-decisions-and-the-why-behind-them)
15. [How to run and develop locally](#15-how-to-run-and-develop-locally)
16. [Where to look when…](#16-where-to-look-when)

---

## 1. What is CodeA11y, in plain words

**CodeA11y is a VS Code extension that checks your website's code for accessibility problems** and helps you fix them.

"Accessibility" (often shortened to **a11y** — "a", then 11 letters, then "y") means making web pages usable by people with disabilities: someone using a screen reader, someone who can only use a keyboard, someone with low vision, etc. The international rulebook for this is called **WCAG** (Web Content Accessibility Guidelines). WCAG is organized into numbered **success criteria** like `1.1.1` (images need text descriptions) or `1.4.3` (text needs enough color contrast).

CodeA11y does four distinct things:

| Feature | What the user sees | What it actually does |
|---|---|---|
| **Audit (report)** | "Found 12 issues in 5 files" | An AI reads your source code and lists WCAG violations |
| **Fix** | Suggested code edits you can review & apply | An AI proposes minimal code changes to fix the found issues |
| **Runtime analysis** | "These guidelines apply to your pages" | Actually *runs* your website in a headless browser to see what's on the page |
| **Runtime testing** | "1.1.1: pass, 1.4.3: fail" | Runs deterministic (non‑AI) checks against the live rendered page |
| **Linting** | Red squiggles as you type | Fast, local, static checks (no AI, no network) |
| **Reports / VPAT** | Dashboards & exportable compliance docs | Turns findings into formal accessibility reports |

The defining design choice: **the AI never sees your API keys, and your code never goes straight to OpenAI.** Everything flows through a company‑run **proxy server** that holds the credentials. More on this in [§3](#3-the-three-programs-in-this-repo) and [§14](#14-architecture-decisions-and-the-why-behind-them).

---

## 2. The 30‑second mental model

```
┌──────────────────────────────────────────────────────────────────────────┐
│  VS Code editor (what the user interacts with)                            │
│                                                                            │
│   ┌─────────────────────────┐         spawns a child process              │
│   │  Extension  (src/)       │ ───────────────────────────────┐           │
│   │  TypeScript → dist/      │                                 │           │
│   │  extension.js            │ ◀── reads stdout line-by-line ──┘           │
│   └─────────────────────────┘                                              │
│              │  the extension is a THIN UI shell                           │
└──────────────┼─────────────────────────────────────────────────────────────┘
               │
               ▼
   ┌──────────────────────────────────┐      HTTPS (Bearer token)
   │  Binary runtime  (binary/)        │ ─────────────────────────────┐
   │  A compiled Node.js executable    │                              │
   │  "wcag-binary-win32-x64.exe"      │                              ▼
   │  Does the HEAVY lifting:          │              ┌───────────────────────────┐
   │   • scans files                   │              │  Proxy server  (server/)   │
   │   • runs your app in Chromium      │              │  • holds Azure/OpenAI keys │
   │   • talks to the AI (via proxy)   │              │  • forwards LLM calls      │
   │   • runs WCAG test rules          │              │  • "guardrails" validate   │
   └──────────────────────────────────┘              │    AI answers              │
                                                      │  • auth, logging, quotas   │
                                                      └───────────────────────────┘
```

**The single most important thing to understand:** the extension and the binary talk to each other through **plain text printed to standard output**. The binary prints lines like:

```
__WCAG_EVENT__{"type":"bundle_completed","bundleId":"src/App.jsx","completed":3,"total":5}
```

…and the extension parses those lines into UI updates. That protocol is defined in [`src/core/runner/BinaryRunner.ts`](src/core/runner/BinaryRunner.ts).

---

## 3. The three programs in this repo

This repository is a **monorepo** — three separate programs living side by side, each with its **own `package.json`** and build:

### 3.1 The extension — [`package.json`](package.json), code in [`src/`](src/)
- **Name:** `wcag-analyzer` (publisher `codea11y`).
- **What it is:** a VS Code extension. The entry point declared in `package.json` is `"main": "./dist/extension.js"`.
- **Language:** TypeScript, bundled by **esbuild** into one file.
- **Job:** draw the UI (a chat panel, report webviews), handle commands, and **spawn the binary**. It does almost no analysis itself (the one exception is the local *linter*).
- **Dependencies of note:** `@playwright/test`, `parse5`, `@vue/compiler-*`, `svelte`, `@angular/compiler` — these are used by the **linter** to parse different front‑end frameworks.

### 3.2 The binary — [`binary/package.json`](binary/package.json), code in [`binary/src/`](binary/src/)
- **Name:** `multi-agent-manager`.
- **What it is:** a standalone Node.js program that gets compiled into a **single executable file (a "Node SEA" — Single Executable Application)** named e.g. `wcag-binary-win32-x64.exe`, shipped inside the extension at `binary/dist/`.
- **Job:** the real engine. It scans code, drives a headless **Chromium** browser (via Playwright), calls the AI, runs WCAG rules, and writes results to disk.
- **Dependencies of note:** `playwright` + `@playwright/browser-chromium` (browser automation), `@babel/*` (parsing/instrumenting source), `openai` (the SDK type shapes), `postcss` (CSS parsing).

### 3.3 The server — [`server/package.json`](server/package.json), code in [`server/src/`](server/src/)
- **Name:** `codea11y-server`.
- **What it is:** an **Express** web server (deployed by the CodeA11y team, not the end user).
- **Job:** authentication, holding the real **Azure OpenAI** credentials, forwarding LLM requests, **guardrails** (a second system that scores whether the AI's accessibility claims are trustworthy), logging, and serving a project dashboard.
- **Dependencies of note:** `express`, `jsonwebtoken` + `bcryptjs` (auth), `pg` + `sql.js` (database — Postgres in prod, in‑memory SQLite otherwise), `openai`, `helmet` (security headers).

> **Why three programs?** See [§14](#14-architecture-decisions-and-the-why-behind-them). Short version: the binary is shipped to users' machines and must never contain secrets; the server keeps secrets; the extension must stay light and responsive.

---

## 4. Repository map — where everything lives

```
codea11y/
├── package.json            # the EXTENSION's manifest + dependencies + VS Code "contributions"
├── esbuild.js              # builds the extension and the lint server into dist/
├── tsconfig.json           # TypeScript compiler settings for the extension
├── vitest.config.ts        # test runner config (unit tests live in tests/)
│
├── src/                    # ── THE EXTENSION (TypeScript) ──
│   ├── extension.ts            # activate()/deactivate() — the literal entry point
│   ├── extension/
│   │   └── activateExtension.ts  # registers every command + the chat view; feature locks
│   ├── config/settings.ts        # reads VS Code settings (server URL, expertise level…)
│   ├── core/
│   │   ├── runner/BinaryRunner.ts        # spawns the binary, parses its stdout events
│   │   └── cache/clearAnalysisCache.ts
│   ├── features/
│   │   ├── chat/                # the chat side-panel (the main UI)
│   │   ├── fixes/               # the "review & apply fix" panel
│   │   ├── reports/             # report webviews, dashboard, VPAT generation
│   │   └── linting/             # the local static linter (no AI) + its IR & rules
│   └── shared/                  # cross-cutting helpers (store, fetch, path safety)
│
├── binary/                 # ── THE BINARY RUNTIME (TypeScript + some .js) ──
│   ├── package.json
│   ├── src/
│   │   ├── index.ts            # the binary's main() — picks a workflow by --mode
│   │   ├── bootstrap/          # CLI parsing, secret resolution, LLM setup
│   │   ├── workflows/          # one file per mode: manager / applicability / testing / prune / intent
│   │   ├── agents/             # ManagerAgent (orchestrator) + WorkerAgent (per-file AI calls)
│   │   ├── applicability/      # runs your app in a browser, finds which WCAG criteria apply
│   │   ├── runtime/            # browser-injected detectors (accordion, dialog, tabs, …)
│   │   ├── sourceMapping/      # Babel instrumentation: tag DOM elements with their source file
│   │   ├── scanning/           # file discovery, CSS analysis, theme extraction
│   │   ├── testing/            # deterministic WCAG rule engine (55 rules: sc-1-1-1.ts …)
│   │   ├── clients/            # LLM client (talks to the proxy) + guardrail client
│   │   └── domain/             # the .codea11y event store, trust/path helpers
│   └── dist/                   # the COMPILED binary (checked in, shipped with extension)
│
├── server/                 # ── THE PROXY SERVER (TypeScript, Express) ──
│   ├── package.json
│   ├── src/
│   │   ├── index.ts            # Express app bootstrap, route mounting, TLS
│   │   ├── routes/             # /api/auth, /api/llm, /api/logs, /api/guardrails, …
│   │   ├── controllers/        # request handlers
│   │   ├── services/llmService.ts   # the ACTUAL Azure OpenAI calls
│   │   ├── guardrails/         # the AI-answer-validation engine (embeddings, scoring)
│   │   ├── middleware/         # auth, security headers, rate limiting, errors
│   │   └── repositories/       # database access
│   └── public/                 # the dashboard web app + login pages
│
├── tests/                  # unit tests (Vitest), mirrors the source layout
├── vpat_templates/         # templates for VPAT/ACR compliance documents
└── resources/              # the extension's icon, etc.
```

---

## 5. Key vocabulary (read this before the deep dives)

| Term | Plain meaning |
|---|---|
| **WCAG** | The accessibility rulebook. |
| **Success Criterion (SC)** | One numbered rule, e.g. `1.1.1`. Each has a **level**: `A` (basic), `AA` (standard target), `AAA` (strict). |
| **a11y** | Shorthand for "accessibility". |
| **Audit / Report mode** | AI reads code and lists problems. |
| **Fix mode** | AI proposes code edits to resolve the problems. |
| **Applicability** | Figuring out *which* WCAG criteria are even relevant to a given page/file (e.g. there's no point checking image‑alt rules on a page with no images). |
| **Runtime analysis** | Actually launching your app in a real browser to inspect the rendered page. |
| **Instrumentation** | Temporarily editing your source so each HTML/JSX element carries a `data-source-loc="file:line:col"` attribute. This is how a button seen in the browser is traced back to the exact source line. |
| **Detector** | A small browser‑side script that recognizes a UI **widget** (accordion, dialog, tabs…) on the page. |
| **AuditUnit** | One file queued for analysis: `{ file, id }`. |
| **Worker** | An AI call that analyzes **one file**. Many run in parallel. |
| **Manager** | The orchestrator that scans the project, builds the queue, and runs the workers. |
| **Guardrails** | A *server‑side* second‑opinion system that scores whether the AI's reasoning actually matches a real WCAG failure (catches hallucinations). |
| **Proxy** | The server that sits between the binary and OpenAI; it holds the secret keys. |
| **The store / `.codea11y`** | A hidden folder in the user's project that records every run as an append‑only event log. |
| **SEA** | "Single Executable Application" — Node's way of packing a whole Node app into one `.exe`. |
| **VPAT / ACR** | Formal compliance documents companies produce to declare their accessibility conformance. |

---

## 6. The build pipeline — how source becomes a shippable extension

There are **three independent builds**. Understanding this removes most confusion about "why are there `dist/` folders everywhere."

### 6.1 Extension build — [`esbuild.js`](esbuild.js)
The extension's `npm run build` runs `check-types` (TypeScript type‑checking) then `bundle` (esbuild). esbuild produces **two** outputs:

```js
// esbuild.js (simplified)
const extensionBuildOptions = {
    entryPoints: ['src/extension.ts'],
    outfile: 'dist/extension.js',
    external: ['vscode'],          // 'vscode' is provided by the editor at runtime
};
const lintServerBuildOptions = {
    entryPoints: ['src/features/linting/server/index.ts'],
    outfile: 'dist/lintServer.js', // the linter runs in its own little server process
};
```

- `dist/extension.js` — the whole extension bundled into one CommonJS file targeting Node 18.
- `dist/lintServer.js` — the **linter** runs as a *separate process* (so a slow parse never freezes the editor). The funky `externalizeUnresolvedVueOptionalRequiresPlugin` exists because Vue's SFC compiler does many optional `require()`s for template engines that may not be installed; the plugin marks those as external so the bundle still builds.

### 6.2 Binary build — [`binary/package.json`](binary/package.json)
`binary/`'s scripts: `prebuild` generates "runtime sources" (the browser‑injected detector code gets turned into embeddable strings — see `binary/scripts/generateRuntimeSources.mjs`), `build` runs `tsc`, and `build:sea` packs it into a single executable using Node's SEA + `postject`. The output lands in `binary/dist/` as platform‑specific files like `wcag-binary-win32-x64.exe`.

The extension's top‑level `vscode:prepublish` step runs `npm run prepare:binary-runtime` (installs the binary's production deps) before building, so the packaged `.vsix` ships with a ready‑to‑run binary.

### 6.3 Server build — [`server/package.json`](server/package.json)
`tsc` + a script that copies the guardrail data assets (`copyGuardrailAssets.cjs`) into `dist/`. The server is deployed separately by the CodeA11y team; end users never build it.

---

## 7. End‑to‑end walkthrough: "Scan my project for accessibility issues"

This is the single best way to understand the system. Follow the numbers.

**① User types "scan my project" in the chat panel.**
The chat webview posts the message to [`WcagChatViewProvider`](src/features/chat/WcagChatViewProvider.ts) → `_handleUserMessage()`.

**② The extension spawns the binary.**
[`BinaryRunner.run()`](src/core/runner/BinaryRunner.ts) builds a command line and launches the executable as a child process:

```ts
// src/core/runner/BinaryRunner.ts (the arg construction, abridged)
const binaryName = `wcag-binary-${process.platform}-${process.arch}${ext}`;
const args = [projectPath];
if (mode) args.push(`--mode=${mode}`);           // e.g. report / fix / report+fix
if (message) args.push(`--message="${message}"`);
if (serverUrl) args.push(`--serverUrl=${serverUrl}`);
// auth token is passed via ENV (WCAG_AUTH_TOKEN), never as a CLI arg
this._process = spawn(binaryPath, args, { cwd, shell: false, env: childEnv });
```

Note two security details: the **auth token goes through an environment variable**, not the command line (command lines are visible to other processes), and sensitive args are **redacted in logs** (`redactArgForLog`).

**③ The binary boots and picks a workflow.**
[`binary/src/index.ts`](binary/src/index.ts) → `main()` parses the CLI ([`bootstrap/cli.ts`](binary/src/bootstrap/cli.ts)), recovers any source files a crashed previous run left instrumented (`BackupManager.recoverPending`), configures the LLM client, then classifies the user's intent.

**④ Intent classification (an AI call).**
[`intentWorkflow.ts`](binary/src/workflows/intentWorkflow.ts) calls [`IntentClassifier`](binary/src/intents/intentClassifier.ts). It sends the user's message + a tree of project files to the AI and gets back JSON like `{ "mode": "report", "targetScope": "project", "files": [] }`. If the intent is just chat ("what is WCAG?"), it answers conversationally and stops. Otherwise it returns a `mode` and a file scope.

**⑤ The Manager workflow runs.**
[`managerWorkflow.ts`](binary/src/workflows/managerWorkflow.ts) drives the rest:

1. `ManagerAgent.analyzeProject()` scans the directory, extracts a **theme context** (your CSS colors/variables), and builds a **file queue** of `AuditUnit`s. It caches the queue in `.codea11y`.
2. For report modes it runs **applicability** (`runRuntimeApplicability`) — this *launches your app in Chromium*. (Details in [§9.3](#93-applicability--running-your-app-in-a-real-browser).)
3. It then keeps only files that actually have applicable WCAG criteria (so you don't pay to audit a file with nothing accessibility‑relevant). Stylesheets are always kept.
4. `ManagerAgent.auditFiles()` runs the worker pool.

**⑥ Workers analyze files in parallel.**
Inside [`ManagerAgent.processFilesInMode()`](binary/src/agents/ManagerAgent.ts), a pool of [`WorkerAgent`](binary/src/agents/WorkerAgent.ts) instances each take one file, build a prompt, and call the AI. Concurrency **adapts**: it speeds up on a streak of successes and backs off on rate‑limit/timeout errors. Unchanged files are served from a **result cache** (no AI call, no cost).

**⑦ Each AI call goes through the proxy.**
[`WorkerAgent.requestChunkCompletion()`](binary/src/agents/WorkerAgent.ts) calls `chatCompletion()` in [`clients/llm/index.ts`](binary/src/clients/llm/index.ts), which POSTs to `‹serverUrl›/api/llm/chat` with the Bearer token. The server ([`llmService.ts`](server/src/services/llmService.ts)) makes the real Azure OpenAI call and returns the answer.

**⑧ Results are validated, persisted, and streamed back.**
Each found issue is passed through **guardrails** (`enrichIssuesWithGuardrail`) for a trust score, recorded into the `.codea11y` event store, and a progress event is printed to stdout:

```
__WCAG_EVENT__{"type":"bundle_completed","bundleId":"src/Header.jsx","completed":2,"total":5,"totalIssues":7}
```

**⑨ The extension updates the UI.**
[`BinaryRunner`](src/core/runner/BinaryRunner.ts)'s stdout handler parses each `__WCAG_EVENT__` line via `parseWcagEvent()` and fires the `onEvent` callback, which the chat provider turns into progress bars, issue counts, and a clickable report.

That's the whole loop. Every other feature is a variation on it.

---

## 8. Deep dive A — The VS Code extension (`src/`)

### 8.1 Entry point and lifecycle
[`src/extension.ts`](src/extension.ts) is tiny — VS Code calls `activate(context)` when the extension loads, and it delegates to `activateExtension`. `deactivate()` disposes everything.

```ts
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    void activateExtension(context);
}
```

### 8.2 What activation actually wires up — [`activateExtension.ts`](src/extension/activateExtension.ts)
This ~540‑line file is the extension's "main." It:

- **Trusts a custom CA bundle** (for corporate TLS‑inspection proxies) before any network call: `ensureServerCaTrust()`.
- **Exposes the tool version** to the binary via `process.env.WCAG_TOOL_VERSION` (recorded on each run as conformance evidence).
- **Migrates legacy `.codea11y` files** into the event store (`seedFromLegacyIfNeeded`).
- **Enforces "feature locks":** guardrails and linting are **off by default and password‑protected**. There is an admin‑password gate (`ADMIN_PASSWORD_SHA256` hash compared with `crypto.timingSafeEqual`). If someone flips those settings on, a password prompt appears; a wrong answer silently flips them back off. This is the `restoreBooleanSetting` / `enforceProtectedFeatureLocksOnStartup` machinery.
- **Registers the chat view** (`wcag-analyzer.chat`) with `retainContextWhenHidden: true` so the chat survives being hidden.
- **Registers every command** declared in `package.json`. The full list:

| Command | Does |
|---|---|
| `runRuntimeAnalysis` | Launch app in browser, compute applicability |
| `runAccessibilityTests` | Run the deterministic WCAG rule engine |
| `openReport` / `openReportsDashboard` | Open report webviews |
| `generateVpat` | Generate a VPAT/ACR draft document |
| `syncProjectDashboard` | Push a snapshot to the server dashboard |
| `pruneStore` | Compact the `.codea11y` event log |
| `lintFile` / `lintWorkspace` / `clearLintDiagnostics` | The static linter |
| `clearAnalysisCache` | Drop cached audit/fix results |
| `restartLintAnalysisServer` | Restart the lint subprocess |
| `openSettings` | Jump to the extension settings |

- **Registers a URI handler** for `…/auth-callback` — this is how login works: the user signs in on a web page, which redirects to a `vscode://` URL carrying a `token`. The handler validates a CSRF‑style `state` value and stores the token.

### 8.3 The chat panel — [`features/chat/`](src/features/chat/)
This is the primary UI, and it's split into many small files (a deliberate choice — see the file list in [§4](#4-repository-map--where-everything-lives)). The class [`WcagChatViewProvider`](src/features/chat/WcagChatViewProvider.ts) (a `vscode.WebviewViewProvider`) owns:

- A **message store** (`chatMessageStore.ts`) — the chat transcript.
- A **`BinaryRunner`** — to spawn analyses.
- **Auth state** (`chatAuth.ts`, `chatAuthCommands.ts`).
- **Slash commands** (`_handleSlashCommand`), e.g. fixes.
- Public entry points the commands call: `startRuntimeAnalysis()`, `startTesting(selection)`, `handleAuthCallback()`, `addSystemMessage()`.
- **Binary event handling** (`chatBinaryEvents.ts`) — turns `WcagEvent`s into chat UI.

The webview HTML/JS is generated in `chatWebviewHtml.ts`; messages cross the boundary via `webview.postMessage` / `onDidReceiveMessage` (wired in `resolveWebviewView`).

### 8.4 The fix‑review panel — [`features/fixes/`](src/features/fixes/)
When the binary proposes edits, [`WcagFixReviewPanel`](src/features/fixes/WcagFixReviewPanel.ts) shows them as reviewable diffs. `fixApplyEngine.ts` actually writes accepted edits to disk; `fixGuardrails.ts` shows the trust info; `fixReviewCache.ts` remembers decisions.

### 8.5 The reports & VPAT layer — [`features/reports/`](src/features/reports/)
Multiple webview panels: a single report (`WcagReportPanel`), a multi‑run dashboard (`WcagReportsPanel`), the test‑results view (`WcagTestReportPanel`), and the VPAT generator (`WcagVpatPanel` + `vpatModel.ts` + `vpatDocx.ts`, which builds a Word document via `exceljs`/docx helpers). `wcagCriteria.ts` is the canonical list of WCAG criteria (id, name, level) used to build test configs — see `buildTestConfig()` in `activateExtension.ts`.

### 8.6 The local linter — [`features/linting/`](src/features/linting/)
This is the **one analysis feature that runs entirely inside the extension** (no binary, no AI, no network). It's a from‑scratch accessibility linter:

- **Adapters** (`adapters/`) parse each framework into a common shape: `htmlAdapter` (parse5), `jsxAdapter` (Babel), `vueAdapter`, `svelteAdapter`, `angularAdapter`.
- An **Intermediate Representation (IR)** (`core/ir/`) — a normalized tree of elements with roles, names, and semantics, independent of framework.
- **Rules** (`core/rules/`) — grouped by theme (`aria`, `forms`, `keyboard`, `landmarks`, `tables`, `textAlternatives`, …). [`core/rules/index.ts`](src/features/linting/core/rules/index.ts) registers them all and `executeRules()` walks the IR firing each rule.
- **Dictionaries** (`core/dictionaries/`) — ARIA role/attribute tables, implicit roles, focusability rules, language tags.
- It runs in a **separate process** (`server/index.ts` → built to `dist/lintServer.js`) and surfaces results as VS Code **diagnostics** (the squiggles) with **hover** explanations and **code actions** (quick fixes). Triggering is debounced (`triggerPolicy.ts`, `analysisScheduling.ts`).

> Linting is **disabled by default** (`enableLinting: false`) and behind the admin‑password lock, per `package.json` (`"Disabled by default during merge rollout"`).

---

## 9. Deep dive B — The binary runtime (`binary/`)

The binary is where 80% of the interesting logic lives.

### 9.1 The entry point and modes — [`binary/src/index.ts`](binary/src/index.ts)
`main()` parses `--mode` and branches. The modes (from [`cli.ts`](binary/src/bootstrap/cli.ts) `VALID_MODES`):

| Mode | Workflow file | Needs AI? | Needs browser? |
|---|---|---|---|
| `report` | `managerWorkflow.ts` | ✅ | ✅ (applicability) |
| `fix` | `managerWorkflow.ts` | ✅ | ❌ |
| `report+fix` | `managerWorkflow.ts` | ✅ | ✅ |
| `applicability` | `applicabilityWorkflow.ts` | ❌ | ✅ |
| `test` | `testingWorkflow.ts` | ❌ | ✅ |
| `prune` | `pruneWorkflow.ts` | ❌ | ❌ |

Notice the **branching order** in `main()`: `prune`, `applicability`, and `test` are handled *before* secrets are resolved, because they never call the AI. Only the AI‑driven modes resolve secrets and configure the LLM. This is a security‑minded structure — code paths that don't need credentials never touch them.

### 9.2 The two agents — Manager and Worker

**ManagerAgent** ([`agents/ManagerAgent.ts`](binary/src/agents/ManagerAgent.ts)) — the orchestrator:
- `analyzeProject()` → scan files, build `AuditUnit[]`, cache the queue + theme context.
- `auditFiles()` / `fixFiles()` → `processFilesInMode()` runs the worker pool.
- **Adaptive concurrency:** `getAdaptiveConcurrencyLimit()` caps parallelism; `maybeIncreaseConcurrency()` ramps up after a success streak; `noteBackendPressure()` backs off on `429/timeout/503/ECONNRESET` (detected by `isConcurrencyPressureError`).
- **Result cache (Feature 5):** before queuing a file it hashes the content; if the hash matches a cached result, it replays the cached issues/edits instantly with `cached: true` (so the extension doesn't charge budget).
- **Persistence:** results go into the event store (`recordDetectedIssues`, `recordProposedFixes`, `recordRunReport`, `finishRun`, `rebuildState`).
- **Runtime locations & screenshots:** after the audit, it joins each issue back to the applicability context to attach a page URL + element locator (`attachRuntimeLocations`) and captures screenshots **only for components that actually failed** (`attachFailedArtifactScreenshots`) — large sites only pay capture cost for real findings.

**WorkerAgent** ([`agents/WorkerAgent.ts`](binary/src/agents/WorkerAgent.ts)) — one file at a time:
- Reads the file (with path‑safety via `resolvePathWithinRoot` so a malicious queue entry can't escape the project root).
- Analyzes **CSS usage** for the file against the theme context (so the AI can reason about real color contrast).
- **Chunks** large files (`MAX_CHUNK_BYTES = 45000`) so each request fits the token budget, converting chunk‑relative line numbers to absolute.
- Builds the prompt (system + user) and calls the AI with **`response_format: json_object`**, **`reasoning_effort: 'low'`**, and a generous `max_tokens`.
- **The reasoning‑token trap (and the fix):** the worker uses a *reasoning* model where `max_completion_tokens` is a *combined* budget for hidden reasoning + visible answer. If the model spends the whole budget thinking, it returns empty content and a file is silently dropped. `isTruncatedEmptyResponse()` detects this (`finish_reason === 'length'` or `completion_tokens >= budget`) and `requestChunkCompletion()` **retries once with a bigger budget** (24000 → 32000). See the comment block in [`worker/constants.ts`](binary/src/agents/worker/constants.ts).
- **Parses + validates** the JSON (`parseIssues` / `parseEdits`): drops malformed entries, validates `level ∈ {A,AA,AAA}` and `severity ∈ {critical,major,minor}`, and **re‑anchors line numbers** to the real file content (`adjustIssueLineNumbers` / `adjustEditLineNumbers`) because models are unreliable about exact lines.
- **Suppression:** issues falling inside already‑decided line ranges (already fixed or explicitly ignored, scoped per‑criterion) are filtered out (`filterIssuesAgainstKnownRanges`).

### 9.3 Applicability — running your app in a real browser
This is the cleverest subsystem. Goal: instead of guessing, **actually render the site** and discover which WCAG criteria genuinely apply to which source files.

Driven by [`applicability/index.ts`](binary/src/applicability/index.ts) → `runRuntimeApplicability()`:

1. **Resolve the project** ([`runtime/projectConfig.js`](binary/src/runtime/projectConfig.js)) — detect the framework and a dev‑server start command/port. It knows default ports for React (3000), Vite (5173), Angular (4200), Next/Nuxt (3000), etc.
2. **Instrument the source** ([`sourceMapping/instrumenter.js`](binary/src/sourceMapping/instrumenter.js)) — using **Babel**, it rewrites JSX/HTML/Vue/Svelte elements to add a `data-source-loc="path:line:col"` attribute. Writes are **atomic** (temp file + rename) and **backed up** so a crash can't corrupt source. This attribute is the bridge from "a `<button>` in the browser" to "line 42 of `Header.jsx`."
3. **Start an instrumented session** (`session/instrumentedSession.ts`) — boot the dev server and a **Playwright Chromium** instance.
4. **Crawl + analyze** (`crawl/pageAnalyzer.ts`) — visit same‑origin pages (capped by `WCAG_CRAWL_MAX_PAGES`), and on each page inject the **detectors** ([`runtime/detectorRegistry.js`](binary/src/runtime/detectorRegistry.js)) that recognize widgets: accordion, breadcrumb, carousel, dialog, feed, grid, menu‑bar, progress‑bar, slider, tabs, tooltip, tree‑view. It also runs a **contrast analyzer** in‑page.
5. **Map artifacts → files → criteria** ([`applicability/mapper.ts`](binary/src/applicability/mapper.ts)) — each detected widget/component is matched against an **issue catalog** (`data/wcagApplicabilityCatalog.js`). A catalog entry lists `static_applicable` criteria (always relevant for that widget type) and `conditional_applicable` criteria with **regex rules** that test the element's attributes/text. The `data-source-loc` attribute resolves each artifact to a source file. The output is a `RuntimeApplicabilityContext` (a per‑file map of applicable checks).
6. **Restore the source** — instrumentation is reverted; `BackupManager.recoverPending` is a safety net that repairs any file left instrumented by a crash on the next run.
7. **Cache** the whole context keyed by a hash of (source dir + URL + crawl settings), so repeat runs skip the browser entirely.

The result feeds two things: (a) the audit only spends budget on files with applicable criteria, and (b) the audit prompt tells the AI *exactly which criteria to check* for each file.

### 9.4 The deterministic testing engine — [`testing/`](binary/src/testing/)
This is the **non‑AI** WCAG checker. After applicability has run, `testingWorkflow.ts` re‑launches the app and runs **55 hand‑written rule files** (`testing/rules/sc-1-1-1.ts` … `sc-4-1-3.ts`) against the *live* DOM via Playwright locators.

Each rule is a `WcagRule` with a `run({ locator })` that inspects the real element and returns `pass` / `fail` / `needs-review` / `not-testable`. Example logic from [`sc-1-1-1.ts`](binary/src/testing/rules/sc-1-1-1.ts) (image text alternatives): it evaluates the element in the browser to determine if it's decorative, computes the accessible name, and **fails** if an image has no name, a filename‑like name (`logo.png`), an auto‑generated camera name (`IMG_1234`), a generic placeholder (`"image"`, `"click here"`), or only icon‑font glyphs. The registry ([`testing/rules/registry.ts`](binary/src/testing/rules/registry.ts)) imports all 55 and exposes `implementedScIds()`.

> **Audit vs Test:** the *audit* asks an AI to read your **source code**; the *test* runs deterministic JS against your **rendered page**. They are complementary — see [§11](#11-the-four-analysis-engines-compared).

### 9.5 The LLM client — [`clients/llm/`](binary/src/clients/llm/)
Every AI request is **proxied**. `chatCompletion()` in [`index.ts`](binary/src/clients/llm/index.ts) POSTs to `/api/llm/chat`. Notable behaviors:
- It auto‑shrinks `max_tokens` if the server says the model supports fewer (`extractSupportedMaxCompletionTokens`).
- `checkServerConnectivity()` pings `/api/health` and maps `401/403/404`/timeout/DNS errors to friendly messages.
- There's a streaming path for assistant chat (`assistantChatStream`), retries/circuit‑breaker logic (`breaker.ts`), and request state (`state.ts`). Auth + serverUrl + sessionId live in a `ProxyConfig`.

### 9.6 Source‑mapping & self‑healing — [`sourceMapping/`](binary/src/sourceMapping/)
- `instrumenter.js` — the Babel transform described above.
- `backupManager.js` — backs up files before instrumentation; `recoverPending()` restores any that were left modified.
- `fileTypes.js` — which files get instrumented and which are ignored.

The extension side mirrors this safety: when a run is **stopped**, [`BinaryRunner.stop()`](src/core/runner/BinaryRunner.ts) gracefully signals the binary (`SIGTERM`/`taskkill`), waits `GRACEFUL_STOP_TIMEOUT_MS = 4000`, then force‑kills, and on Windows (where signal handlers don't run) calls `recoverInstrumentedSource()` itself.

---

## 10. Deep dive C — The proxy server (`server/`)

### 10.1 Bootstrap — [`server/src/index.ts`](server/src/index.ts)
An Express app. On start it: validates prod config, optionally initializes a **database** (Postgres in prod, in‑memory SQLite otherwise — `DATABASE_ENABLED` / `CODEA11Y_NO_DB_MODE`), initializes the **guardrail runtime** (loads WCAG data + builds embedding vector stores), applies security middleware (`helmet`, CORS, rate limiting), and mounts routes. It supports HTTPS directly if `SSL_KEY_PATH`/`SSL_CERT_PATH` are set (pinning `minVersion: TLSv1.2`).

### 10.2 Routes — [`server/src/routes/`](server/src/routes/)
| Route | Purpose |
|---|---|
| `/api/auth` (or `noDbAuth`) | Login, token issue. |
| `/api/llm` | **The proxy endpoints** the binary calls (`/chat`, assistants, threads). |
| `/api/logs` | Session logging + `…/sessions/:id/end`. |
| `/api/guardrails` | Score an AI claim against WCAG. |
| `/api/admin`, `/api/user` | Dashboard/account management. |
| `/api/health` | Liveness + guardrail/runtime status. |

### 10.3 The real OpenAI call — [`server/src/services/llmService.ts`](server/src/services/llmService.ts)
This is the only place a real model is invoked. `chatCompletion()` picks a deployment based on `agentType` (`worker` uses `workerDeploymentName`, others use `deploymentName`), calls Azure OpenAI's `chat.completions.create`, and **logs every call** (`logApiCall`) with token usage — but `buildChatRequestLog()` **strips out `system`/`developer`/`tool` messages** before logging, so prompt internals aren't persisted. It also implements the Assistants API (threads, runs, streaming) for conversational chat.

### 10.4 Guardrails — [`server/src/guardrails/`](server/src/guardrails/)
A standalone system that answers: *"Does this AI's reasoning actually describe a real WCAG `X.Y.Z` failure, or did it hallucinate?"* The runtime ([`guardrails/runtime.ts`](server/src/guardrails/runtime.ts)) loads `wcag22-guardrail-data.json` and precomputes embedding vector stores. [`evaluator.ts`](server/src/guardrails/core/guardrails/evaluator.ts) runs a **multi‑layer pipeline** for a given `(criterion, reasoning)`:

1. **TF‑IDF / embedding similarity** to known failure conditions (with synonym expansion).
2. **Keyword/phrase matching**.
3. **Sufficient‑technique alignment**.
4. **Negation detection** (scope‑aware — "this is *not* a violation" shouldn't score as a violation).
5. **Concept coverage**.
6. **Specificity** (vague reasoning scores lower).
   Plus: **fabricated failure‑ID validation** (did the AI cite a WCAG technique ID that doesn't exist?), **misattribution detection** (does the reasoning fit a *different* criterion better?), and **coherence**.

It produces a `composite_score`, a `confidence`, and an **action**: `accept` / `flag` / `reject`. On the binary side, `enrichIssuesWithGuardrail()` attaches this metadata to each issue so the UI can show "verified" vs "flagged" findings. (Guardrail display in the extension is the password‑locked feature from [§8.2](#82-what-activation-actually-wires-up--activateextensionts).)

---

## 11. The four analysis engines compared

CodeA11y deliberately attacks accessibility from four angles. Knowing which is which prevents a lot of confusion:

| Engine | Where it runs | AI? | Input | Output | Strength |
|---|---|---|---|---|---|
| **Linter** | Extension (local subprocess) | ❌ | Source file being edited | Squiggles + quick fixes | Instant, offline, as‑you‑type |
| **Audit (report)** | Binary → proxy → AI | ✅ | Source code + CSS + applicability | List of issues w/ descriptions | Understands intent, explains *why* |
| **Applicability** | Binary → Chromium | ❌ | Your *running* app | Which criteria apply to which file | Grounds the audit in reality |
| **Testing** | Binary → Chromium | ❌ | Your *running* app | pass/fail per criterion per element | Deterministic, reproducible evidence |

The **audit** is the smart‑but‑fuzzy one; the **testing** engine is the dumb‑but‑certain one; **applicability** is the bridge that tells both where to look; the **linter** is the fast first line of defense.

---

## 12. The `.codea11y` event‑sourced store

Every run writes to a hidden `.codea11y/` folder in the user's project. It is **event‑sourced**: instead of overwriting a "current results" file, it **appends immutable events** and rebuilds derived state from them. Implemented in [`binary/src/domain/codea11yStore/`](binary/src/domain/codea11yStore/) and mirrored (no shared code) in [`src/shared/codea11yStore/`](src/shared/codea11yStore/).

- `startRun()` opens an immutable run with a `runId`, `mode`, and `toolVersion`.
- `recordDetectedIssues()` emits one `issue_detected` event per finding **and** writes a per‑run `issues.json` snapshot.
- `recordProposedFixes()` emits `fix_proposed` events + a `fixes.json` snapshot.
- `finishRun()` + `rebuildState()` fold the event log into the derived state consumers read.
- When the user keeps/applies/ignores a fix in the extension, **the extension appends its own decision events** — so the audit trail spans both programs.
- `pruneStore` / `compactEvents` / `pruneRuns` keep the log from growing unbounded.

**Why event‑sourcing?** It gives a complete, tamper‑evident **audit trail** ("which tool version found which issue in which run, and who decided what") — exactly what you need for formal accessibility conformance evidence (VPATs). Two independent implementations exist because the binary and the extension must not share a code bundle.

---

## 13. Prompts, inputs and outputs — concrete examples

### 13.1 Intent classification
**System prompt** (from [`intentClassifier.ts`](binary/src/intents/intentClassifier.ts)):
> *"You are an intent classifier for a WCAG tool. Classify the user's message into one of: 'report', 'fix', 'report+fix', 'chat'. … Output valid JSON only."*

**Input** (user message + a file tree). **Output:**
```json
{ "mode": "report", "targetScope": "files", "files": ["src/components/footer.jsx"] }
```

### 13.2 Audit (the worker)
**System prompt** (from [`agents/worker/prompts.ts`](binary/src/agents/worker/prompts.ts), `AUDIT_SYSTEM_PROMPT_BASE`) — abridged:
> *"You are an expert WCAG accessibility auditor. … You MUST respond with ONLY a valid JSON object … Report ONLY failures. When a RUNTIME APPLICABILITY block is present, audit ONLY the criteria it lists for this file …"*

It is suffixed with a **communication‑style block** chosen by the user's `expertiseLevel` (`beginner` / `intermediate` / `expert`).

**User message** (built in `buildChunkUserMessage`) contains: a RUNTIME APPLICABILITY block (which criteria to check), the file chunk with a `CHUNK_START_LINE` header, and any detected CSS classes/variables/resolved styles.

**Output** the worker parses:
```json
{
  "issues": [
    {
      "file": "src/components/Logo.jsx",
      "line": 42,
      "endLine": 47,
      "lineContent": "<img src='logo.png' />",
      "criterion": "1.1.1",
      "level": "A",
      "description": "Image missing alt attribute",
      "recommendation": "Add an alt attribute describing the image content",
      "severity": "critical"
    }
  ]
}
```

### 13.3 Fix (targeted)
**System prompt** (`TARGETED_FIX_SYSTEM_PROMPT_BASE`): *"…generate minimal, targeted edits to fix ONLY the reported issues. Do NOT rewrite the entire file…"*

**Output:**
```json
{
  "edits": [
    {
      "file": "src/components/Logo.jsx",
      "line": 42,
      "oldContent": "<img src='logo.png' />",
      "newContent": "<img src='logo.png' alt='Company logo' />",
      "wcagGuideline": "1.1.1",
      "description": "Added missing alt attribute"
    }
  ]
}
```
`oldContent` must match the file **exactly** so `fixApplyEngine` can find‑and‑replace it.

### 13.4 A binary→extension event (the stdout protocol)
```
__WCAG_EVENT__{"type":"file_edit","edit":{"file":"src/Logo.jsx","line":42,"oldContent":"...","newContent":"...","wcagGuideline":"1.1.1","description":"Added alt"}}
```
Parsed by `parseWcagEvent()` in [`BinaryRunner.ts`](src/core/runner/BinaryRunner.ts); the allowed `type` values are the union at the top of that file.

### 13.5 A guardrail evaluation (server)
**Input:** `evaluate("1.4.3", "The body text is light gray (#aaa) on white, contrast ~2.3:1, below the 4.5:1 minimum")`.
**Output:** an `EvaluationResult` with `composite_score`, `confidence`, `matched_failure_condition`, and `action: "accept"`.

---

## 14. Architecture decisions and the "why" behind them

These are the choices that shape everything; understanding them explains most of the code.

1. **Extension is a thin shell; the binary does the work.** Heavy work (browser automation, parallel AI calls) would block VS Code's UI thread or bloat the extension. Spawning a separate compiled process keeps the editor responsive and lets the engine use Playwright/Babel freely.

2. **The binary is a single executable (SEA) with no secrets.** It ships to users' machines. A compiled SEA is self‑contained (no `node_modules` to install) and, crucially, **contains no API keys** — all model access is brokered by the server. Secrets reach the binary only as a short‑lived auth **token** (via env var).

3. **All LLM traffic goes through a proxy server.** Keys stay server‑side; the company can enforce **quotas, logging, and guardrails** centrally; and it can swap the underlying model/provider without re‑shipping the binary. The binary literally cannot call OpenAI directly.

4. **Text‑over‑stdout IPC.** The extension/binary boundary uses newline‑delimited `__WCAG_EVENT__` JSON. It's trivial to debug (you can read the binary's output), language‑agnostic, and needs no shared runtime.

5. **Applicability before auditing.** Running the real app to learn which criteria apply means the AI is told exactly what to check, audits skip irrelevant files (saving money), and findings can be tied to real page elements + screenshots.

6. **Two analysis philosophies kept separate (AI audit vs deterministic test).** AI explains and finds subtle issues but can hallucinate; deterministic rules are certain but narrow. Shipping both, plus **guardrails** to score the AI, balances coverage against trustworthiness.

7. **Event‑sourced, append‑only store.** Conformance work demands an audit trail. Never overwriting history — and recording tool version per run — produces defensible evidence and lets the extension and binary both contribute events.

8. **Self‑healing instrumentation.** Because applicability *edits your source* temporarily, every write is atomic + backed up, and three independent recovery paths (binary startup sweep, binary signal handlers, extension post‑stop recovery) guarantee your code is never left modified.

9. **Security‑locked, default‑off advanced features.** Guardrail display and linting are off by default behind an admin‑password gate (`timingSafeEqual` comparison) during rollout — see `activateExtension.ts`.

10. **Adaptive concurrency + result caching.** AI backends rate‑limit; large repos are expensive. The manager ramps concurrency up/down based on observed errors and skips unchanged files via content hashing.

---

## 15. How to run and develop locally

> These are derived from the `scripts` in each `package.json`.

**Extension (this repo root):**
```bash
npm install
npm run build        # type-check + esbuild → dist/extension.js, dist/lintServer.js
npm run watch        # rebuild on change (for development)
npm run test:linting # run the Vitest unit tests
npm run lint         # eslint over src/
# To launch: open the folder in VS Code and press F5 (Run Extension) — see .vscode/
```

**Binary (`binary/`):**
```bash
cd binary
npm install
npm run build        # tsc → binary/dist
npm run dev          # ts-node src/index.ts  (run the engine directly without compiling)
npm run build:sea    # produce the single-executable .exe shipped with the extension
# Run it directly, e.g.:
node dist/index.js /path/to/some/project --mode=report --serverUrl=https://...
```

**Server (`server/`):**
```bash
cd server
npm install
npm run dev          # ts-node src/index.ts (needs a .env with Azure creds / DB config)
npm run build && npm run start
# Health check: GET /api/health
```

**Configuration the end user sets** (VS Code settings, see [`package.json`](package.json) `contributes.configuration` and [`src/config/settings.ts`](src/config/settings.ts)):
- `wcag-analyzer.serverUrl` — the proxy server base URL (required).
- `wcag-analyzer.serverCaBundlePath` — custom CA for corporate TLS.
- `wcag-analyzer.expertiseLevel` — `beginner` / `intermediate` / `expert` (controls prompt verbosity).
- `wcag-analyzer.auditOnlyApplicableFiles`, `cacheAnalysisResults`, `enableGuardrails`, `enableLinting`, `lintOnSave`, `lintOnType`.

---

## 16. Where to look when…

| You want to… | Start here |
|---|---|
| Add/inspect a VS Code command | [`src/extension/activateExtension.ts`](src/extension/activateExtension.ts) + `package.json` `contributes.commands` |
| Change how the extension launches the engine | [`src/core/runner/BinaryRunner.ts`](src/core/runner/BinaryRunner.ts) |
| Change the chat UI behavior | [`src/features/chat/WcagChatViewProvider.ts`](src/features/chat/WcagChatViewProvider.ts) |
| Change the AI **audit** prompt | [`binary/src/agents/worker/prompts.ts`](binary/src/agents/worker/prompts.ts) |
| Tune AI token budgets / reasoning effort | [`binary/src/agents/worker/constants.ts`](binary/src/agents/worker/constants.ts) |
| Change how files are queued/parallelized | [`binary/src/agents/ManagerAgent.ts`](binary/src/agents/ManagerAgent.ts) |
| Work on browser/applicability | [`binary/src/applicability/index.ts`](binary/src/applicability/index.ts) + [`binary/src/runtime/`](binary/src/runtime/) |
| Add a deterministic WCAG test rule | [`binary/src/testing/rules/`](binary/src/testing/rules/) + register in `registry.ts` |
| Add a static lint rule | [`src/features/linting/core/rules/`](src/features/linting/core/rules/) + `index.ts` |
| Change how the AI is called / the proxy contract | [`binary/src/clients/llm/index.ts`](binary/src/clients/llm/index.ts) ↔ [`server/src/services/llmService.ts`](server/src/services/llmService.ts) |
| Work on guardrails | [`server/src/guardrails/`](server/src/guardrails/) |
| Understand the audit trail / history | [`binary/src/domain/codea11yStore/`](binary/src/domain/codea11yStore/) |
| Work on VPAT/report exports | [`src/features/reports/`](src/features/reports/) |

---

### Suggested reading order for your first week
1. This document, top to bottom.
2. [`src/extension/activateExtension.ts`](src/extension/activateExtension.ts) — see every entry point.
3. [`src/core/runner/BinaryRunner.ts`](src/core/runner/BinaryRunner.ts) — the extension↔binary contract.
4. [`binary/src/index.ts`](binary/src/index.ts) → [`binary/src/workflows/managerWorkflow.ts`](binary/src/workflows/managerWorkflow.ts) — the main pipeline.
5. [`binary/src/agents/WorkerAgent.ts`](binary/src/agents/WorkerAgent.ts) + [`prompts.ts`](binary/src/agents/worker/prompts.ts) — where the AI actually analyzes code.
6. [`binary/src/applicability/index.ts`](binary/src/applicability/index.ts) — the browser magic.
7. One rule file like [`binary/src/testing/rules/sc-1-1-1.ts`](binary/src/testing/rules/sc-1-1-1.ts) — concrete, readable, self‑contained.

Welcome to the project. 🎉
