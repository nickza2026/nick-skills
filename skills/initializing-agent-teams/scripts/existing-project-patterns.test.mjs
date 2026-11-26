import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relative => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
const rules = read('../references/existing-project-patterns.md');
const go = read('../../bootstrapping-go-backends/SKILL.md');
const debug = read('../../debugging-backend-issues/SKILL.md');
const http = read('../../bootstrapping-go-backends/references/api-contracts.md');
const review = read('../../reviewing-backend-prs/SKILL.md');
const flow = read('../../reviewing-backend-prs/references/review-flow.md');
const calibration = read('../../reviewing-backend-prs/references/review-calibration.md');
const reporting = read('../../reviewing-backend-prs/references/reporting.md');

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

test('review actively compares local patterns and every added file, not just correctness or novelty', () => {
  assert.ok(review.includes('nearest comparable target-base implementation'));
  assert.ok(review.includes("Inspect every added file's responsibility"));
  assert.ok(review.includes('A confirmed local pattern requirement is not merely personal style'));
  assert.ok(rules.includes('Apply pattern and file-ownership checks during read-only review too'));
});
test('new files need a concrete responsibility and a check against the existing natural owner', () => {
  assert.ok(rules.includes('Before creating a file, identify its concrete responsibility'));
  assert.ok(flow.includes('could the existing natural owner/helper contain the change'));
  assert.ok(flow.includes('splitting trivial forwarding/glue'));
  assert.ok(flow.includes('Inspect every added file'));
});
test('unjustified local drift and duplicate helpers are findings without invented runtime defects', () => {
  assert.ok(flow.includes('Treat a demonstrated breach of confirmed local conventions'));
  assert.ok(flow.includes('not a merge blocker on convention alone'));
  assert.ok(calibration.includes('three forwarding/helper files'));
  assert.ok(calibration.includes('new helper/file duplicates an existing owner'));
  assert.ok(reporting.includes('never invent runtime defects to elevate a pattern or coverage concern'));
});
test('justified new domains, tests, migrations and cohesive separation remain valid', () => {
  for (const required of ['distinct domain/application boundary', 'required regression/fixture', 'necessary migration', 'evidenced cohesive separation']) assert.ok(flow.includes(required), required);
  assert.ok(flow.includes('Do not forbid new files'));
  assert.ok(flow.includes('file-count/line threshold'));
  assert.ok(flow.includes('or omit necessary tests'));
});
test('unclear rationale is a question and does not require a per-file PR essay', () => {
  assert.ok(flow.includes('ask a focused question rather than assert that no reason exists'));
  assert.ok(flow.includes('do not demand a boilerplate PR justification for every file'));
  assert.ok(calibration.includes('missing PR prose alone does not prove an unnecessary file'));
});
test('pattern review remains read-only and uses actual target-base evidence', () => {
  assert.ok(flow.includes('the changed head location, comparable base code/owner'));
  assert.ok(flow.includes('do not edit, delete or reorganize PR files during review'));
  assert.ok(review.includes('do not fix code, add tests to the reviewed project'));
  assert.ok(flow.includes('or a convention newly asserted by the PR itself'));
});
test('project consistency is separate from personal taste, security necessity and business verification', () => {
  assert.ok(review.includes('Preserve necessary correctness/security protections and approved exceptions'));
  assert.ok(calibration.includes('no personal-style blocker'));
  assert.ok(flow.includes('including when business requirements are pending or confirmed absent'));
  assert.ok(reporting.includes('Keep unresolved rationale questions separate from confirmed findings'));
});
test('review checks reuse English bundled guidance without relaxing verification or source boundaries', () => {
  assert.ok(review.includes('Complete related safe tests against the identified head'));
  assert.ok(review.includes('never give unconditional approval'));
  for (const text of [review, flow, calibration, reporting]) {
    assert.doesNotMatch(text, /[\u0e00-\u0e7f]|\uFFFD/);
    assert.ok(text.endsWith('\n'));
  }
});

test('review uses four action dispositions separate from severity and confidence', () => {
  for (const label of ['Must fix', 'Recommend fix', 'Recommend test', 'Team review']) {
    assert.ok(review.includes(label), label);
    assert.ok(reporting.includes(`[${label}]`), label);
  }
  assert.ok(reporting.includes('separate axes'));
  assert.ok(reporting.includes('Do not use a severity score alone to communicate merge blocking'));
});
test('correct pattern-only differences and unnecessary files are nonblocking recommendations', () => {
  assert.ok(reporting.includes('use Recommend fix regardless of whether the convention is established'));
  assert.ok(rules.includes('a coding convention alone does not make it a merge blocker'));
  assert.ok(calibration.includes('With correct behavior, cite the peer/helper and classify Recommend fix'));
  assert.ok(reporting.includes('This item alone does not block merge'));
});
test('coverage gaps use Recommend test without inferring a nonexistent correctness failure', () => {
  assert.ok(reporting.includes('Missing coverage is Recommend test, not a correctness failure by itself'));
  assert.ok(reporting.includes('exact uncovered scenario, expected assertions'));
  assert.ok(calibration.includes('Correct-looking pagination lacks empty-page and invalid-cursor cases'));
  assert.ok(reporting.includes('without duplicating the same defect as another blocker'));
});
test('executed failing tests and broken test compilation are Must fix rather than coverage advice', () => {
  assert.ok(review.includes('Executed failing tests, including broken test compilation, are **Must fix**'));
  assert.ok(reporting.includes('An executed failing test is Must fix even if production behavior is not yet proven wrong'));
  assert.ok(reporting.includes('do not downgrade a known failing test to a recommendation'));
  assert.ok(reporting.includes('without weakening assertions'));
});
test('blocked or unrun execution is disclosed without invented test failure or false pass', () => {
  assert.ok(reporting.includes('blocked verification, not an invented assertion failure'));
  assert.ok(reporting.includes('Record pre-existing/unknown origin honestly'));
  assert.ok(flow.includes('Permissions/environment that prevent meaningful execution are blocked/unrun verification'));
  assert.ok(reporting.includes('do not claim a reproduction was run') || reporting.includes('Do not claim a reproduction was run'));
});
test('Team review identifies an owner, question, options and explicit decision timing', () => {
  assert.ok(reporting.includes('decision owner by role'));
  assert.ok(reporting.includes('options/trade-offs and missing facts'));
  assert.ok(reporting.includes('decision before merge'));
  assert.ok(reporting.includes('follow-up decision'));
  assert.ok(calibration.includes('whether cancellation refunds immediately or only after provider confirmation'));
});
test('rare PostgreSQL bounds are evidence-based without demoting reachable overflow or money errors', () => {
  for (const required of ['2,147,483,647', 'Values outside the range are rejected', 'actual column/sequence limits', 'do not access production', 'Do not mechanically change every', 'current contract admits 3,000,000,000', 'Must fix even if uncommon']) assert.ok(calibration.includes(required), required);
  assert.ok(reporting.includes('Rare does not excuse a supported harmful path'));
});
test('classification grants neither merge approval nor waiver of verification or posting authority', () => {
  assert.ok(review.includes('no Must fix items does not mean unconditional approval'));
  assert.ok(reporting.includes('Do not auto-submit a GitHub review'));
  assert.ok(reporting.includes('posting remains separately authorized'));
  assert.ok(reporting.includes('Preserve independently required CI/verification gates'));
});
