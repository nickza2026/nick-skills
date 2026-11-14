import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const rules = read('../references/existing-project-patterns.md');
const go = read('../../bootstrapping-go-backends/SKILL.md');
const debug = read('../../debugging-backend-issues/SKILL.md');
const http = read('../../bootstrapping-go-backends/references/api-contracts.md');

test('existing projects inspect closest active local code rather than forcing new-project defaults', () => {
  for (const required of ['nearest comparable working examples', 'same module/API family', 'active local convention', 'examples conflict', 'New-project stack defaults are not permission']) assert.ok(rules.includes(required), required);
});
test('consistency covers transport, middleware, validation, data access, naming and tests', () => {
  for (const required of ['naming', 'routing/adapters', 'middleware placement', 'validation/error handling', 'DB/transaction access', 'test conventions']) assert.ok(rules.includes(required), required);
});
test('the route example uses direct adapters for comparable new list/get routes', () => {
  assert.ok(rules.includes('m.Handle("POST /item.list", am.Handler(tracking.List))'));
  assert.ok(rules.includes('m.Handle("POST /item.detail", am.Handler(tracking.Get))'));
  assert.ok(rules.includes('Do not uniquely wrap those routes'));
  assert.ok(rules.includes('http.MaxBytesHandler(am.Handler(...), 4096)'));
  assert.ok(rules.includes('arbitrary 4 KiB cap can change accepted requests and error behavior'));
});
test('body limits and shared protections are not blanket-banned or removed for appearance', () => {
  assert.ok(rules.includes('not a ban on MaxBytesHandler or request limits'));
  assert.ok(rules.includes('already use an approved common wrapper/limit, follow it'));
  assert.ok(rules.includes('Inspect existing server/group/adapter protection'));
  assert.ok(rules.includes('Preserve existing shared guards'));
  assert.ok(rules.includes('A short route snippet alone proves neither'));
});
test('concrete necessary exceptions require evidence and authority, not imagined best practice', () => {
  assert.ok(rules.includes('observed correctness/security issue'));
  assert.ok(rules.includes('obtain approval before a material exception not already authorized'));
  assert.ok(rules.includes('Do not copy a known vulnerability'));
  assert.ok(rules.includes('arbitrary limits merely because they sound like a general best practice'));
});
test('improvements stay in-pattern and do not authorize blanket rewrites or style-only review gates', () => {
  assert.ok(rules.includes('Improvements within the established pattern are welcome'));
  assert.ok(rules.includes('unapproved codebase-wide cleanup'));
  assert.ok(rules.includes('do not reject another contributor'));
  assert.ok(rules.includes('sound technique solely because it looks different'));
});
test('Go scaffolding and debugging load the same existing-project policy before writing', () => {
  for (const text of [go, debug, http]) assert.ok(text.includes('initializing-agent-teams/references/existing-project-patterns.md'));
  assert.ok(go.includes('before writing'));
  assert.ok(debug.includes('rather than replacing them with a preferred framework'));
  assert.ok(http.includes('These are new-project defaults'));
});
test('policy separates guidance tests from mounted behavior and publication/native activation', () => {
  assert.ok(rules.includes('real mounted adapter/middleware path'));
  assert.ok(rules.includes('Do not substitute a source-shape check for an executed API test'));
  assert.ok(rules.includes('does not make internal pattern comparisons/provenance content for FE API handoffs'));
  for (const text of [rules, go, debug, http]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    assert.ok(text.endsWith('\n'));
  }
});
