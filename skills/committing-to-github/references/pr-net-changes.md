# PR summaries describe net delivered changes

Apply these rules to PR titles/descriptions and summary/progress comments, including updates to an existing PR. Keep them factual, concise and about the final deliverable relative to the actual target branch. Do not narrate experiments, rejected designs, draft endpoints, temporary files, reverted edits or the sequence of commits unless specifically asked about that history.

## Establish the comparison

1. Verify the PR's actual target branch/base SHA and final head SHA. Usually the base is main, but never substitute main when the PR targets another branch. Missing/stale base data is a verification gap, not permission to guess removal or compatibility claims.
2. Inspect the PR's net diff from its merge base to head (GitHub's usual three-dot comparison), not each commit's diff added together. For already verified refs, use `git merge-base <base> <head>` and `git diff <base>...<head>`; inspect actual route registration/contracts at the relevant before/after snapshots, not filenames alone. Uncommitted local edits are not part of a published PR head.
3. Cross-check claims against the current target base. A two-dot comparison with a branch behind its target can show target-only additions missing in head; those are **not PR deletions** unless this PR actually removes them in its net change. Conversely, a change already incorporated in the target is not a newly delivered feature simply because an old commit message says so. Report unresolved divergence/conflicts instead of silently rebasing, merging or inventing the final contract.
4. Use commit history to investigate a real surviving change or verify test evidence, not as the PR summary's source of truth. Omit canceled draft work; include every ready cross-task change that remains in the net result. Refresh the base/head comparison before updating summary text.

## Classify the final effect, not the draft history

| Verified target-base contract | Branch-local draft | Final PR effect | Summary |
|---|---|---|---|
| Route absent | Added, then removed | Still absent | No removal or breaking-change claim; omit the draft route |
| Route absent | Several rejected alternatives | New List/Get API remains | Describe the new List/Get contract, not the alternatives |
| Route present | Temporarily removed, then restored unchanged | No contract change | No removal, restoration or fix claim for that route |
| Route present | Any edits | This PR actually removes it | Describe the real removal and verified compatibility impact |
| Route present | File deleted/moved/renamed | Same mounted method/path still exists | Describe only a relevant internal change, not an API removal |
| Base unavailable or target advanced | Incomplete comparison | Effect not established | Report the evidence gap; do not guess |

For example, a new provisioning feature may end with List/Get only after draft status/timeline endpoints were tried and discarded. If the target base never had those draft endpoints, summarize the delivered List/Get API. Do not add "remove the separate status/timeline routes", "removed routes return 404", or "no longer supported" notes. Their absence is not a change to a base contract and does not call for an unrelated exclusions list.

A genuine deletion needs both evidence that the contract exists in the target base and a surviving PR change that removes it. Check method, mounted path, aliases and replacements; deleting a file or a temporary handler does not establish deletion of a public endpoint.

## Separate behavior evidence and publication safety

- Absence of a route does not prove HTTP 404. Auth middleware, method handling, aliases or fallback routing may produce another result. Cite an established contract or relevant safe mounted-route tests before asserting the observed status; never infer it from a deleted handler name. Do not call production to obtain examples.
- Keep actual executed test outcomes and material integration risks tied to the final diff. Do not invent migration/rollout warnings, client adjustments or "removed endpoint" tests for canceled drafts. If a reviewer explicitly asks about a discarded approach, answer that question briefly as branch-local history rather than changing the summary into a diary.
- A credential introduced and then deleted within a branch still matters. Inspect **every outgoing commit/object** for publication safety even when its content cancels out of the final net diff. Net-only summaries are not net-only secret scans and do not authorize history rewriting.
- Preserve explicit commit-only/push-only/no-PR scope. Editing these rules, drafting summary text or running local guidance tests does not authorize commits, push, live PR edits/comments, merging or deployment.
