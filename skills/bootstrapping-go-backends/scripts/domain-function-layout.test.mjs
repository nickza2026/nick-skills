import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const skill = read('../SKILL.md');
const layout = read('../references/domain-function-layout.md');
const api = read('../references/api-contracts.md');
const patterns = read('../../initializing-agent-teams/references/existing-project-patterns.md');
const scenarios = read('../references/acceptance-scenarios.md');

test('skill, API reference, and existing-project patterns link the layout rules', () => {
  for (const text of [skill, api]) assert.ok(text.includes('domain-function-layout.md'));
  assert.ok(patterns.includes('bootstrapping-go-backends/references/domain-function-layout.md'));
  assert.ok(skill.includes('Params, Valid, and Result directly above their operation'));
});
test('params, Valid, and Result sit directly above their operation in the domain file', () => {
  for (const required of ['Params, Valid, and Result sit directly above their operation', '`<Op>Params` struct', 'func (p *<Op>Params) Valid() error', 'Keep the operation in its domain file', '`types.go`']) assert.ok(layout.includes(required), required);
});
test('single-use logic stays inline and complexity requires asking first', () => {
  for (const required of ['Do not split single-use logic into extra functions', 'Two or more call sites', 'The user approved the extraction', 'Ask before adding complexity', 'stop and ask the user before writing it']) assert.ok(layout.includes(required), required);
});
test('Valid uses validator methods and rejects hand-written early-return checks', () => {
  for (const required of ['v.Must(', 'v.Mustf(', 'v.Add(', 'return v.Error()', 'return invalid()', 'p.ServerID == nil || *p.ServerID != uuid.Nil', 'never to return early']) assert.ok(layout.includes(required), required);
  assert.ok(scenarios.includes('Domain operations follow the layout and validator rules'));
});
test('authored layout guidance stays English and newline-terminated', () => {
  for (const text of [layout, skill, api, patterns, scenarios]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    assert.ok(text.endsWith('\n'));
  }
});
