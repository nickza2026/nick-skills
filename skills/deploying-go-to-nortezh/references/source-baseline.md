# Delivery source baseline

## Current workflow authority

On 2026-10-28 the user supplied `workflows-example/admin-staging.yaml`, `user-prod.yaml`, and `worker-staging.yaml` in the Nick Skills repository and explicitly requested this exact workflow shape. These **supersede** the previous reusable-workflow redesign. The source files remain read-only user artifacts; installed skills need no access to them because the portable template and normalized golden regressions carry the pattern.

| Example | Event | Target | Normalized SHA-256 (LF + one trailing newline) |
|---|---|---|---|
| admin-staging.yaml | manual + main push with paths | WebService | `ff04c987c3a9b0ed73a4c18aa7ce42d5b5d4a0ef72c80e0a78bfe104bc7c1c55` |
| user-prod.yaml | release published | WebService | `6cc521d3fd5aa074d4d3a9b5d6e1a4a835974dc94daf4e4a344824ff2c62a956` |
| worker-staging.yaml | manual + main push with paths | Worker | `545221a28039a4d12000719096b358bfd3abf6661064a1c126a777a2344a65d1` |

The renderer's fixtures reproduce these exact contents after newline normalization, including step order/action tags, two-job output wiring, secret references, short-SHA tags, and whether `port` is omitted. Concrete app names, Nortezh identities, secret names, and branch/event choices remain **examples**, not new-project defaults. The approved target configuration determines those values.

## Earlier evidence retained only where applicable

- Olufy-API commit `01731b564d56dfb72755fe9421515aafc894b3dc`, inspected read-only on 2026-10-22, informed the per-app Dockerfiles and root-module build approach.
- [Nortezh action v1.0.5](https://github.com/Nortezh/nortezh-action/tree/v1.0.5) action.yml/README were inspected for inputs: action, project, location, name, image, type, optional port, and `SA_AUTH_EMAIL`/`SA_AUTH_KEY`. `deployment.create-revision` may create a target if absent. Historical inspection is not current platform/runtime readiness evidence.
- The old shared verify/publish/deploy pipeline, main/manual-staging default, release-only-production default, env-variable destination mapping, run-unique tags, and action SHA pins are **not** the current template. Do not reintroduce them silently.

## Verification boundaries

Golden/renderer/YAML checks establish static fidelity and project-local file creation only. They do not validate account credentials, action availability, GHCR publication/pulls, protected environments, Docker builds, GitHub runs, or Nortezh deployments. Preserve Docker non-root/runtime/asset considerations without claiming the example pipeline implements gates that it does not contain.
