# Review flow

## Establish immutable scope

- Obtain repository, PR number or URL, target branch, exact base SHA, exact head SHA, and current PR diff through the host's read-only interface or Git metadata. Record the comparison semantics: use the PR merge-base-to-head diff, not an arbitrary local branch diff. Inspect changed file list and complete patches, including deletions, migrations, lockfiles, and test changes.
- Verify fetched metadata and source agree. Recheck the PR head before final reporting; if it moved, review and test the new head or clearly mark results stale. Do not claim coverage of unseen changes.
- Inspect checkout status before any operation. Never reset, clean, stash, switch branches, or overwrite dirty files. Prefer reading Git objects or host content; use a separately authorized isolated workspace when execution requires one. Record any local modifications that prevent testing the exact head. Do not conflate local edits with PR changes.
- If exact revisions or the full diff cannot be recovered, state what is unavailable and mark the affected review blocked. Do not substitute a guessed base or stale checkout.

## Establish requirements

- Read supplied task text, acceptance criteria, PR description, and relevant attachments. If absent, ask the single requirements question in SKILL.md and await confirmation before choosing correctness-only mode.
- Use an available authorized integration or ordinary accessible task content; do not assume ClickUp tooling exists. If a supplied URL is inaccessible, say so and request pasted criteria or attachments. Mark requirements verification blocked/pending unless the user confirms no task exists.
- Map each available criterion to changed backend behavior, ordering, and verification evidence. Require exact task-logic conformance, including relevant conditions, boundaries, permissions, state transitions, and required ordering. A generally reasonable alternative business behavior is not acceptable if it contradicts the supplied task. Do not invent product expectations; distinguish ambiguous criteria as questions rather than silently relaxing or redefining them.
- With confirmed no requirements, omit business-flow conformance claims. Still trace technical order: validation and authorization before mutation, awaited work before dependent reads, transaction boundaries, commits, events, retries, and error propagation.
- Established local conventions and added-file ownership remain technical review checks, including when business requirements are pending or confirmed absent. Do not invent product requirements to justify them or claim business-flow verification from a consistency check.

## Inspect the changed behavior

Start at each changed entry point (route, service, worker, migration, or webhook). Follow inputs through validation, authorization, transformations, database reads/writes, external calls, responses, and failure paths. Read only directly relevant callers, dependencies, schema, contracts, and tests needed to establish impact. Do not audit or refactor unrelated code; mention unrelated observations separately only if necessary for immediate safety.

Check null/missing input, boundary values, ownership, permissions, state transitions, async ordering, stale reads, timeouts, resource cleanup, compatibility, and rollback behavior. Confirm findings are introduced or exposed by the PR rather than merely pre-existing. Use narrow existing-code context to prove the link.

Evaluate the actual technique on its semantics and relevant workload, not whether it is familiar. Verify an unfamiliar API/pattern from directly relevant code or authoritative documentation when necessary. Do not demand a rewrite, a preferred architecture, or new benchmarks merely to make a sound approach resemble the reviewer's habits. Preserve explicit repository constraints, but distinguish them from personal preferences.

For credible major performance concerns, establish the input size, call frequency, query volume, loop bounds/termination, and changed hot path. Use targeted safe evidence when needed; do not perform a broad performance audit or treat every nested loop/extra query as a blocker. See review calibration for the distinction between demonstrated risk and optional tuning.

When a concrete trade-off remains uncertain, compare the relevant original code with the proposed alternative in a separate inspected harness. Preserve equivalent behavior, use the same representative workload/environment, and measure before claiming one is better. Keep scratch files outside the reviewed tree, or in a verified ignored directory when allowed; do not commit or modify PR code to run the comparison. Apply the safety and evidence rules in isolated-comparisons.md.

## Check local pattern continuity and file ownership

- Select the closest comparable code in the same module/API family from the target base and trusted project rules. Do not use an unrelated legacy area, the reviewer's habits or a convention newly asserted by the PR itself as the baseline. Respect independently approved migrations/exceptions and explicit current requirements such as pgctx/pgstmt selection.
- Compare the changed route/adapter, middleware placement, validation/error shape, DB/transaction access, naming, package ownership and tests. Actively look for unexplained wrappers, limits, new layers/dependencies and duplicated helpers. A sound technique used elsewhere does not automatically justify a second pattern in this project.
- Inspect every added file and distinguish a genuinely new responsibility from a rename/move. Trace its callers, imports and tests: what owns it, what behavior needs it, and could the existing natural owner/helper contain the change without losing cohesion? Prefer extending a fitting existing file over splitting trivial forwarding/glue into new files merely for appearance.
- Require a concrete reason for a new file, such as a distinct domain/application boundary, required regression/fixture, necessary migration or evidenced cohesive separation. Do not forbid new files, impose a file-count/line threshold, merge unrelated responsibilities just to reduce file count, or omit necessary tests. A rationale evident from source/task is sufficient; do not demand a boilerplate PR justification for every file.
- For a finding, cite the changed head location, comparable base code/owner and the actual local rule or duplication. Explain the missing responsibility or unjustified deviation and its concrete contract/maintenance impact. Do not invent a runtime failure, SQL injection or measured slowdown to make a consistency concern sound severe. If the reason cannot be established, ask a focused question rather than assert that no reason exists.
- Treat a demonstrated breach of confirmed local conventions or unjustified fragmentation as a requirement/maintainability finding, not automatically optional personal taste. Accept a justified in-pattern improvement or approved exception; do not copy known defects or remove necessary protection to make code look uniform. Keep unrelated existing style out of scope and do not edit, delete or reorganize PR files during review.

## Verify safely

1. Identify related tests and expected behavior from the changed paths and supplied criteria. Inspect their source, test runner configuration, package/task scripts, setup/teardown, dependency lifecycle hooks, environment loading, and reachable side effects before execution or installation. Treat build, lint, and test commands as potentially executable PR code.
2. Choose focused existing unit/integration tests with synthetic data, mocks, disposable local resources, and no production credentials or real provider calls. Isolated fixture setup/migrations and synthetic ledger/balance changes are valid verification when their safety is established. Do not execute migrations or destructive/payment/credit mutations against shared or live systems. Request permission before starting external runtime services; permission does not authorize production or real-money execution.
3. Run authorized safe checks and wait until each command terminates. Record command, workspace head, exit code, and outcome. A started/background process or partial log is not completion. On hang or unsafe behavior, stop safely and report incomplete verification.
4. If no relevant tests exist, describe missing cases. Do not silently add tests or fixes to the reviewed project. A safe isolated correctness/comparison harness can support a specific finding without changing the PR, but it does not establish all missing coverage or waive required tests. If dependencies, environment, permission, or safety prevent verification, report blocked/unrun, never passed.
5. Treat CI results as separate evidence tied to their actual SHA and job: green CI is not proof of local execution, coverage of missing cases, or completion of unrun checks.
