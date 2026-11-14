import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const baseline = JSON.parse(read('../assets/node-security-baseline.json'));
const example = read('../assets/dockerfiles/node-service.Dockerfile.example');
const policy = read('../references/node-security-pinning.md');
const version = value => {
  assert.match(value, /^\d+\.\d+\.\d+$/);
  return value.split('.').map(Number);
};
const compare = (a, b) => {
  const av = version(a), bv = version(b);
  for (let i = 0; i < 3; i++) if (av[i] !== bv[i]) return av[i] - bv[i];
  return 0;
};

test('dated Node baseline pins verified full versions per supported major, not one universal floor', () => {
  assert.equal(baseline.checkedOn, '2026-10-29');
  assert.deepEqual(Object.keys(baseline.lines), ['22', '24', '26']);
  const expected = { 22: ['22.23.4', '22.23.4'], 24: ['24.22.2', '24.22.1'], 26: ['26.13.0', '26.12.1'] };
  for (const [major, line] of Object.entries(baseline.lines)) {
    assert.deepEqual([line.version, line.securityFloor], expected[major]);
    assert.equal(version(line.version)[0], Number(major));
    assert.equal(version(line.securityFloor)[0], Number(major));
    assert.ok(compare(line.version, line.securityFloor) >= 0);
    assert.equal(line.image, `node:${line.version}-bookworm-slim`);
    assert.ok(line.supportEnds > baseline.checkedOn);
    assert.equal(line.releaseNotes, `https://nodejs.org/en/blog/release/v${line.version}`);
    assert.equal(line.securityReleaseNotes, `https://nodejs.org/en/blog/release/v${line.securityFloor}`);
  }
});
test('security evidence links are official releases/advisory/support/image sources', () => {
  assert.equal(baseline.sources.releases, 'https://nodejs.org/dist/index.json');
  assert.equal(baseline.sources.securityAdvisory, 'https://nodejs.org/en/blog/vulnerability/october-2026-security-releases');
  assert.equal(baseline.sources.supportSchedule, 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json');
  assert.equal(baseline.sources.officialImages, 'https://raw.githubusercontent.com/docker-library/official-images/master/library/node');
});
test('every Node FROM stage uses the same exact version recorded in the baseline', () => {
  const from = [...example.matchAll(/^FROM (\S+) AS (\w+)$/gm)];
  assert.equal(from.length, 2);
  const selected = baseline.lines[String(baseline.exampleMajor)];
  assert.ok(selected);
  for (const row of from) {
    assert.equal(row[1], selected.image);
    assert.match(row[1], /^node:\d+\.\d+\.\d+-[a-z0-9-]+$/);
    assert.doesNotMatch(row[1], /latest|:lts|\*|\^|~/);
  }
});
test('Node example is an explicit npm/plain-JavaScript shape with lockfile and non-root exec runtime', () => {
  assert.match(example, /COPY package\.json package-lock\.json \.\//);
  assert.match(example, /RUN npm ci --omit=dev --ignore-scripts && mkdir -p node_modules/);
  const runtime = example.slice(example.indexOf(' AS runtime'));
  assert.match(runtime, /ENV NODE_ENV=production/);
  assert.match(runtime, /COPY --from=dependencies --chown=node:node \/app\/node_modules/);
  assert.match(runtime, /COPY --chown=node:node src \.\/src/);
  assert.match(runtime, /^USER node$/m);
  assert.match(runtime, /^CMD \["node", "src\/server\.js"\]$/m);
  assert.doesNotMatch(runtime, /^COPY \.|\.npmrc|\.env|^RUN /m);
});
test('policy requires live recheck, compatible major approval, and honest security limitations', () => {
  const prose = policy.replaceAll('**', '');
  for (const required of [
    'Recheck official releases and security advisories at generation time',
    'Do not silently upgrade across majors', 'cannot be verified', 'do not silently fall back',
    'security: false', 'full version tag is still mutable', 'never fabricate a digest',
    'Node 20 ended support on 2026-04-30', 'not a universal Next.js',
    'required postinstall/native builds', 'do not run Node 26', 'does not enable PR-test CI',
  ]) assert.ok(prose.includes(required), required);
});
test('skill loads Node pinning before generation, without adding Node to Go-only examples', () => {
  const skill = read('../SKILL.md');
  assert.ok(skill.includes('references/node-security-pinning.md'));
  assert.ok(skill.includes('assets/node-security-baseline.json'));
  assert.ok(skill.includes('pin **all Node FROM stages to exact major.minor.patch**'));
  for (const file of ['api-swagger.Dockerfile.example', 'worker.Dockerfile.example']) {
    assert.doesNotMatch(read(`../assets/dockerfiles/${file}`), /^FROM node:/m);
  }
});
test('Node context exclusions protect auth configs while preserving dependency manifests', () => {
  const ignore = read('../assets/dockerignore.tmpl').split('\n');
  assert.ok(ignore.includes('**/.npmrc'));
  assert.ok(ignore.includes('**/.yarnrc.yml'));
  assert.ok(!ignore.some(rule => /^(?:\*\*\/)?package(?:-lock)?\.json$/.test(rule)));
});
