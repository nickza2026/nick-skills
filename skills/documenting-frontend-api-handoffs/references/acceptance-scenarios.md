# FE handoff acceptance scenarios

Use these to evaluate authored documentation behavior; they do not authorize edits during a read-only review or prove runtime API behavior.

## New and modified endpoints in one task

**Input:** A task adds a list endpoint and modifies an existing detail endpoint's nullable response field and permissions.

**Expected:** Cover both methods/paths with request/response fields and examples, permissions and applicable error shapes/statuses. Reference only genuinely necessary unchanged dependencies. Explain this modified endpoint's relevant nullability/permission adoption change briefly; do not add unrelated API history or a UI action matrix. A new endpoint's happy path alone is not complete.

## Shared contract changes

**Input:** A shared result type or error encoder changes but only one handler file is edited.

**Expected:** Trace affected callers/mounted routes, document each impacted frontend endpoint, and avoid claiming complete coverage from changed filenames alone. If a base or part of the routing is unavailable, disclose the inventory limitation.

## Bodyless requests and HTTP-200 errors

**Input:** A GET endpoint takes only query parameters; another endpoint returns HTTP 200 with an application error envelope and HTTP 400 for validation.

**Expected:** Show actual query/header examples without inventing a GET JSON body. Preserve actual statuses, envelope/codes, and validation detail arrays. Include concrete synthetic error JSON, not only error names, and tell FE to inspect the envelope rather than treating every 200 as success.

## Patch semantics and list navigation

**Input:** Updates distinguish omitted/null/false/zero and a list has allowlisted sorting with count-free opaque cursors.

**Expected:** Document every relevant nested request/result field, valid minimal/full variants, null/empty behavior, exact cursor keys/reuse rules, permitted sorts, and termination behavior. Do not invent total counts, a global `hasNext` key, or a client-side fallback unsupported by the API.

## Async/idempotent or fake-only operation

**Input:** The response accepts work, subsequent state is fetched separately, duplicate retries reuse one action ID, and some results are simulated.

**Expected:** State what FE sends, how it checks status, what accepted does not guarantee, allowed actions/states, stable retry keys, timing/targeting, and required fake labels. Explain no worker/queue/transaction internals; do not claim completed provisioning or delivery from acceptance.

## FE-only scope and evidence

**Input:** Backend implementation notes include SQL, migrations, worker leases, setup commands, and tests. Runtime is inaccessible; existing handler code/specs disagree.

**Expected:** Read project examples for format/terminology only, write in the required language, keep the current feature's client-observable constraints, and flag unresolved integration facts instead of fabricating a response. Do not copy old feature scope, reuse explanations or UI instructions into the output. Keep backend evidence in the task report. Parse examples and inspect source without claiming executed API checks or contacting production.

## Authority and internal endpoints

**Input:** The agent is only reviewing a PR or authoring this skill; some changed routes are provider callbacks rather than browser APIs.

**Expected:** Keep read-only review read-only; report documentation gaps without demanding UI implementation/PR. Track non-FE callbacks in the author/task report, not an automatic handoff exclusions section; include an access boundary only if this integration genuinely needs it. Never invent browser access or expose provider credentials. Skill authoring grants no application changes/publication or automatic installed-copy updates.

## Unrelated legacy feature and reuse provenance

**Input:** The task adds an audit-log API. An old Maintenance handoff is supplied only as a formatting reference and describes create/approve/cancel/retry actions and a reusable log widget.

**Expected:** Document only this audit-log API's actual request/response, permissions and errors. The delivered handoff contains no Maintenance comparison, copied-widget provenance, instruction to reuse that feature, or exclusion list of its absent buttons/forms/actions. It does not need to say that the new feature is not Maintenance. Existing examples guide the author, not the reader.

## Frontend autonomy and concise optional examples

**Input:** The approved task supplies API contracts but no required screen layout, widgets, navigation or loading-indicator design.

**Expected:** Do not invent a mandatory screen/control table, button hiding/disabling rules, modal/toast choices, loading-state walkthrough or post-success navigation sequence. A brief optional API usage example is allowed if useful; do not turn it into a detailed UI recipe. FE chooses its implementation. Remove unused headings and generic checkboxes instead of filling them with not-applicable explanations.

## Relevant contract change and safety are not filler

**Input:** The current task renames a field on the same endpoint and requires stable action IDs across retries, permission/state eligibility and an explicit simulated-result flag.

**Expected:** Keep the short field-adoption note and actual retry/idempotency, permission/state and fake-result semantics. Do not prescribe UI controls or compare unrelated APIs. Cutting unrelated history and UI prose must not drop required contract/safety facts, nested field meanings, request/response/error examples or HTTP/application status distinctions.
