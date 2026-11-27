import type { TxInterpretationSummary } from 'src/features/tx-interpretation/common/types/api';

import type { CurrencyUnits } from 'src/slices/chain/units';

import { txInterpretation } from 'src/features/tx-interpretation/blockscout/mocks';
import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';

import { it, expect, beforeEach, vi } from 'vitest';

import summaryToPlainText from './summary-to-plain-text';

const CURRENCY_UNITS: CurrencyUnits = { wei: 'grain', gwei: 'kilograin', ether: 'xDAI' };

// A timestamp variable is rendered in local time, as on the page — pin the zone so the assertion holds
// wherever the suite runs.
beforeEach(() => {
  vi.stubEnv('TZ', 'UTC');
});

it('renders every variable type the way the page does', () => {
  expect(summaryToPlainText(txInterpretation.data.summaries[0], CURRENCY_UNITS)).toBe('Transfer 100 DUCK to 0xd7...5859 on Jun 17 2023');
});

it('renders the native coin symbol and the smallest unit variables with the given unit names', () => {
  const summary: TxInterpretationSummary = {
    summary_template: '{action_type} {amount} {native} for {gas} {wei}',
    summary_template_variables: {
      action_type: { type: 'string', value: 'Send' },
      amount: { type: 'currency', value: '1.5' },
      gas: { type: 'currency', value: '21' },
    },
  };

  expect(summaryToPlainText(summary, CURRENCY_UNITS)).toBe('Send 1.5 xDAI for 21 grain');
});

it('collapses the template whitespace into single spaces', () => {
  const summary: TxInterpretationSummary = {
    ...TX_INTERPRETATION.data.summaries[0],
    summary_template: '  {action_type}   {source_amount} Ether  into   {destination_amount} {destination_token}  ',
  };

  expect(summaryToPlainText(summary, CURRENCY_UNITS)).toBe('Wrap 0.7 Ether into 0.7 STUB');
});

it('returns nothing when a template variable has no value', () => {
  const summary: TxInterpretationSummary = {
    summary_template: '{action_type} {amount} {token}',
    summary_template_variables: {
      action_type: { type: 'string', value: 'Transfer' },
      amount: { type: 'currency', value: '100' },
    },
  };

  expect(summaryToPlainText(summary, CURRENCY_UNITS)).toBeUndefined();
});
