---
name: committing-to-github
description: "Prepares authorized commits, pushes and PRs in Nick's workflow: one fresh delivery branch, ready cross-task changes, concise commits and credential checks across content/history. Writes PR titles, descriptions and summary comments from final net changes against the verified target base, not discarded branch drafts or commit-message diaries. Never calls a branch-only add-then-remove a base removal. Uses actual test evidence; stops on push/PR failure without auth repair. Use for authorized Git publication or PR summary authoring/updates. Skill authoring grants no publication permission."
---

# Commit, Push, and Open a GitHub PR

On first project use, follow [agent setup](../initializing-agent-teams/SKILL.md) when available. The parent asks once before configuration/model changes; delegated children do not initialize again. Missing, declined, or non-interactive setup does not block the task or force delegation.

Create **one new topic branch for the delivery batch** before committing or pushing. Include other ready-to-publish changes that need to ship, even when they belong to a different task. Prefer one consolidated commit; two commits are acceptable when they make the work clearer, but keep them on the same branch. Do not split branches merely because the changes have different feature/fix labels.

For example, a batch on `feat/feature-B` may also contain the ready `fix/feature-A` changes. The branch name is not a filter that excludes feature-A. This preference does not mean staging every dirty file: still exclude credentials, temporary/generated junk, unfinished work, and changes explicitly marked not for publication.

## Authority and non-negotiable boundaries

- Distinguish editing from publication authority. For an authorized full commit/publish workflow, follow the user's preference to open a PR after push succeeds. Honor narrower instructions: commit-only means no push/PR, explicit push-only or no-PR means no PR, and an existing PR should not be duplicated. Deployment/merge remains separately authorized. Loading or authoring this skill grants no publication permission by itself.
- Follow current task, repository, and tool/harness safety constraints. Keep authored skill documentation in English; follow the requested language/style for user communication and commit messages.
- Never commit or push credentials, tokens, private keys, service-account files, populated environment files, or credential-bearing URLs. A broad push request does not waive this rule.
- Use existing configured Git authentication only. Do not search for keys/tokens or change authentication to make a push succeed.
- Read [Git and credential safety](references/git-safety.md) before staging/pushing. Use [acceptance scenarios](references/acceptance-scenarios.md) to check behavior before reporting completion.
- If the active harness actually provides a commit-specialist subagent, delegation is optional, not a universal requirement. Give it the exact scope and message/verification constraints; the parent verifies its command result, final Git message, and remaining status. Do not fabricate a `git-commit` agent where none exists or commit again when a delegated commit may already have succeeded.

## Workflow

### 1. Inspect the exact batch

Confirm the repository, instructions, current branch, index, worktree changes, and intended GitHub remote. Inspect Git status, staged/unstaged diffs, and recent commit messages before staging. Use bounded status output without `-uall`; handle an unborn repository's missing HEAD/history explicitly.

Identify the delivery batch, including existing staged changes and other safe, ready changes that need to be uploaded. Do not leave out an eligible fix just because the current task or branch names another feature, and do not ask for a separate branch/approval solely because the change is from a different task.

Distinguish deliverables from **reference-only inputs**. Files supplied to illustrate a pattern are not automatically ready for publication, even under a broad commit/push request. Exclude raw reference directories, customer/project-specific examples, and real deployment identities unless the user explicitly approves publishing those artifacts; publish only the intended generic/sanitized skill outputs. Preserve excluded local inputs unless deletion is requested.

Inspect readiness, ownership, and publication intent rather than topical similarity. Preserve excluded, unfinished, or genuinely ambiguous work and existing commits. If it is unclear whether a change is ready or intended for publication, ask about that concrete uncertainty. Stage explicit inspected paths instead of using broad `git add .` or `git add -A`.

Review available test/check evidence and comply with required safe verification. Do not invent successful checks or expand a Git-only task into unauthorized source changes or command execution. Respect an active harness that restricts commit preparation to Git commands.

### 2. Create a fresh topic branch

Prefer a new branch in the primary checkout from the verified main/default branch, preserving the prepared work. Determine the actual default rather than assuming its name. Do not create an extra worktree merely for committing this batch.

Use a descriptive, unused branch name and create it **before the first new commit and before any push**. Reuse this branch for all commits in the delivery batch; do not create a second branch for an included fix or a second commit. When the working tree is already based on the correct branch, `git switch -c <topic>` preserves its prepared changes. Adapt placeholders; do not run angle-bracket examples literally.

If prepared changes or existing commits are based elsewhere, do not silently switch to main, rebase, cherry-pick, squash, or drop history to satisfy the preference. Check ancestry and explain/resolve the base decision first. A new branch does not erase unrelated ancestor commits. Handle an unborn repository as an initial topic branch without inventing a main commit.

Honor an explicit instruction to continue a specified existing branch instead of silently creating another. If nothing needs committing, do not create an empty commit just to exercise this workflow.

### 3. Stage and inspect the batch on the same branch

Stage explicit inspected paths from the delivery batch, including eligible cross-task changes. Inspect the complete resulting staged diff, including previously staged content, deletions, generated files, and binary/LFS content. Check for accidental credentials and verify staged paths/checks before committing; filenames or ignore rules alone are insufficient.

