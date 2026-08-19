import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationResponse } from 'src/features/tx-interpretation/common/types/api';

import { preview } from 'src/slices/tx/mocks/details';

import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { it, expect, describe } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

// The interpretation feature is off in the test env, so every case that needs an action runs with it on.
function getParamsWithInterpretation(tx: schemas['TransactionPreview'] | undefined, interpretation?: TxInterpretationResponse) {
  return withEnvs(ENVS_MAP.txInterpretation, async() => {
    const { 'default': getOgDescriptionParams } = await import('./get-og-description-params');
    return getOgDescriptionParams(tx, interpretation);
  });
}

it('derives the three params from the summary and the transaction', async() => {
  expect(await getParamsWithInterpretation(preview, TX_INTERPRETATION)).toEqual({
    tx_status: 'Success',
    tx_action: 'Wrap 0.7 Ether into 0.7 STUB',
    tx_timestamp: 'Oct 10, 2022 14:34 UTC',
  });
});

describe('status', () => {
  it.each([
    [ 'ok' as const, 'Success' ],
    [ 'error' as const, 'Failed' ],
    [ null, 'Pending' ],
  ])('%s → %s', async(status, expected) => {
    const result = await getParamsWithInterpretation({ ...preview, status }, TX_INTERPRETATION);
    expect(result?.tx_status).toBe(expected);
  });

  it('gives up when the field never arrived', async() => {
    const { status, ...txWithoutStatus } = preview;
    expect(await getParamsWithInterpretation(txWithoutStatus as schemas['TransactionPreview'], TX_INTERPRETATION)).toBeNull();
  });
});

describe('gives up when a part is missing', () => {
  it('no transaction at all', async() => {
    expect(await getParamsWithInterpretation(undefined, TX_INTERPRETATION)).toBeNull();
  });

  it('a pending transaction, which has no timestamp', async() => {
    expect(await getParamsWithInterpretation({ ...preview, status: null, timestamp: null }, TX_INTERPRETATION)).toBeNull();
  });

  it('no usable summary and no method to fall back on', async() => {
    expect(await getParamsWithInterpretation({ ...preview, method: null })).toBeNull();
  });

  it('the interpretation feature is off', async() => {
    const { 'default': getOgDescriptionParams } = await import('./get-og-description-params');
    expect(getOgDescriptionParams(preview, TX_INTERPRETATION)).toBeNull();
  });

  it('the provider is Noves, whose page text this summary is not', async() => {
    const params = await withEnvs([ [ 'NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER', 'noves' ] ], async() => {
      const { 'default': getOgDescriptionParams } = await import('./get-og-description-params');
      return getOgDescriptionParams(preview, TX_INTERPRETATION);
    });

    expect(params).toBeNull();
  });
});

describe('falls back to the called-method line', () => {
  it('names the addresses the way the page does', async() => {
    const result = await getParamsWithInterpretation(preview);
    expect(result?.tx_action).toBe('kitty.kitty.cat.eth called updateSmartAsset on 0xd7...5859');
  });

  it('reads as a failed call for a failed transaction', async() => {
    const result = await getParamsWithInterpretation({ ...preview, status: 'error' });
    expect(result?.tx_action).toBe('kitty.kitty.cat.eth failed to call updateSmartAsset on 0xd7...5859');
  });
});
