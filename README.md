# Nick Skills

Portable Agent Skills for working in Nick's style. Keep personal defaults separate from each target project's rules and requirements.

## Skills

| Skill | Use when |
|---|---|
| [designing-backend-systems](skills/designing-backend-systems/SKILL.md) | Discover detailed requirements, design simple extensible PostgreSQL-backed systems and normalized reusable data, consider Redis for justified high-RPS reads, and iterate on shareable DB diagrams with the team before implementation. |
| [bootstrapping-go-backends](skills/bootstrapping-go-backends/SKILL.md) | Create a Go backend repository that can contain multiple applications in one Go module, with shared packages, PostgreSQL, and the selected HTTP/job libraries. |
| [deploying-go-to-nortezh](skills/deploying-go-to-nortezh/SKILL.md) | Prepare per-application Dockerfiles, GHCR publishing, GitHub Actions, and Nortezh staging/production deployment templates without authorizing a live deployment. |
| [reviewing-backend-prs](skills/reviewing-backend-prs/SKILL.md) | Review backend diffs pragmatically with exact task logic, safe related tests, and isolated original/alternative measurements when useful; prioritize dangerous, financial, and material-performance defects without style gatekeeping. |
| [committing-to-github](skills/committing-to-github/SKILL.md) | Deliver ready cross-task changes on one fresh branch, prefer one commit or a small same-branch split, exclude credentials, and open a PR covering all shipped work; stop/report push or PR failure without hunting keys. |

The Go baseline is **one repository, one Go module, and as many application binaries as the requirements need**. It does not prescribe application names or require a user/admin pair. An application can be an API, worker, scheduler, or another backend executable.

Browsable lists support validated sorting. Pagination is selected per workload: exact totals are optional, and large lists can use count-free next-page navigation rather than an unconditional COUNT query.

This bundle provides instructions and references, not an executable project generator. The consuming AI must implement and test the target project.

## Use with an AI

Ask a file-capable AI to read the skill and its relevant references:

```text
Read skills/bootstrapping-go-backends/SKILL.md from this nick-skills bundle
and load the references needed for the task.

Create a backend at <target-path> with module path <module-path>.
The required applications are <application names and responsibilities>.
Use PostgreSQL where required. Do not add applications or integrations
that are not needed. Do not commit, push, or deploy.

Apply the skill's defaults unless the current task or target repository
explicitly requires something else. Report implemented files, actual
build/test results, and unverified or blocked checks.
If the skill or a required reference cannot be read, say so.
```

For an Agent Skills-compatible tool, install the **whole skill directory**, including its references, using that tool's supported mechanism. For a web chat, attach the files or use an available tool to retrieve them.

A public GitHub repository makes the source accessible; it does not make every AI load it automatically or continuously refresh it. Reload at task start and record the source revision when reproducibility matters.

## Boundaries

- Apply this Go baseline to new projects, not as permission to restructure an existing repository.
- Store authored skill documentation in English. Follow explicit task/repository requirements for the language of generated deliverables.
- Do not include source-system credentials, production configuration, business code, or SQL seeds.
- Consult the [source baseline](skills/bootstrapping-go-backends/references/source-baseline.md) for evidence, dependency versions, and deliberate adaptations.
- The original reference repository is not required to use the skill.
