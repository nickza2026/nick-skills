# Pragmatic review calibration

Accept diverse sound implementations within actual project constraints. Require exact supplied business logic, established local patterns and justified file ownership while protecting correctness, safety, financial integrity and meaningful performance. "Not too strict" relaxes personal taste-based gatekeeping, not confirmed local conventions, requirements or verification.

## What should and should not block

| Situation | Review treatment |
|---|---|
| An unfamiliar or newer technique correctly implements the task and respects relevant constraints | Accept the technique; understand it using bounded relevant evidence if needed |
| A long-established pattern differs from the reviewer's preferred style | Accept it; do not require a stylistic rewrite |
| Changed code introduces a second local pattern without a requirement or justified exception | Compare nearest base examples and report the evidenced convention/maintenance issue, not a fabricated runtime defect |
| A new helper/file duplicates an existing owner or fragments trivial glue with no distinct responsibility | Report the concrete duplication/ownership issue and point to the fitting existing owner |
| A new file has a genuine domain, test, migration or cohesive separation responsibility | Accept the justified addition; no blanket no-new-files rule or numeric quota |
| The purpose of an added file is unclear after tracing relevant code/task | Ask a focused question; missing PR prose alone does not prove an unnecessary file |
| Two approaches are both correct with no meaningful cost difference | Do not block or manufacture an optimization requirement |
| A supplied task condition, boundary, permission, or required sequence is wrong | Report a correctness/requirements finding even if the code looks clean or follows a common pattern |
| A reachable loop cannot terminate, retries can run away, or workload growth causes substantial CPU/query degradation | Report the concrete risk and evidence; do not run a harmful demonstration |
| Performance concern depends on unknown data volume or execution frequency | State the assumption, inspect narrow relevant context, or ask; do not claim a proven massive regression |
| A concrete original-versus-alternative trade-off is uncertain and safely testable | Prefer an isolated equivalence check and repeated representative A/B measurements; do not decide by intuition alone |
| A style or maintainability suggestion is useful but not a defect | Mark optional and keep separate, or omit it to reduce noise |
| Requirements are unavailable | Apply the existing requirements-question gate; only confirmed absence enables correctness-only mode |

## Examples

### Unfamiliar but valid

An author uses a window function, CTE, established iterator, or library primitive that the reviewer has not used. Its behavior satisfies the task and relevant local constraints, and its relevant cost is acceptable. Do not block because a loop, join, or manual implementation would be more familiar. Do not demand that the user already know the method.

This does not automatically pass the PR: still complete relevant safe tests, contracts, authorization, and failure-path checks.

### Nested does not automatically mean runaway

A nested loop over a small, explicitly bounded input is not inherently "loop hell." Check actual bounds and frequency. Conversely, an unbounded retry with no progress/cancellation or repeated scans over a realistically huge input can be a genuine blocker. Identify the reachable path rather than objecting to the visual nesting.

### Query cost must be grounded

Replacing bounded queries with repeated full scans or a per-row query at large reachable volumes may be significant. Show the changed access pattern, relevant scale, and expected cost or a safe plan/measurement. Do not call every extra query, CTE, or unfamiliar SQL construct a severe slowdown; do not require a blanket benchmark suite for an ordinary safe change.

### Task logic is exact

If a supplied task requires a credit to be applied once after a particular state transition, applying it twice, in the wrong state, or before the required condition is a defect even if the implementation uses a popular pattern. Do not accept "close enough" behavior, reinterpret requirements to match the code, or substitute an unstated policy.

For ambiguous criteria, ask about the ambiguity. With confirmed no task requirements, review technical correctness/order without inventing or claiming business-flow conformance.

### Pattern fit and added files

Comparable target-base RPC routes use the existing adapter directly. A changed endpoint adds a unique wrapper and three forwarding/helper files that duplicate an available helper, without a task requirement or distinct responsibility. Cite the peer route/helper and new code, then raise the unexplained divergence/fragmentation. Do not excuse it merely because wrappers are sound in other projects, invent a crash or silently delete the files.

A distinct new domain, a necessary regression-test file, an immutable migration or a genuinely cohesive module split may require a new file. Infer its role from the code/task and accept a supported reason without demanding a per-file PR essay. If a shared security guard is required and approved, keep it rather than flattening protection for visual consistency. A moved file with unchanged ownership is not automatically new proliferation.

## Behavioral acceptance checks

- Different sound technique + correct task behavior + established project constraints respected + completed relevant checks: no personal-style blocker.
- Confirmed local pattern violated or unjustified new-file fragmentation: report with changed/base ownership evidence, even without a runtime correctness failure.
- New file with a clear necessary responsibility or approved exception: accept; do not ban it by count, length or novelty.
- Unclear rationale only: ask, do not claim that absence of an explanation proves absence of a reason.
- New-to-reviewer technique: understand it; unfamiliarity alone does not produce a finding.
- Clean/idiomatic code + wrong task condition: report the actual logic defect.
- Bounded nested work on an appropriate small workload: no invented severe-performance finding.
- Reachable nontermination or materially worse CPU/query work: explain impact with evidence; do not weaken the finding in the name of flexibility.
- Unknown scale: distinguish a hypothesis/question from a demonstrated regression.
- Safely testable comparison uncertainty: extract original/alternative code, establish equivalent behavior, measure both fairly, and explain the evidence/trade-offs without changing PR source.
- Failed, blocked, or unrun required tests: preserve the verification limitation, even when the approach itself is acceptable.
