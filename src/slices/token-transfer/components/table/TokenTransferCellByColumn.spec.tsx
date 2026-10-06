// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { erc7984 } from 'src/features/fhe-operations/mocks/token-transfer';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

import { erc1155A, erc20, erc404A, erc404B, erc721, erc8056 } from '../../mocks';
import type { Props } from './TokenTransferCellByColumn';
import TokenTransferCellByColumn from './TokenTransferCellByColumn';

const DEFAULT_PROPS = {
  isLoading: false,
  chainConfig: undefined,
  baseAddress: undefined,
  tokenId: undefined,
  instance: undefined,
  enableTimeIncrement: false,
};

const CELL_TEST_ID = 'cell';

const renderCell = (item: schemas['TokenTransfer'], column: Props['column'], props: Partial<Props> = {}) => {
  render(
    <div data-testid={ CELL_TEST_ID }>
      <TokenTransferCellByColumn { ...DEFAULT_PROPS } item={ item } column={ column } { ...props }/>
    </div>,
  );
  return screen.getByTestId(CELL_TEST_ID);
};

const getInstanceLink = () => screen.queryAllByRole('link').find((link) => link.getAttribute('href')?.includes('/instance/'));

describe('TokenTransferCellByColumn', () => {
  afterEach(cleanup);

  describe('type', () => {
    it('shows the token standard', () => {
      const cell = renderCell(erc1155A, 'type');

      expect(cell.textContent).toBe('ERC-1155');
    });
  });

  describe('transfer type', () => {
    it('shows the mint badge for a minting row', () => {
      const cell = renderCell(erc1155A, 'transfer_type');

      expect(cell.textContent).toBe('Minting');
    });
  });

  describe('amount', () => {
    it('shows the fungible amount without its USD value', () => {
      const cell = renderCell(erc20, 'amount');

      expect(cell.textContent).toBe('0.03156737');
    });

    it('hides the amount of a confidential token', () => {
      const cell = renderCell(erc7984, 'amount');

      expect(cell.textContent).toBe('•••••');
    });

    it('shows one for an NFT row without a value', () => {
      const cell = renderCell(erc721, 'amount');

      expect(cell.textContent).toBe('1');
    });

    it('shows one for an ERC-404 row with a token id', () => {
      const cell = renderCell(erc404B, 'amount');

      expect(cell.textContent).toBe('1');
    });

    it('shows the value of an ERC-1155 row rather than its token id', () => {
      const cell = renderCell(erc1155A, 'amount');

      expect(cell.textContent).toBe('42');
    });

    it('shows the fungible amount of an ERC-404 row without a token id', () => {
      const cell = renderCell(erc404A, 'amount');

      expect(cell.textContent).toBe('42,000,000');
    });

    it('scales the amount by the token multiplier and tags it', async() => {
      const text = await withEnvs(ENVS_MAP.additionalTokenTypes, async() => {
        const { 'default': Cell } = await import('./TokenTransferCellByColumn');
        render(<div data-testid={ CELL_TEST_ID }><Cell { ...DEFAULT_PROPS } item={ erc8056 } column="amount"/></div>);
        return screen.getByTestId(CELL_TEST_ID).textContent;
      });

      expect(text).toBe('1.69x0.05334886');
    });
  });

  describe('value', () => {
    it('shows the USD value derived from the exchange rate', () => {
      const cell = renderCell(erc20, 'value');

      expect(cell.textContent).toBe('$1.33');
    });

    it('shows a dash when the token has no exchange rate', () => {
      const cell = renderCell(erc721, 'value');

      expect(cell.textContent).toBe('-');
    });
  });

  describe('asset', () => {
    it('shows only the token symbol for a fungible row', () => {
      const cell = renderCell(erc20, 'asset');

      expect(cell.textContent).toBe('ARIA');
      expect(getInstanceLink()).toBeUndefined();
    });

    it('shows the token id of an NFT row as a link to the instance, then the token symbol', () => {
      const cell = renderCell(erc721, 'asset');

      expect(cell.textContent).toBe('875879856AriaSA');
      expect(getInstanceLink()?.textContent).toBe('875879856');
    });

    it('does not link the token id of the current instance', () => {
      const cell = renderCell(erc721, 'asset', { tokenId: '875879856' });

      expect(cell.textContent).toBe('875879856AriaSA');
      expect(getInstanceLink()).toBeUndefined();
    });

    it('shows the token id of an ERC-1155 row beside the symbol', () => {
      renderCell(erc1155A, 'asset');

      expect(getInstanceLink()?.textContent).toBe('123');
    });

    it('shows only the token symbol for an ERC-404 row without a token id', () => {
      const cell = renderCell(erc404A, 'asset');

      expect(cell.textContent).toBe('MY_SYMBOL_IS_VERY_LONG');
      expect(getInstanceLink()).toBeUndefined();
    });
  });
});
