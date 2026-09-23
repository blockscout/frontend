// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { erc20 } from '../../mocks';
import TokenTransferTable from './TokenTransferTable';

// The backend can push a transfer whose token is not catalogued yet (seen on
// the address Token transfers tab via the websocket feed). The schema types the
// field as non-null, so the mock has to be cast.
const withoutToken = { ...erc20, token: null } as unknown as schemas['TokenTransfer'];

describe('token transfer rows without a token', () => {
  afterEach(cleanup);

  it('table renders the row instead of crashing', () => {
    const { container } = render(<TokenTransferTable data={ [ withoutToken ] } top={ 0 } showTxInfo/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(container.textContent).toContain(erc20.transaction_hash?.slice(0, 10));
  });
});
