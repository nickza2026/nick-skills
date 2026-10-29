# Pin Node Dockerfiles to verified security-patched releases

Apply this policy whenever creating/updating a **Node application Dockerfile** or a Node build stage, including frontend asset builders in otherwise non-Node deployments. Do not add Node to Go-only images, upgrade the host Node installation, or change GitHub action versions/internal runtimes as a side effect.

## Verified baseline: 2026-10-29

Use [the machine-readable baseline](../assets/node-security-baseline.json) and [the plain-JavaScript service example](../assets/dockerfiles/node-service.Dockerfile.example). The Node project's [release index](https://nodejs.org/dist/index.json), [October security advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases), [support schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json), and [official Docker image library](https://raw.githubusercontent.com/docker-library/official-images/master/library/node) were inspected directly.

| Existing/approved major | Latest release observed | October security floor | Verified exact-version Docker tag |
|---|---|---|---|
| 22 | 22.23.4 | 22.23.4 | `node:22.23.4-bookworm-slim` |
| 24 | 24.22.2 | 24.22.1 | `node:24.22.2-bookworm-slim` |
| 26 | 26.13.0 (newest LTS observed) | 26.12.1 | `node:26.13.0-bookworm-slim` |

The advisory covers DNS NUL-name handling, TLS hostname/IP validation, Brotli memory corruption, and other fixes; applicability differs by major. Follow its per-line release links, not one universal minimum across all majors. The release index's `security: false` means that release was not classified as a security release; a later release in the same supported line can still contain the earlier security fixes. Thus prefer current 24.22.2 over 24.22.1 and 26.13.0 over 26.12.1 when compatible, rather than deliberately pinning an older security-only release.

These are **dated observations**, not a perpetual claim of latest/no vulnerabilities. Official tags were found in the image library with amd64 support; no registry digest, image pull/build, dependency audit, or image vulnerability scan is established by that check.

## Mandatory selection before writing a Node FROM line

1. Inspect the target's `package.json` engines, framework/native-module support, package manager/lockfile, `.nvmrc`/tool-version files, current image, and deployment architecture. Preserve the existing compatible supported major. Do not silently upgrade across majors just because a newer LTS exists; get approval and validate compatibility first. For a new app, propose a supported LTS and confirm dependencies/major before rendering.
2. **Recheck official releases and security advisories at generation time**, even if this baseline was previously used. Select the newest stable release in the approved supported major that includes applicable fixes. Use exact numeric comparison of major/minor/patch, not lexicographic sorting or only the release's `security` boolean. Node 20 ended support on 2026-04-30; the helper's documented Node 20+ syntax minimum is not permission to recommend an EOL container runtime.
3. Confirm the selected exact-version image tag and required platform exist in the official image library/registry. Keep compatible OS/native ABI choices across stages. The bundled example uses bookworm-slim, not a mandate to switch an existing glibc/musl or Debian variant. If current release/security/image data cannot be verified, report the blocker and do not silently fall back to an older patch or claim it is latest.
4. Pin **every Node stage** to `node:<major>.<minor>.<patch>-<approved-variant>`. No `node:latest`, `node:lts`, `node:22`, `node:24`, major/minor-only, wildcard/range, or unversioned slim/alpine aliases. If using an ARG, its committed default and all supplied values must still resolve to the approved exact version. Use the same verified patch/ABI in Node build and runtime stages unless a reviewed framework-specific plan says otherwise.
5. Add `@sha256:<verified digest>` when required by project policy and actually resolved for the intended image/platform. A full version tag is still mutable (OS rebuilds); never fabricate a digest or call tag pinning byte-immutable. Updating OS packages does not upgrade the Node binary to a patched Node release.
6. Record source links/check date, chosen major/full version/variant, applicable security floor, compatibility decision, and blocked layers in the delivery plan. Update this baseline/example together when deliberately refreshing their published defaults; generating a target's files does not automatically authorize edits/publication of the shared skill repository.

## Use the example only for its demonstrated application shape

The service example assumes one npm package with `package-lock.json`, production JavaScript at `src/server.js`, no needed install lifecycle/native compilation, and no separate transpile/build step. It uses a lockfile-driven dependency stage and a non-root runtime with the same pinned base. It is **not** a universal Next.js, workspace, TypeScript, pnpm, or Yarn Dockerfile.

Inspect actual scripts and runtime output before adapting. Do not blindly disable required postinstall/native builds to copy `--ignore-scripts`, run unknown scripts with production credentials, or change package managers. If a build needs dev dependencies, use an inspected build stage and copy its actual output/production dependency closure; do not omit needed build tools before compilation. Respect private-registry secret mounts and native shared-library requirements. Do not copy `.npmrc`, auth-bearing Yarn config, `.env`, credentials, or the whole source tree into runtime. The default context exclusions protect auth-bearing configs; adapt non-secret settings explicitly rather than baking tokens into ARG/ENV/layers.

Keep `CMD`/`ENTRYPOINT` in exec form, `USER node` (or the reviewed non-root UID), actual asset paths, and confirmed listen address/platform port. `EXPOSE 8080` remains metadata, not service configuration. A frontend-only Node builder may have a different final runtime; do not add a Node runtime unnecessarily.

## Verification and non-effects

Validate exact-version references across all stages against the freshly checked plan, lockfile/package-manager behavior, build output/native ABI, non-root permissions, signals, and actual port/assets. Run relevant safe tests and an isolated image build/smoke/audit when available and authorized. Static baseline tests do not run Node 26, pull/build a container, audit npm/OS dependencies, or prove all CVEs absent.

This policy does not enable PR-test CI, change production services, install/update host Node, alter action tags/internal Node, commit/push changes, or deploy. Each remains under its existing approval boundary. Security evidence for a Node base does not waive dependency/OS scans or application review.
