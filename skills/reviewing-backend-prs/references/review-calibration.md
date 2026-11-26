# Pragmatic review calibration

Use Must fix, Recommend fix, Recommend test and Team review to separate defects, implementation improvements, coverage gaps and decisions. Continue checking exact business logic, local patterns, file ownership, safety and money integrity. A coding-convention or missing-coverage concern alone is not a functional blocker; neither label excuses an evidenced harmful path or a required verification gate.

## What should and should not block

| Situation | Review treatment |
|---|---|
| An unfamiliar or newer technique correctly implements the task and respects relevant constraints | Accept the technique; understand it using bounded relevant evidence if needed |
| A long-established pattern differs from the reviewer's preferred style | Accept it; do not require a stylistic rewrite |
| Changed code introduces a second local pattern without a requirement or justified exception, but behavior stays correct | Recommend fix with nearest base examples; not Must fix on coding convention alone |
| A new helper/file duplicates an existing owner or fragments trivial glue with no distinct responsibility, without functional harm | Recommend fix with concrete ownership evidence; this alone does not block merge |
| A new file has a genuine domain, test, migration or cohesive separation responsibility | Accept the justified addition; no blanket no-new-files rule or numeric quota |
| The purpose of an added file is unclear after tracing relevant code/task | Ask a focused question; missing PR prose alone does not prove an unnecessary file |
| Two approaches are both correct with no meaningful cost difference | Do not block or manufacture an optimization requirement |
| A supplied functional task condition, boundary, permission or required sequence is demonstrably wrong | Must fix with the expected/actual result, even if the code looks clean |
| A reachable loop cannot terminate, retries run away or realistic workload causes material CPU/query degradation | Must fix with concrete path/workload evidence; do not run a harmful demonstration |
| Performance concern depends on unknown data volume or execution frequency | State the assumption, inspect narrow relevant context, or ask; do not claim a proven massive regression |
| A concrete original-versus-alternative trade-off is uncertain and safely testable | Prefer an isolated equivalence check and repeated representative A/B measurements; do not decide by intuition alone |
| A style or maintainability suggestion is useful but not a defect | Recommend fix, or omit trivial personal preference; no merge blocker |
| Test cases are missing or coverage is incomplete without an established bug | Recommend test with scenario/assertions; absence of a test is not proof of wrong behavior |
| Executed tests fail, or test compilation is broken | Must fix before merge; report evidence and resolve the cause, not by deleting assertions or skipping checks |
| The correct business flow or long-term bound depends on unconfirmed team policy | Team review with question, options, missing evidence, owner and decision timing |
| Rare overflow is reachable under admitted valid inputs and breaks writes/results/money | Must fix; low frequency is not a reason to defer a demonstrated defect |
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

Comparable target-base RPC routes use the existing adapter directly. A changed endpoint adds a behavior-preserving wrapper and three forwarding/helper files that duplicate an available helper, without a distinct responsibility. With correct behavior, cite the peer/helper and classify Recommend fix, not a merge blocker. If the wrapper actually rejects valid requests or removes authorization, that distinct demonstrated failure is Must fix. Do not invent a crash or silently delete files.

A distinct new domain, a necessary regression-test file, an immutable migration or a genuinely cohesive module split may require a new file. Infer its role from the code/task and accept a supported reason without demanding a per-file PR essay. If a shared security guard is required and approved, keep it rather than flattening protection for visual consistency. A moved file with unchanged ownership is not automatically new proliferation.

### Team review: future numeric bounds versus a reachable failure

PostgreSQL `integer` has signed 32-bit bounds (-2,147,483,648 to 2,147,483,647). Values outside the range are rejected; do not assert silent PostgreSQL wraparound. Inspect the actual column/sequence limits, expressions/casts, admitted input range and validators. Use supplied safe headroom/growth evidence where available; do not access production or invent usage rates/years-to-exhaustion.

If the only supported concern is eventual capacity under an unconfirmed long-term growth assumption, use Team review: what maximum/lifetime must the domain support, what headroom/migration trigger is acceptable, and who owns that decision? Compare retaining the validated bound with a planned wider-type/contract migration, including compatibility/cast costs. Do not mechanically change every `integer` to `bigint`. Mark follow-up only if safe current scope is supported and accepted; otherwise state the necessary decision before merge.

If the current contract admits 3,000,000,000 while a changed write stores it in `integer`, the valid write fails now: Must fix. A reachable narrowing cast or accumulation that corrupts a balance is likewise Must fix even if uncommon. Do not move a concrete money/data failure into Team review because it sounds like an edge case.

### Team review: expected flow needs agreement

If requirements do not say whether cancellation refunds immediately or only after provider confirmation, ask the domain/product and backend team which transition authorizes the refund, how pending/failed outcomes appear and what invariant prevents duplicates. State the alternatives and consequences, without inventing the business rule. Agreement is needed before merge when this answer determines correctness or money safety. If the task already specifies the transition and the PR violates it, use Must fix rather than reopen the agreed flow as a debate.

### Recommend test: coverage gap is not itself a bug

Correct-looking pagination lacks empty-page and invalid-cursor cases: Recommend test, with expected result/error assertions and the relevant mounted/integration boundary. The coverage recommendation alone need not hold a merge; retain actual verification limitations and repository CI gates. A proven repeated-credit bug is Must fix with a targeted retry/concurrency regression recommendation, not merely Recommend test because coverage is missing. Executed failing tests are Must fix: determine whether implementation, test, fixture or flakiness is responsible and resolve it before merge, without deleting assertions or skipping checks. Checks blocked before meaningful execution by an unsafe/unavailable environment remain blocked/unrun; never label them passed or manufacture an assertion failure from nonexecution.

## Behavioral acceptance checks

- Different sound technique + correct task behavior + established project constraints respected + completed relevant checks: no personal-style blocker.
- Confirmed local pattern violated or unjustified new-file fragmentation with correct behavior: Recommend fix with changed/base evidence, not a merge blocker by itself.
- Missing cases/incomplete coverage with no proven bug: Recommend test with concrete assertions, not Must fix by absence alone.
- Unsettled substantial business flow or credible future range assumption: Team review with decision owner, needed evidence and before-merge/follow-up timing.
- Reachable incorrect financial result or invalid-range failure under valid current inputs: Must fix even when rare; do not relabel it as Team review or only a test gap.
- New file with a clear necessary responsibility or approved exception: accept; do not ban it by count, length or novelty.
- Unclear rationale only: ask, do not claim that absence of an explanation proves absence of a reason.
- New-to-reviewer technique: understand it; unfamiliarity alone does not produce a finding.
- Clean/idiomatic code + wrong task condition: report the actual logic defect.
- Bounded nested work on an appropriate small workload: no invented severe-performance finding.
- Reachable nontermination or materially worse CPU/query work: explain impact with evidence; do not weaken the finding in the name of flexibility.
- Unknown scale: distinguish a hypothesis/question from a demonstrated regression.
- Safely testable comparison uncertainty: extract original/alternative code, establish equivalent behavior, measure both fairly, and explain the evidence/trade-offs without changing PR source.
- Executed failing tests or broken test compilation: Must fix with actual command/error evidence, not Recommend test; preserve pre-existing/unknown origin and resolve without weakening checks.
- Blocked or unrun tests: preserve the verification limitation without inventing pass/fail or treating nonexecution alone as a code defect.
