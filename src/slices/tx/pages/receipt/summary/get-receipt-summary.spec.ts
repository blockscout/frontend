import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationSummary } from 'src/features/tx-interpretation/common/types/api';

import * as addressMock from 'src/slices/address/mocks/address-param';
import { tokenInfo } from 'src/slices/token/mocks/info';

import * as interpretationMock from 'src/features/tx-interpretation/blockscout/mocks';

import { describe, it, expect } from 'vitest';

import { getReceiptSummary } from './get-receipt-summary';

const SENDER: schemas['Address'] = { ...addressMock.withoutName, hash: '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9' };
const CONTRACT: schemas['Address'] = { ...addressMock.contract, hash: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' };
const RECIPIENT = addressMock.withoutName;

const TX = {
  from: SENDER,
  to: CONTRACT,
  created_contract: null,
  method: 'transfer',
  value: '0',
};

const TOKEN_TRANSFER: TxInterpretationSummary = {
  summary_template: '{action_type} {amount} {token} to {to_address}',
  summary_template_variables: {
    action_type: { type: 'string', value: 'Transfer' },
    amount: { type: 'currency', value: '134.168381' },
    token: { type: 'token', value: tokenInfo },
    to_address: { type: 'address', value: RECIPIENT },
  },
};

const SWAP = interpretationMock.swapOnMarket.data.summaries[0];
const WITHDRAW = interpretationMock.withdrawWithoutActionType.data.summaries[0];

describe('getReceiptSummary', () => {
  it('shows the transfer view for a transfer of a token, with the recipient from the interpretation', () => {
    expect(getReceiptSummary(TX, [ TOKEN_TRANSFER ], 18)).toEqual({
      type: 'transfer',
      amount: '134.168381',
      asset: { type: 'token', token: tokenInfo },
      from: SENDER,
      to: RECIPIENT,
    });
  });

  it('shows the transfer view for a transfer of the native coin', () => {
    expect(getReceiptSummary(TX, interpretationMock.nativeCoinTransfer.data.summaries, 18)).toEqual({
      type: 'transfer',
      amount: '8.103469',
      asset: { type: 'native' },
      from: SENDER,
      to: RECIPIENT,
    });
  });

  it('shows a transfer without a recipient when the interpretation names none', () => {
    const { to_address: _, ...variables } = TOKEN_TRANSFER.summary_template_variables;
    const summary = { summary_template: '{action_type} {amount} {token}', summary_template_variables: variables };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({ type: 'transfer', to: null });
  });

  it('shows the sentence for a transfer that carries no amount', () => {
    const { amount: _, ...variables } = TOKEN_TRANSFER.summary_template_variables;
    const summary = { summary_template: '{action_type} {token} to {to_address}', summary_template_variables: variables };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({
      type: 'sentence',
      actionType: 'Transfer',
      template: { chunks: [ '', ' to ', '' ], variablesNames: [ 'token', 'to_address' ] },
    });
  });

  it('shows the sentence for a transfer that carries neither a token nor the native coin', () => {
    const { token: _, ...variables } = TOKEN_TRANSFER.summary_template_variables;
    const summary = { summary_template: '{action_type} {amount} to {to_address}', summary_template_variables: variables };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({ type: 'sentence', actionType: 'Transfer' });
  });

  it('puts a leading action type on a line of its own and keeps the rest of the sentence whole', () => {
    expect(getReceiptSummary(TX, [ SWAP ], 18)).toEqual({
      type: 'sentence',
      actionType: 'Swap',
      template: {
        chunks: [ '', ' ', ' for ', ' ', ' on ', ' by ', '' ],
        variablesNames: [ 'outgoing_amount', 'outgoing_token', 'incoming_amount', 'incoming_token', 'market', 'initiator' ],
      },
      variables: SWAP.summary_template_variables,
      from: SENDER,
      to: CONTRACT,
    });
  });

  it('shows a sentence without an action type as one sentence', () => {
    expect(getReceiptSummary(TX, [ WITHDRAW ], 18)).toMatchObject({
      type: 'sentence',
      actionType: null,
      template: { chunks: [ '', ' Initiated Withdraw of ', ' ', '' ], variablesNames: [ 'initiator', 'amount', 'token' ] },
    });
  });

  it('keeps an action type that does not lead the sentence inside it', () => {
    const summary: TxInterpretationSummary = {
      summary_template: '{initiator} {action_type} {amount} {token}',
      summary_template_variables: { ...WITHDRAW.summary_template_variables, action_type: { type: 'string', value: 'Staked' } },
    };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({
      type: 'sentence',
      actionType: null,
      template: { chunks: [ '', ' Staked ', ' ', '' ] },
    });
  });

  it('fills the string variables into the sentence', () => {
    const summary: TxInterpretationSummary = {
      summary_template: 'Bundler {bundler_hash} submitted {user_ops_count} user operations.',
      summary_template_variables: {
        bundler_hash: { type: 'address', value: SENDER },
        user_ops_count: { type: 'string', value: '1' },
      },
    };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({
      type: 'sentence',
      actionType: null,
      template: { chunks: [ 'Bundler ', ' submitted 1 user operations.' ], variablesNames: [ 'bundler_hash' ] },
    });
  });

  it('shows an address of the sentence that is a party of the transaction with the transaction\'s data', () => {
    const namedSender = { ...addressMock.withEns, hash: SENDER.hash.toLowerCase() };
    const summary: TxInterpretationSummary = {
      summary_template: '{action_type} by {initiator} via {router}',
      summary_template_variables: {
        action_type: { type: 'string', value: 'Deposit' },
        initiator: { type: 'address', value: { ...addressMock.withoutName, hash: SENDER.hash } },
        router: { type: 'address', value: RECIPIENT },
      },
    };

    expect(getReceiptSummary({ ...TX, from: namedSender }, [ summary ], 18)).toMatchObject({
      variables: {
        initiator: { type: 'address', value: namedSender },
        router: { type: 'address', value: RECIPIENT },
      },
    });
  });

  it('joins the parties of a sentence as the sender and the transaction recipient', () => {
    expect(getReceiptSummary(TX, [ SWAP ], 18)).toMatchObject({ from: SENDER, to: CONTRACT });
  });

  it('joins the parties of a contract creation sentence as the sender and the created contract', () => {
    expect(getReceiptSummary({ ...TX, to: null, created_contract: CONTRACT }, [ SWAP ], 18)).toMatchObject({ from: SENDER, to: CONTRACT });
  });

  it('uses the first summary only', () => {
    expect(getReceiptSummary(TX, [ WITHDRAW, SWAP ], 18)).toMatchObject({ type: 'sentence', actionType: null });
  });

  it('falls back when the summary refers to a variable it does not carry', () => {
    const summary = { summary_template: '{action_type} {amount} {token} on {market}', summary_template_variables: SWAP.summary_template_variables };

    expect(getReceiptSummary(TX, [ summary ], 18)).toMatchObject({ type: 'call', method: 'transfer' });
  });

  it('falls back on an empty summaries list', () => {
    expect(getReceiptSummary(TX, [], 18)).toMatchObject({ type: 'call', method: 'transfer' });
  });

  it('falls back when there is no interpretation response', () => {
    expect(getReceiptSummary(TX, undefined, 18)).toMatchObject({ type: 'call', method: 'transfer' });
  });
});
