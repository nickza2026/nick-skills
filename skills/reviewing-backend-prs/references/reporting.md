# Review report

Group review items by **Must fix**, **Recommend fix**, **Recommend test** and **Team review**. Disposition describes the required action and merge consequence; severity describes supported impact, and confidence describes evidence. These are separate axes, not automatic mappings from Critical/High/Medium/Low. Put Must fix first, ordered by actual impact; never invent runtime defects to elevate a pattern or coverage concern.

Report fewer, well-supported items rather than filling a quota. Continue inspecting local patterns and every added file's ownership, but recommend-only improvements do not block merge by themselves. Preserve exact functional requirements and safety. Do not force a finding into every group or repeat one issue across categories.

## Review disposition

| Disposition | Evidence and action | Merge consequence of this item |
|---|---|---|
| **Must fix** | A concrete changed-code path violates intended operation or expected results: crashes, broken valid requests, incorrect data/money, missing authorization, reachable integrity loss or material runaway/resource failure. Cite trigger, expected/actual behavior and correction. | Fix before merge. Rare does not excuse a supported harmful path. |
| **Must fix: failing tests** | Executed tests fail or the test suite cannot compile due to broken code. Cite the command, head, exit/error and observed failures; determine implementation/test/fixture/flakiness cause without weakening assertions. | Resolve before merge; do not relabel as Recommend test or waive a known failure. |
| **Recommend fix** | Behavior remains correct; local pattern drift, unnecessary helper/files, duplication or readability/maintenance can be improved. Cite comparable code and a focused suggestion without inventing functional harm. | This item alone does not block merge; merging can preserve correct core behavior. |
| **Recommend test** | A test case is missing or coverage is incomplete, without evidence that implementation is wrong. State the exact uncovered scenario, expected assertions and relevant unit/mounted/integration boundary. | The coverage recommendation alone does not block merge. Preserve independently required CI/verification gates and disclose what remains unverified. |
| **Team review** | The expected flow, domain bounds, long-term capacity, compatibility promise or trade-off needs team agreement and is not yet a proven defect. Identify the concrete question, options/trade-offs and missing facts. | State **decision before merge** if correctness/safety depends on the answer, or **follow-up decision** only when safe current scope is supported. Never silently approve an unresolved essential flow. |

For Team review, name the decision owner by role (domain/product/backend/DB team as applicable; do not invent a person), evidence needed and a recommended next step. A remote possibility alone is not enough: connect it to actual code/types/constraints and a plausible assumption to confirm. A current supported failure moves to Must fix; a confirmed safe in-pattern improvement may move to Recommend fix or disappear.

Use matching headings or comment prefixes: `[Must fix]`, `[Recommend fix]`, `[Recommend test]`, `[Team review]`. Comments carry the same evidence and timing distinction as the summary. Do not auto-submit a GitHub review, approve, request changes or merge merely because a category was selected; posting remains separately authorized.

Missing coverage is Recommend test, not a correctness failure by itself. If a real bug is established, report the bug as Must fix and reference a focused regression test without duplicating the same defect as another blocker. An executed failing test is Must fix even if production behavior is not yet proven wrong: investigate implementation, test, fixture or flakiness and resolve the failure before merge. Record pre-existing/unknown origin honestly rather than automatically blaming the PR, but do not downgrade a known failing test to a recommendation. A command blocked before meaningful test execution by unavailable permissions/environment is blocked verification, not an invented assertion failure. Do not soften a known failure or call absent/unrun tests passed.

## Findings

For each item include:

- **Disposition and short title:** one of the four labels above. Do not use a severity score alone to communicate merge blocking.

- **Severity when applicable:** for established defects, Critical/High/Medium/Low follows actual impact and likelihood. Do not force maintenance/coverage advice or unresolved decisions into a fictional runtime-defect severity; describe its benefit or conditional impact instead. Disposition, not a severity word alone, states the requested action.
- For local-convention/file-ownership issues with correct behavior, use Recommend fix regardless of whether the convention is established. Demonstrated functional/safety consequences make it Must fix for those consequences, not for looking different. For Team review, label impact as conditional/unknown where appropriate rather than assigning a definitive defect severity.
- **Evidence:** changed file and narrow line range at the reviewed head; relevant directly connected caller/schema/test evidence when needed. Do not invent line numbers. Distinguish PR-introduced behavior from pre-existing conditions.
- **Pattern/file findings:** label the topic as local-convention, duplication or ownership and the disposition as Recommend fix when behavior is correct. Cite nearest comparable base code and recommend the smallest coherent correction. Do not claim a bug or security/performance regression without evidence, or assign high severity just because a file is new. Keep unresolved rationale questions separate from confirmed findings; put a substantive missing team decision under Team review.
- **Trigger and impact:** for a defect, concrete input/path and expected versus actual result. For Recommend fix, the maintenance issue. For Recommend test, the untested scenario and expected assertions, without an invented wrong actual result. For Team review, the assumption/decision and conditional consequence. Do not claim a reproduction was run when it was only reasoned statically.
- **Confidence:** established defect versus hypothesis, with the missing fact needed to confirm a hypothesis. Keep questions and optional style suggestions separate from correctness blockers.
- **Recommendation or decision:** describe the correction/improvement or team question, owner and timing without modifying code unless authorized.

For a performance finding, name the reachable workload and meaningful cost or termination failure, with structural or measured evidence. Do not present hypothetical CPU/query slowness as proven, or claim measurements that were not run. Unfamiliar syntax or a different abstraction is not evidence of a defect.

When an isolated comparison was run, attach its original/alternative identities, semantic checks, environment/workload, exact commands, repeated results/variability, and limitations. Use [the comparison report](../assets/comparison-report.md.tmpl) when useful. Separate microbenchmark results from endpoint/production behavior, and discuss implementation complexity as well as speed. Report an inconclusive result as inconclusive rather than selecting a winner by preference.

## Verification and scope

Record:

- PR identifier, base SHA, head SHA, diff basis, and whether the head remained unchanged.
- Changed paths reviewed and directly relevant supporting scope; exclusions such as frontend completeness, unrelated modules, inaccessible files, or unreviewed changes.
- Task source and criteria checked, or status: pending user response, inaccessible/requested pasted content, or skipped after explicit confirmation that none exists. Do not present missing requirements as an automatic defect or claim business-flow conformance in correctness-only mode.
- Each actual test command, tested SHA, exit code and final result; list failures, missing tests, blocked checks, and unrun checks explicitly. Redact secrets, not relevant failure evidence. Identify static inspection separately from executed tests.
- CI job/result/SHA separately from locally executed evidence. Do not describe a command as passing before it finishes, or a review as complete while relevant tests remain failed, blocked, or unrun.

## Verdict

Use one of these scoped outcomes:

- **Must fix present:** identify blockers and required corrections, then recommendations and team decisions. State verification separately.
- **Recommendations only:** no functional blocker found within the checked scope; recommendations alone need not hold the merge. Do not claim global correctness, waived CI/tests or team approval.
- **Team decision pending:** state which decision needs agreement before merge and which can be tracked as follow-up, with evidence/owner. Do not invent a defect or a team decision.
- **No findings within checked scope:** use only for the inspected scope, name exclusions, and claim completed verification only when related safe tests finished successfully. This is not an unconditional approval or guarantee.
- **Blocked:** identify the missing revision, requirements decision, safe environment, permission, or test evidence that prevents the requested review from completing. If useful static review was possible, include its findings without implying completion.

Keep the next action specific: provide criteria, resolve a defect, authorize safe verification, or rerun a named check. Do not manufacture success to close the review.
