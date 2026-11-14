import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const skill = read('../SKILL.md');
const template = read('../assets/frontend-api-handoff.md.tmpl');
const checklist = read('../references/contract-checklist.md');
const scenarios = read('../references/acceptance-scenarios.md');

test('skill separates reading reference examples from copying unrelated feature content', () => {
  assert.ok(skill.includes('for format and terminology only'));
  assert.ok(skill.includes('Do not compare an unrelated old feature'));
  assert.ok(skill.includes('Omit irrelevant exclusions'));
  assert.ok(skill.includes('does this sentence enable correct integration of this task'));
});
test('default template does not mandate UI screens, reuse provenance or unrelated exclusions', () => {
  assert.doesNotMatch(template, /## FE screens|Screen \/ control|UX_SUGGESTIONS|NAVIGATION_REFRESH|NON_FE_ENDPOINT_EXCLUSIONS|CLIENT_PURPOSE_AND_VERIFIED_LIMITATIONS|FE responsibility|FE handling|What changed \/ what FE must do/);
  assert.doesNotMatch(template, /^- \[ \]/m);
  assert.doesNotMatch(template, /Maintenance|copied from|reuse.*widget/i);
});
test('template keeps the actual endpoint request/response/error contract', () => {
  for (const required of ['METHOD_AND_PATH', '### Auth, permissions', '### Request', '### Successful response', '### Errors', 'Default / omission behavior', 'Validation / allowed values', 'HTTP status', 'EXACT_CODE', 'TYPE_AND_PRESENCE']) assert.ok(template.includes(required), required);
});
test('adoption notes are conditional on a real change to the affected existing contract', () => {
  assert.ok(skill.includes('only when an existing affected contract actually changes client usage'));
  assert.ok(template.includes('Existing contract changes (only if client adoption is required)'));
  assert.ok(scenarios.includes('Relevant contract change and safety are not filler'));
});
test('UI examples are optional and brief; frontend implementation remains autonomous', () => {
  assert.ok(skill.includes('FE chooses its implementation'));
  assert.ok(skill.includes('brief and clearly optional'));
  assert.ok(template.includes('Integration notes (optional)'));
  assert.ok(checklist.includes('Optional usage examples stay brief'));
  assert.ok(skill.includes('Do not append an adoption/integration checklist unless explicitly requested'));
  assert.ok(skill.includes('Prefer plain factual statements about the contract'));
  assert.doesNotMatch(skill, /Map endpoints and permissions to existing screens\/actions|Finish with a concrete FE integration checklist|state a verified not-applicable condition/);
});
test('concision preserves safety, nested fields and actual transport/error semantics', () => {
  for (const required of ['header.Idempotency-Key', 'stable idempotency key/action ID', 'allowed operation states', 'unknown/unavailable values from an actual zero measurement', 'fake/demo/simulated results', 'HTTP-200 domain failures', 'omitted, `null`', 'nested']) assert.ok(checklist.includes(required), required);
});
test('legacy Maintenance input and UI overprescription are covered as negative scenarios', () => {
  assert.ok(scenarios.includes('Unrelated legacy feature and reuse provenance'));
  assert.ok(scenarios.includes('no Maintenance comparison'));
  assert.ok(scenarios.includes('Frontend autonomy and concise optional examples'));
  assert.ok(scenarios.includes('FE chooses its implementation'));
});
test('author report handles non-FE coverage without default exclusion prose', () => {
  assert.ok(skill.includes('in the author/task report rather than automatically listing their exclusions'));
  assert.ok(skill.includes('only when it is genuinely needed'));
  assert.ok(skill.includes('Remove unrelated legacy references'));
});
test('all bundled documents are English source guidance with unique section headings', () => {
  for (const text of [skill, template, checklist, scenarios]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    const headings = text.split('\n').filter(line => /^## /.test(line));
    assert.equal(headings.length, new Set(headings).size);
    assert.ok(text.endsWith('\n'));
  }
});
