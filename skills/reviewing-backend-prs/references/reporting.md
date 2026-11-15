# Review report

Put actionable correctness and safety findings first, ordered by severity. Include evidenced local-convention/file-ownership findings without presenting them as invented runtime defects. Avoid personal-style-only blockers or unconditional approval; a confirmed project consistency requirement is not merely personal taste.

Report fewer, well-supported findings rather than filling a quota. Accept varied correct techniques that respect project constraints or have a justified exception. Omit trivial preference comments when they add noise; mark genuinely optional suggestions separately. Exact task logic, safety, confirmed local patterns and meaningful performance remain non-optional.

## Findings

For each finding include:

- **Severity and short title:** Critical for reachable catastrophic loss/security exposure; High for major financial, authorization, data-integrity, or availability failures; Medium for meaningful bounded incorrect behavior; Low for minor functional defects. Base severity on demonstrated impact and likelihood, not topic alone.
- For local-convention/file-ownership issues, use severity proportionate to the demonstrated requirement/maintenance impact. A confirmed project-rule breach may need correction even when logic passes; do not fabricate functional harm to fit a severity label or downgrade it to an optional preference merely because it is not a runtime bug.
- **Evidence:** changed file and narrow line range at the reviewed head; relevant directly connected caller/schema/test evidence when needed. Do not invent line numbers. Distinguish PR-introduced behavior from pre-existing conditions.
- **Pattern/file findings:** label the category as a local-convention, duplication or ownership issue. Cite the nearest comparable base file/helper and changed location, explain the missing responsibility/need or established pattern violated, and recommend the smallest coherent correction. Do not claim a bug or security/performance regression without evidence, automatically assign high severity to a new file, or require a fix just because it looks unfamiliar. Keep unresolved rationale questions separate from confirmed findings.
- **Trigger and impact:** concrete input, execution sequence, or safe reproduction; expected versus actual result and affected invariant. Do not claim a reproduction was run when it was only reasoned statically.
- **Confidence:** established defect versus hypothesis, with the missing fact needed to confirm a hypothesis. Keep questions and optional style suggestions separate from correctness blockers.
- **Recommendation:** describe the needed behavior without modifying code unless authorized.

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

- **Findings:** list confirmed defects and distinguish unresolved hypotheses; state whether verification is complete or still incomplete/non-passing.
- **No findings within checked scope:** use only for the inspected scope, name exclusions, and claim completed verification only when related safe tests finished successfully. This is not an unconditional approval or guarantee.
- **Blocked:** identify the missing revision, requirements decision, safe environment, permission, or test evidence that prevents the requested review from completing. If useful static review was possible, include its findings without implying completion.

Keep the next action specific: provide criteria, resolve a defect, authorize safe verification, or rerun a named check. Do not manufacture success to close the review.
