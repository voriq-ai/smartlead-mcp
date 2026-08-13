import { describe, expect, it } from 'vitest';
import { READ_ONLY, capability, evaluatePolicy } from '../../src/security/policy.js';
import { testConfig } from '../helpers/mock-fetch.js';

const MUTATION = capability({ remoteMutation: true });
const CREDIT = capability({ creditSpending: true, remoteMutation: true });
const SEND = capability({ remoteMutation: true, sending: true });
const DESTRUCTIVE = capability({ remoteMutation: true, destructive: true });
const IMPORT = capability({ remoteMutation: true, leadImport: true });

describe('capability()', () => {
  it('derives readOnly from the declared side effects', () => {
    expect(capability({}).readOnly).toBe(true);
    expect(capability({ remoteMutation: true }).readOnly).toBe(false);
    expect(capability({ creditSpending: true }).readOnly).toBe(false);
    expect(capability({ leadImport: true }).readOnly).toBe(false);
  });

  it('cannot be tricked into claiming read-only while declaring a side effect', () => {
    expect(capability({ readOnly: true, destructive: true }).readOnly).toBe(false);
  });
});

describe('readonly mode', () => {
  const config = testConfig({ mode: 'readonly' });

  it('allows read-only operations', () => {
    expect(evaluatePolicy(READ_ONLY, config)).toEqual({ allowed: true });
  });

  it.each([
    ['mutation', MUTATION],
    ['credit spend', CREDIT],
    ['send', SEND],
    ['destructive', DESTRUCTIVE],
    ['import', IMPORT],
  ])('blocks %s', (_label, cap) => {
    const decision = evaluatePolicy(cap, config, {
      confirm_credit_spend: true,
      confirm_send: true,
      confirm_destructive: true,
      confirm_import: true,
    });
    expect(decision).toMatchObject({ allowed: false, code: 'mode_readonly' });
  });
});

describe('standard mode', () => {
  const config = testConfig({ mode: 'standard' });

  it('allows ordinary mutations', () => {
    expect(evaluatePolicy(MUTATION, config)).toEqual({ allowed: true });
  });

  it('still blocks sending and destructive operations', () => {
    expect(evaluatePolicy(SEND, config, { confirm_send: true })).toMatchObject({ code: 'mode_standard' });
    expect(evaluatePolicy(DESTRUCTIVE, config, { confirm_destructive: true })).toMatchObject({
      code: 'mode_standard',
    });
  });

  it('permits credit spend only with both the env flag and the per-call confirmation', () => {
    expect(evaluatePolicy(CREDIT, config, { confirm_credit_spend: true })).toMatchObject({
      code: 'credit_spend_disabled',
    });

    const enabled = testConfig({ mode: 'standard', allowCreditSpend: true });
    expect(evaluatePolicy(CREDIT, enabled, {})).toMatchObject({ code: 'credit_spend_unconfirmed' });
    expect(evaluatePolicy(CREDIT, enabled, { confirm_credit_spend: true })).toEqual({ allowed: true });
  });

  it('requires confirm_import for lead imports', () => {
    expect(evaluatePolicy(IMPORT, config, {})).toMatchObject({ code: 'import_unconfirmed' });
    expect(evaluatePolicy(IMPORT, config, { confirm_import: true })).toEqual({ allowed: true });
  });
});

describe('unrestricted mode', () => {
  it('still requires the env flag and confirmation for sending', () => {
    const noFlag = testConfig({ mode: 'unrestricted' });
    expect(evaluatePolicy(SEND, noFlag, { confirm_send: true })).toMatchObject({ code: 'send_disabled' });

    const withFlag = testConfig({ mode: 'unrestricted', allowSend: true });
    expect(evaluatePolicy(SEND, withFlag, {})).toMatchObject({ code: 'send_unconfirmed' });
    expect(evaluatePolicy(SEND, withFlag, { confirm_send: true })).toEqual({ allowed: true });
  });

  it('still requires the env flag and confirmation for destructive operations', () => {
    const noFlag = testConfig({ mode: 'unrestricted' });
    expect(evaluatePolicy(DESTRUCTIVE, noFlag, { confirm_destructive: true })).toMatchObject({
      code: 'destructive_disabled',
    });

    const withFlag = testConfig({ mode: 'unrestricted', allowDestructive: true });
    expect(evaluatePolicy(DESTRUCTIVE, withFlag, {})).toMatchObject({ code: 'destructive_unconfirmed' });
    expect(evaluatePolicy(DESTRUCTIVE, withFlag, { confirm_destructive: true })).toEqual({ allowed: true });
  });
});

describe('confirmation strictness', () => {
  const config = testConfig({ mode: 'standard', allowCreditSpend: true });

  it.each([['true'], [1], ['yes'], [{}], [[]], [null], [undefined]])(
    'rejects the non-boolean confirmation value %p',
    (value) => {
      expect(evaluatePolicy(CREDIT, config, { confirm_credit_spend: value })).toMatchObject({
        code: 'credit_spend_unconfirmed',
      });
    },
  );

  it('rejects an explicit false', () => {
    expect(evaluatePolicy(CREDIT, config, { confirm_credit_spend: false })).toMatchObject({
      code: 'credit_spend_unconfirmed',
    });
  });

  it('includes actionable requirements on every denial', () => {
    const decision = evaluatePolicy(CREDIT, testConfig({ mode: 'standard' }), {});
    expect(decision.allowed).toBe(false);
    if (decision.allowed) return;
    expect(decision.requirements.length).toBeGreaterThan(0);
    expect(decision.requirements.join(' ')).toContain('SMARTLEAD_MCP_ALLOW_CREDIT_SPEND=true');
  });
});