Prefer one concise message summarizing the whole batch, including its feature and fix work, following the repository's style; do not impose another project's emoji or commitlint convention. A small split, such as two commits for clarity, is allowed on the same branch; do not force one commit per file/task or create another branch. Inspect each staged subset and its verification needs if splitting. Do not squash previous commits to manufacture a single history entry. Preserve required **commit-command input** attribution, trailers, signing, and hooks; a trusted local policy may impose a different **stored-message** format. Read [commit input, guards, and stored-message verification](references/git-safety.md#commit-input-guards-and-stored-message-verification) before diagnosing a conflict.

Create a **new** commit. Do not amend unless explicitly requested. Keep staging/checks in prior tool calls; if a verified local guard requires the tool command to start with `git commit`, issue one ordinary direct commit command in that form rather than prepending status/diff/staging. This is conditional on observed guard behavior, not a cross-harness command rule. If a call is denied, verify whether any command actually executed before calling it a hook failure. If a hook did fail, require the executed command/error and current HEAD, then fix only authorized issues. A failed attempt does not justify amending an older commit, omitting required command-input attribution, skipping hooks, changing configuration, or trying a different executor to evade a denial.

Use actual multiline strings when needed. In PowerShell, do not accidentally store literal `\n` sequences as message separators. After the attempt, verify the exit result and HEAD, read the **stored** message with `git log -1 --format=%B`, and run status after the commit completes. A clean stored message alone does not prove which guard ran; a successful shell exit alone does not prove the stored message satisfied repository policy. If the attempt was genuinely denied, stop agent-side retries and report the exact state for a human decision.

### 4. Review the outgoing payload and push only if authorized

Inspect every commit/object change that the proposed ref update would newly publish, not only the latest diff. Compare against the intended remote ref/base where available; for a first push, consider all reachable local history not already published. Treat unknown remote state as unknown, not evidence of a clean range.

If credentials exist anywhere in that outgoing history, **stop before pushing**. Removing a secret in a later commit does not remove it from history. Request approved remediation; do not rewrite history, rotate credentials, or push first and clean up later.

Push only the explicit topic branch to the verified intended remote, using ordinary upstream setup when appropriate. Do not push main/default directly, all branches, tags, a mirror, deletion refs, or force updates unless separately and explicitly authorized under applicable safety rules.

### 5. Check the push outcome; stop on failure

Capture the actual push exit/error result. On the **first failed push**, stop and report the branch, local commit, redacted error, and what remains local. Do not retry automatically, hunt credentials, switch HTTPS/SSH, change remotes, change Git configuration, or run an authentication repair flow.

An authentication failure, remote rejection, hook rejection, network failure, or non-fast-forward is not permission to force through. If a connection failed after remote acceptance might have occurred, report remote status as uncertain rather than claiming it is definitely absent. Any follow-up verification/repair must use approved access, not credential discovery.

### 6. Open the PR and describe final net changes

After a successful authorized full publish, use an available, already configured GitHub interface to open a PR from the same delivery branch to the verified intended base. Do not create a second branch for the included fix. Reuse a known existing PR rather than creating a duplicate; preserve other contributors' description content when updating it.

Before writing a PR title, description or summary comment, read [net-change summary rules](references/pr-net-changes.md). Verify the actual target base and final head, inspect the PR's complete net diff, and describe **only surviving delivered changes relative to that base**. Include both feature-B and fix-A when both remain in the net diff, not just the last commit or the branch label. Commit history may help investigate evidence, but the summary is not a union of commit messages or a development diary.

Do not describe a draft route/field/file added and removed within the same unmerged branch as a deletion, breaking change or compatibility change if it never existed in the target base. If the final new API is List/Get only, describe that API; omit abandoned status/timeline routes and speculative "removed routes return 404" claims. A removal requires a base contract that this PR actually removes; renames/moves and unrelated target-branch changes are not automatically API removals. Verify mounted behavior/tests separately before asserting an HTTP status.

Apply the same rule when updating an existing PR description or posting a progress/summary comment: recompute the current net result and remove stale draft claims rather than appending iteration history. A direct reviewer question can need a concise explanation of an intermediate decision, but label it as branch-local work, not a change to main's contract. Never alter another contributor's comments or a live PR merely because this skill was edited.

Include actual verification outcomes and only relevant integration/rollout constraints. Follow repository templates and [the body template](assets/pull-request-body.md.tmpl); replace tokens and remove empty/irrelevant sections, draft alternatives, unrelated exclusions and speculative compatibility notes. Do not invent tests, ticket links, requirements or behavior. Net-only summary wording does **not** weaken the all-outgoing-history credential scan in step 4.

If PR creation is unavailable or fails for any reason, **stop and report it**. Do not install a new client, hunt credentials, run login, change authentication, switch accounts/remotes, or repeatedly retry/fallback to force it through. If the command may have created a PR before a connection failure, report uncertainty and do not create another blindly.

Report the single branch, new commit hash or hashes, included scope, push outcome, and actual PR URL when returned/verified. Clearly distinguish committed, pushed, and PR-opened states. If the push succeeded but PR creation failed, say that the branch is on GitHub but no PR was confirmed. For commit-only work, say it was not pushed. An open PR is not merge approval or deployment success; do not merge or deploy automatically.
