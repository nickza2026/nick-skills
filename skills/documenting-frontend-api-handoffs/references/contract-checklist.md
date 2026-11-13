# FE contract coverage checklist

Use this while inspecting source and filling the handoff. Document only applicable behavior that the implementation or approved contract establishes; do not turn this list into invented API requirements.

## Relevance gate

- Keep only the current task's API facts and directly necessary dependencies. Read old docs for format privately; do not carry unrelated old APIs/features, copy/reuse provenance, or instructions to imitate another feature into the handoff.
- Omit irrelevant exclusions and lists of absent buttons/forms/actions. A limitation belongs only when it affects correct use or interpretation of this feature's API.
- State contract requirements, not UI design. Do not prescribe widgets, screen layouts, loading indicators, button visibility, toasts, navigation or detailed interaction flows unless the current approved contract actually requires them. Optional usage examples stay brief; FE chooses its implementation.
- Use plain factual contract statements once, not repeated FE instructions. Remove generic checkboxes and unused headings; add a delivery checklist only if explicitly requested. Keep actual request/response fields, validation/errors and necessary safety constraints.

## Endpoint and change inventory

- Show method, fully mounted path, purpose and a link to details; include audience when it differs. No default screen/control inventory is required.
- Include indirect impact from shared payload types, auth middleware, permissions, defaults, serialization, pagination wrappers, and error encoders. Label unchanged flow dependencies separately.
- For an actual affected existing contract, add only the changed keys/semantics and compatibility/adoption facts that affect integration. Do not add unrelated feature history or a comparison section to a new API. Do not infer rollout dates or compatibility windows.

## Auth and action eligibility

- Specify the actual authentication mechanism and client headers/cookies/content type. For browser cross-origin use, explain only verified client requirements such as credentials/CSRF handling; never prescribe a privileged backend API key in frontend code.
- Give exact permissions, tenant/resource visibility and allowed operation states, without prescribing button visibility or a screen layout. Distinguish missing session, forbidden access, missing resource and expired session behavior when the API distinguishes them.
- State how FE obtains prerequisite IDs/options through documented endpoints. Do not leak database lookup instructions or invent discovery endpoints.

## Request reference

| Key path/location | Type/format | Required/nullable | Default or omission meaning | Constraints |
|---|---|---|---|---|
| Use actual paths such as `body.filter.status`, `query.cursor`, `header.Idempotency-Key` | Include array element types | Distinguish omission from explicit null | State only actual defaults | Allowed values, bounds, size/unit limits |

- Enumerate relevant nested objects/arrays; distinguish omitted, `null`, empty string, empty array, `false`, and `0`, especially for partial updates.
- Specify IDs as opaque identifiers or exact formats only when established. Cover string length/byte limits, precision/rounding, amount units, enum casing, mutually exclusive/dependent fields, and date range inclusivity as applicable.
- Prefer one compact valid request example; add another only for materially different semantics. A bodyless GET needs a path/query example instead. Label invalid input alongside its expected error, never as a valid request.

## Response reference

- Show the actual success HTTP status and complete envelope. Explicitly document empty body, missing `result`, or `result: null` rather than guessing from a language type.
- Explain nested field paths, types, nullability/omission, enums and time/unit/precision rules without prescribing visual presentation. Cover meaningful empty/optional variants and distinguish unknown/unavailable values from an actual zero measurement.
- For lists describe accepted filter/sort keys and directions, defaults and limits, pagination mode and exact wire keys. Include a real empty example. Explain opaque cursor reuse, expiry/filter binding, and when next navigation stops only if implemented. Never require totals or invent zero totals when absent.
- For async operations distinguish accepted, pending, succeeded, failed, canceled, or unavailable states actually exposed. Document the real polling/stream endpoint and verified interval/backoff guidance if defined; do not invent a completion signal.

## Errors and recovery

| HTTP status | Exact application code/envelope | Trigger | Example link | Required client behavior, if established |
|---|---|---|---|---|
| Keep transport status separate | Preserve exact casing and optional fields | Give an input/state category | Compact synthetic JSON or bodyless/non-JSON description | Actual retry/state-recovery constraints, not mandatory toast/form/navigation choices |

- Cover reachable auth/permission, validation, not-found, conflict/state eligibility, duplicate/idempotency mismatch, rate limit, and server/unavailable cases relevant to the route. Do not assert every route returns every category.
- Provide concrete JSON examples for each distinct relevant status/envelope/error shape. Multiple codes sharing a shape can use a clearly mapped example plus a complete code/trigger/handling table. Do not offer only a list of codes. Preserve actual per-field validation detail shape, headers, and HTTP-200 domain failures where present.
- Reuse a common auth/error section only when the endpoint links it and states its applicability/exceptions. Do not use “see common errors” to omit route-specific failures.
- Define safe retry behavior only from the actual contract. Reuse a stable idempotency key/action ID for retries of the same human action when required; change it for a new action. Explain required timed-out mutation/status reconciliation without inventing frontend interaction rules.

## Additional contract constraints and final scrub

- Omit default screen/action matrices and loading/empty/success walkthroughs. A brief optional usage example can clarify the API; do not turn it into detailed mandatory UI instructions.
- State targeting (which users/resources), eligibility, local-vs-UTC rendering, timing windows, cancellation, stale responses, and partial-success handling where they affect the client.
- Explain actual fake/demo/simulated results, flags and limits of the current API without inventing visual-label instructions. Keep any display disclaimer the approved contract genuinely requires. Do not imply real delivery or money movement from acceptance or list unrelated unsupported features as exclusions.
- For uploads/downloads include actual field names/content types/limits and client-visible expiry/access rules; use safe synthetic URLs, never private storage credentials.
- Remove BE internals: SQL/migrations/DB setup, worker/dispatch/leases, algorithms, package paths, deployment/server configuration commands, and backend test/commit history. Keep observed state/action/retry constraints even if their implementation is complex.
- Verify endpoint coverage, field meanings, errors and synthetic examples; remove placeholders, unrelated legacy comparisons, reuse provenance and UI prescriptions. Do not append a delivery checklist unless explicitly requested. Put backend verification evidence in the task report, not the client handoff.
