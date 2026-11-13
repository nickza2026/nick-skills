---
name: documenting-frontend-api-handoffs
description: Creates concise, self-contained Markdown API handoffs scoped to the current feature/task. Covers affected methods/paths, request/response fields and examples, validation, permissions, errors and necessary client constraints. Omits unrelated legacy APIs, reuse provenance, irrelevant exclusions and prescriptive UI instructions; optional usage examples stay brief. Use during frontend-facing API implementation/fixes or when asked for FE docs, API integration guides or handoffs. Does not authorize UI/backend changes, production calls or Git publication.
---

# Document API Changes for Frontend Integration

Treat a frontend-facing API change as incomplete until its `.md` handoff is created or updated alongside the authorized implementation. Cover **every affected frontend-facing endpoint in the current task**, not just a link to Swagger. Produce the API facts needed to integrate this feature, not a feature-history report or a UI implementation plan.

## Scope and output

- Follow higher-priority instructions, the approved task, and target repository conventions. Preserve unrelated and existing uncommitted work. In a read-only review, assess documentation and report gaps only; do not write files or require a frontend PR/UI implementation.
- Read existing FE documentation examples for format and terminology only; do not import their feature scope, old APIs, UI choices, or provenance into the output. Prefer updating this feature's handoff; otherwise use `docs/fe-<feature>.md` or the established directory. Group related endpoints coherently without creating a new file for every iteration.
- Write generated handoffs in Thai for Nick's Thai FE workflow unless the user or target repository specifies another language. Keep this portable skill and its bundled template/references in English. Preserve exact wire keys, enums, permission names, and error codes in every language.
- Include only FE-owned responsibilities and client-observable constraints. Exclude SQL, migrations, table/column design, worker/queue/lease/reconciliation internals, backend algorithms, Go types/source paths, configuration/deployment commands, and backend test/commit history. Do not copy backend implementation explanations from repository examples.
- Never expose secrets, real access tokens, customer data, credential-bearing URLs, or privileged service credentials to FE. Use unmistakably synthetic examples; do not upload private sources to external services. Documentation work grants no production calls, database execution, UI coding, commits, pushes, or deployment authority.

Read [the contract checklist](references/contract-checklist.md) for relevant wire-contract coverage. Adapt [the handoff template](assets/frontend-api-handoff.md.tmpl); remove unused sections instead of padding them. Consult [acceptance scenarios](references/acceptance-scenarios.md) before reporting completion.

## Relevance and restraint

- Write only about the current task's API contract and directly necessary dependencies. Do not compare an unrelated old feature, say a page/widget/API was copied from it, or tell FE to follow it. Reading an old example is an authoring aid, not content for the handoff.
- Omit irrelevant exclusions: do not enumerate absent buttons, forms, actions, or other features merely to say they are not part of this task. Keep a limitation only when it changes correct use or interpretation of the current API, such as a simulated result, unsupported value, or an operation's actual allowed states.
- State API constraints, not UI design instructions. Do not prescribe screens, widgets, button placement/visibility, modal/form design, loading indicators, toasts, navigation, or refetch choreography unless explicitly required by the current task's approved client contract. FE chooses its implementation. A useful usage example may be brief and clearly optional; do not add a detailed UX recipe by default.
- Keep necessary auth/permissions, request/response keys, validation/errors, cursor/units/time semantics, state eligibility and retry/idempotency rules. Concision removes repetition and unrelated commentary, not integration or safety requirements. Use one compact example per distinct meaningful shape; add another only when it explains a real contract difference.
- Prefer plain factual statements about the contract. State each requirement once in its relevant section, rather than repeatedly telling FE what it must/should do. Do not add delivery checklists or visual-label instructions by default; include them only when explicitly requested or required by this task's approved contract.
- Apply a final relevance test: does this sentence enable correct integration of this task or explain a required change to an affected existing contract? If not, remove it. Do not fill headings with generic advice or repetitive not-applicable statements.

## Workflow

### 1. Build the complete endpoint inventory

Establish the delivery scope from the approved task, actual changed files, and an identified base/current diff when available. Inspect mounted routes, shared request/result types, validation, auth/permissions, serializers/error encoders, and directly relevant tests. Follow callers of changed shared contracts: one shared field or middleware change can affect several unchanged route files. Do not infer coverage solely from a handler filename or a stale API specification.

List affected **methods + full client-visible paths** and their purposes with links to details. Include response-only, validation/default, permission/error and shared-contract changes. Add a short adoption note only when an existing affected contract actually changes client usage: identify the changed key/behavior and required adjustment. Do not add a history/comparison section to a new endpoint or discuss an unrelated old API.

Track internal/provider-only/service-to-service changes in the author/task report rather than automatically listing their exclusions in the FE handoff. Include a brief access boundary only if the current integration could otherwise misuse that endpoint; never expose privileged credentials. Reference an unchanged endpoint only when it is genuinely needed to use this task's API, not because a previous feature used it. Report unknown base/routing coverage to the parent/user instead of claiming an exhaustive inventory.

### 2. Establish the actual wire contract

Verify the contract from runtime-facing code and safe existing tests, not Go structs or Swagger alone. Distinguish HTTP status from application success/error envelopes; preserve actual casing, omission, nullability, and no-result behavior. Document transport/auth wrappers once when truly shared, with precise per-route exceptions. Do not impose Bearer/JWT, REST statuses, RPC envelopes, `hasNext`, or a pagination schema from another project.

For **each** affected route give its purpose, auth/permission/state eligibility, request headers/path/query/body and field meanings, success status/JSON and field meanings, and applicable errors with exact statuses/codes and compact synthetic examples. Document required client behavior only when the contract establishes it. A bodyless request needs the actual path/query/header example and no invented JSON body. Explain relevant nested keys and array items; avoid duplicating whole payloads or shared auth/error sections without a meaningful difference.

### 3. Describe necessary client constraints, not UI implementation

Describe the actual meaning of empty/unavailable results, auth/validation failures, conflicts and stale states where relevant. State which operations a permission/state allows and what the API rejects, without directing FE to hide/disable buttons or design a particular screen. Do not mandate a screen/action-state matrix or generic loading/error/success walkthrough.

Include filter/sort/pagination inputs, upload/download behavior, targeting, units/timezone, async status, retries/idempotency and fake/demo limitations only when applicable and verified. Explain observable API behavior, not backend execution or a detailed frontend recipe. Do not invent endpoints, retry policies, polling intervals or fields; report unresolved integration facts as blockers.

### 4. Reconcile coverage and verify the handoff

Compare the final endpoint inventory with the changed routes and shared-contract impact. Give every new/modified entry a complete endpoint section or an exact link to an updated section; do not leave a response-only change undocumented. Verify example JSON and key tables agree with each other, the implementation, and relevant safe contract checks. Check error examples against actual mounted status/envelope behavior; an illustrative document alone is not executed API evidence.

Use existing safe tests or approved isolated checks to resolve contract uncertainty. Do not call production or unsafe mutation endpoints merely to obtain examples. Keep implementation sources stable during running checks. If runtime verification is blocked, disclose that in the task report and mark the uncertain client contract clearly; do not embed backend test logs in the FE handoff or claim all routes are verified.

Remove unrelated legacy references, reuse explanations, irrelevant exclusions, UI prescriptions, repeated payloads and unused template sections. Do not append an adoption/integration checklist unless explicitly requested; keep any necessary contract-adoption facts in their relevant section instead of repeating them as instructions. Report output `.md` paths, covered endpoints and unresolved contract questions to the parent/user. Authoring this skill does not automatically update installed copies or pinned revisions.
