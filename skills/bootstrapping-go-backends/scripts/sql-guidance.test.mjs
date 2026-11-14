import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const skill = read('../SKILL.md');
const database = read('../references/database-and-testing.md');
const api = read('../references/api-contracts.md');
const patterns = read('../../initializing-agent-teams/references/existing-project-patterns.md');
const scenarios = read('../references/acceptance-scenarios.md');

test('main skill and API reference require pgctx for simple SQL and pgstmt for complex queries', () => {
  for (const text of [skill, api]) assert.ok(text.includes('pgctx for simple fixed SQL and pgstmt for complex/dynamic queries'));
  assert.ok(skill.includes('SQL implementation'));
  assert.ok(skill.includes('database-and-testing.md#query-construction'));
  assert.doesNotMatch(database, /or pgstmt as appropriate/);
});
test('dynamic SQL is built with pgstmt rather than string assembly or manual placeholder management', () => {
  for (const required of ['pgstmt for complex/dynamic queries', 'conditional filters/joins', 'string concatenation', 'fmt.Sprintf', 'strings.Builder', 'manual WHERE/SET fragment lists', 'incremented placeholder counters', 'not make manual structural assembly the requested pattern']) assert.ok(database.includes(required), required);
});
test('values remain bound and identifiers allowlisted even inside builder raw fragments', () => {
  assert.ok(database.includes('Bind every runtime value'));
  assert.ok(database.includes('Allowlist identifiers and sort directions'));
  assert.ok(database.includes("builder's raw fragment does not make it safe"));
  assert.ok(database.includes('Do not generate update column maps directly from client keys'));
});
test('builder queries preserve physical transaction context and use verified installed APIs', () => {
  for (const required of ['same pgctx context/physical transaction', 'use the callback context', 'Verify APIs against the installed pgsql version', 'do not invent builder methods', 'obtain approval for a focused exception', 'Test relevant predicate combinations']) assert.ok(database.includes(required), required);
});
test('fixed SQL remains valid and unsafe interpolation is distinct from a convention violation', () => {
  assert.ok(database.includes('A fixed parameterized SQL string is valid'));
  assert.ok(database.includes('Harmless compile-time literal formatting is not dynamic query assembly'));
  assert.ok(database.includes('not claim that every concatenated query is an SQL injection'));
  assert.ok(database.includes('Close rows and check iteration errors'));
});
test('explicit new-query rule overrides legacy concatenation without authorizing unrelated migrations', () => {
  assert.ok(database.includes('Older concatenation does not override it'));
  assert.ok(patterns.includes('Apply it to new/changed queries even when older code concatenates SQL'));
  assert.ok(scenarios.includes('SQL construction follows the explicit pgctx/pgstmt rule'));
  assert.ok(scenarios.includes('Do not migrate a different DB stack'));
  for (const text of [skill, database, api, patterns, scenarios]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    assert.ok(text.endsWith('\n'));
  }
});
