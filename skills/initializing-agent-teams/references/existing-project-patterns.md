# Existing-project coding patterns

Apply this guidance when implementing or fixing code in an existing repository, with or without subagents. New-project stack defaults are not permission to introduce a second implementation style into an established codebase.

## Establish the local pattern before writing

Read trusted repository instructions and inspect the nearest comparable working examples in the same module/API family, including their tests. Follow their naming, file/package ownership, function shapes, routing/adapters, middleware placement, validation/error handling, DB/transaction access, dependency usage and test conventions. Prefer the active local convention over a different style elsewhere or an unrelated legacy example. If examples conflict, resolve the intended convention from project rules or ask narrowly rather than creating a third pattern.

Use existing helpers and shared boundaries. Do not add feature-specific wrappers, new layers/interfaces, dependencies, defensive guards or arbitrary limits merely because they sound like a general best practice. Improvements within the established pattern are welcome: clearer code, correct field validation, focused bug fixes and adequate tests. Do not turn a local feature task into an unapproved codebase-wide cleanup to make everything uniform.

For the Go pgsql baseline, the explicit [query construction convention](../../bootstrapping-go-backends/references/database-and-testing.md#query-construction) is pgctx for simple fixed SQL and pgstmt for complex/dynamic queries, not manual SQL concatenation. Apply it to new/changed queries even when older code concatenates SQL; preserve other local patterns and semantics rather than rewriting unrelated queries or migrating another DB stack.

## Route example: no unexplained per-feature body cap

If comparable RPC routes use direct adapters:

```go
m.Handle("POST /item.get", am.Handler(item.Get))
m.Handle("POST /item.stats", am.Handler(item.Stats))
```

New comparable list/get routes use the same pattern:

```go
m.Handle("POST /item.list", am.Handler(tracking.List))
m.Handle("POST /item.detail", am.Handler(tracking.Get))
```

Do not uniquely wrap those routes in `http.MaxBytesHandler(am.Handler(...), 4096)` without an explicit requirement, established project policy or a demonstrated need. An arbitrary 4 KiB cap can change accepted requests and error behavior; it is not a neutral style improvement. Inspect existing server/group/adapter protection before deciding another limit is needed. A short route snippet alone proves neither that the application lacks protection nor that all body limits are unnecessary.

This is **not a ban on MaxBytesHandler or request limits**. If comparable routes already use an approved common wrapper/limit, follow it. Preserve existing shared guards, configured limits and required validations. Do not remove them merely to imitate a less-protected example.

## Necessary exceptions and scope

- Require a concrete task requirement, observed correctness/security issue or established policy for a deviation. Explain the evidence, contract impact and smallest consistent solution; obtain approval before a material exception not already authorized by the task. Prefer the project's existing common boundary/helper instead of a one-off mechanism on the new feature.
- Do not copy a known vulnerability, omit required authorization/validation or weaken tests to preserve visual similarity. If safe correctness and the apparent pattern conflict, surface that conflict and resolve the focused fix rather than silently shipping unsafe code or an unapproved redesign.
- Keep the requested business behavior, actual API contract and existing safeguards. Never remove a demonstrated necessary protection or silently change limits/contracts under the label of consistency. Improvements do not authorize a new framework, generic architecture rewrite, global configuration change or publication.

## Verify consistency and behavior

Review the final change beside its comparable examples. Test through the real mounted adapter/middleware path when routing, auth, validation or decoding behavior matters; test necessary field/error/limit boundaries without using production. Do not substitute a source-shape check for an executed API test. For a new exception, verify its concrete rationale and approval, not an imagined threat or a preferred style.

Keep this authoring rule distinct from read-only review: do not reject another contributor's sound technique solely because it looks different, demand unrelated rewrites, or edit their code without authorization. Review correctness, explicit requirements and material risks pragmatically. This guidance also does not make internal pattern comparisons/provenance content for FE API handoffs or PR development diaries.
