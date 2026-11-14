import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const skill = read('../SKILL.md');
const rules = read('../references/pr-net-changes.md');
const safety = read('../references/git-safety.md');
const scenarios = read('../references/acceptance-scenarios.md');
const template = read('../assets/pull-request-body.md.tmpl');

test('PR title, description and summary comments use final net changes rather than commit diaries', () => {
  assert.ok(skill.includes('references/pr-net-changes.md'));
  assert.ok(skill.includes('only surviving delivered changes relative to that base'));
  assert.ok(skill.includes('not a union of commit messages or a development diary'));
  assert.ok(skill.includes('updating an existing PR description or posting a progress/summary comment'));
});
test('branch-local add-then-remove is not a target-base deletion or breaking change', () => {
  assert.ok(rules.includes('| Route absent | Added, then removed | Still absent |'));
  assert.ok(rules.includes('No removal or breaking-change claim; omit the draft route'));
  assert.ok(skill.includes('if it never existed in the target base'));
  assert.ok(scenarios.includes('Branch-local endpoints added and removed before merge'));
});
test('new List/Get contract is summarized without abandoned status/timeline routes', () => {
  assert.ok(rules.includes('Describe the new List/Get contract, not the alternatives'));
  assert.ok(skill.includes('describe that API; omit abandoned status/timeline routes'));
  assert.ok(scenarios.includes('neither route existed in the target base'));
});
test('genuine removal is distinguished from route movement and unchanged restoration', () => {
  assert.ok(rules.includes('This PR actually removes it'));
  assert.ok(rules.includes('Same mounted method/path still exists'));
  assert.ok(rules.includes('Temporarily removed, then restored unchanged'));
  assert.ok(rules.includes('not an API removal'));
  assert.ok(scenarios.includes('Real target-base route removal versus file movement'));
});
test('HTTP404 claims need mounted behavior evidence, not inferred absence', () => {
  assert.ok(rules.includes('Absence of a route does not prove HTTP 404'));
  assert.ok(rules.includes('Auth middleware, method handling, aliases or fallback routing'));
  assert.ok(rules.includes('relevant safe mounted-route tests'));
  assert.ok(rules.includes('Do not call production'));
});
test('scope uses the actual target and PR net diff without interpreting target-only additions as deletions', () => {
  for (const required of ['actual target branch/base SHA and final head SHA', 'git diff <base>...<head>', 'two-dot comparison', 'not PR deletions', 'Uncommitted local edits are not part', 'Missing/stale base data']) assert.ok(rules.includes(required), required);
});
test('all-outgoing-history secret scans survive net-only summary rules', () => {
  assert.ok(skill.includes('Inspect every commit/object change'));
  assert.ok(skill.includes('all-outgoing-history credential scan in step 4'));
  assert.ok(rules.includes('every outgoing commit/object'));
  assert.ok(scenarios.includes('A canceled change can still leak a credential'));
  assert.ok(safety.includes('Keep all-outgoing-history credential scans unchanged'));
});
test('PR template requests surviving delivered changes, not an iteration changelog', () => {
  for (const required of ['VERIFIED_TARGET_BASE_NOT_BRANCH_HISTORY', 'SURVIVING_FEATURE_ADDITIONS', 'NOT_CANCELED_DRAFT_EDITS', 'OMIT_CANCELED_DRAFTS_AND_SPECULATIVE_HTTP_STATUSES', 'ACTUAL_CHECKS_RESULTS']) assert.ok(template.includes(required), required);
  assert.doesNotMatch(template, /__ALL_INCLUDED_FEATURES__|__ALL_INCLUDED_FIXES__/);
  assert.ok(skill.includes('Include both feature-B and fix-A when both remain in the net diff'));
});
test('summary guidance preserves authority and English portable artifacts', () => {
  assert.ok(rules.includes('does not authorize commits, push, live PR edits/comments'));
  assert.ok(skill.includes('Never alter another contributor'));
  for (const text of [skill, rules, safety, scenarios, template]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    assert.ok(text.endsWith('\n'));
  }
});
