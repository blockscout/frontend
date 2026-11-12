import { omit } from 'es-toolkit';

import type { NovesResponseData, NovesSentReceived } from 'src/features/tx-interpretation/noves/types/api';

import * as transactionMock from 'src/features/tx-interpretation/noves/mocks';
import type { NovesFlowViewItem } from 'src/features/tx-interpretation/noves/utils/generateFlowViewData';

import { describe, it, expect } from 'vitest';

import { getActionFromTo, getFromTo, getFromToValue } from './from-to';

it('get data for FromTo component from transaction', async() => {
  const result = getFromTo(transactionMock.transaction, transactionMock.transaction.accountAddress);

  expect(result).toEqual({
    text: 'Sent to',
    address: '0xef6595A423c99f3f2821190A4d96fcE4DcD89a80',
  });
});

it('get what type of FromTo component will be', async() => {
  const result = getFromToValue(transactionMock.transaction, transactionMock.transaction.accountAddress);

  expect(result).toEqual('sent');
});

it('get data for FromTo component from flow item', async() => {
  const item: NovesFlowViewItem = {
    action: {
      label: 'Sent',
      amount: '3000',
      flowDirection: 'toRight',
      nft: undefined,
      token: {
        address: '0x1bfe4298796198f8664b18a98640cec7c89b5baa',
        decimals: 18,
        name: 'PQR-Test',
        symbol: 'PQR',
      },
    },
    rightActor: {
      address: '0xdD15D2650387Fb6FEDE27ae7392C402a393F8A37',
      name: null,
    },
    accountAddress: '0xef6595a423c99f3f2821190a4d96fce4dcd89a80',
  };

  const result = getActionFromTo(item);

  expect(result).toEqual({
    text: 'Sent to',
    address: '0xdD15D2650387Fb6FEDE27ae7392C402a393F8A37',
    name: null,
  });
});

describe('getFromTo', () => {
  const CURRENT = '0xaaa';
  const OTHER_1 = '0xB01';
  const OTHER_2 = '0xB02';
  const RAW_FROM = '0xC01';
  const RAW_TO = '0xC02';

  const transfer = (from: string, to: string | null): NovesSentReceived => ({
    action: 'sent',
    amount: '1',
    from: { name: null, address: from },
    to: { name: null, address: to },
  });

  const buildTx = (
    { sent = [], received = [], fromAddress = RAW_FROM, toAddress = RAW_TO }: {
      sent?: Array<NovesSentReceived>;
      received?: Array<NovesSentReceived>;
      fromAddress?: string;
      toAddress?: string;
    },
  ): NovesResponseData => ({
    ...transactionMock.transaction,
    classificationData: { ...transactionMock.transaction.classificationData, sent, received },
    rawTransactionData: { ...transactionMock.transaction.rawTransactionData, fromAddress, toAddress },
  });

  const outgoing = (to: string | null = OTHER_1) => transfer('0xAAA', to);
  const incoming = (from: string = OTHER_2) => transfer(from, '0xAAA');

  describe('when the address both sent and received', () => {
    it('reports the raw sender if the counts match and the address is the raw recipient', () => {
      const tx = buildTx({ sent: [ outgoing() ], received: [ incoming() ], toAddress: '0xAAA' });
      expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Received from', address: RAW_FROM });
    });

    it('reports the raw recipient if the counts match and the address is the raw sender', () => {
      const tx = buildTx({ sent: [ outgoing() ], received: [ incoming() ], fromAddress: '0xAAA' });
      expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Sent to', address: RAW_TO });
    });

    it('reports the first sender if the counts match and the address is not in the raw data', () => {
      const tx = buildTx({ sent: [ outgoing() ], received: [ incoming() ] });
      expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Received from', address: OTHER_2 });
    });

    it('reports the first recipient if it sent more than it received', () => {
      const tx = buildTx({ sent: [ outgoing(), outgoing('0xB03') ], received: [ incoming() ], toAddress: '0xAAA' });
      expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Sent to', address: OTHER_1 });
    });

    it('reports the first sender if it received more than it sent', () => {
      const tx = buildTx({ sent: [ outgoing() ], received: [ incoming(), incoming('0xB03') ], fromAddress: '0xAAA' });
      expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Received from', address: OTHER_2 });
    });
  });

  it('reports the first recipient if the address only sent', () => {
    const tx = buildTx({ sent: [ transfer(OTHER_2, OTHER_2), outgoing() ], received: [ transfer(OTHER_1, OTHER_2) ], toAddress: '0xAAA' });
    expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Sent to', address: OTHER_1 });
  });

  it('reports the first sender if the address only received', () => {
    const tx = buildTx({ sent: [ transfer(OTHER_1, OTHER_2) ], received: [ incoming() ], fromAddress: '0xAAA' });
    expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Received from', address: OTHER_2 });
  });

  it('ignores transfers sent to nobody', () => {
    const tx = buildTx({ sent: [ outgoing(null) ], received: [ incoming() ] });
    expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Received from', address: OTHER_2 });
  });

  it('ignores transfers received from nobody', () => {
    const tx = buildTx({ sent: [ outgoing() ], received: [ incoming('') ] });
    expect(getFromTo(tx, CURRENT)).toEqual({ text: 'Sent to', address: OTHER_1 });
  });

  describe('when the address is in no transfer', () => {
    it('reports the raw sender if the address is the raw recipient', () => {
      expect(getFromTo(buildTx({ toAddress: '0xAAA' }), CURRENT)).toEqual({ text: 'Received from', address: RAW_FROM });
    });

    it('reports the raw recipient if the address is the raw sender', () => {
      expect(getFromTo(buildTx({ fromAddress: '0xAAA' }), CURRENT)).toEqual({ text: 'Sent to', address: RAW_TO });
    });

    it('prefers the raw recipient match if the address is on both sides', () => {
      expect(getFromTo(buildTx({ fromAddress: '0xAAA', toAddress: '0xAAA' }), CURRENT)).toEqual({ text: 'Received from', address: '0xAAA' });
    });

    it('reports the raw sender if there is no raw recipient', () => {
      expect(getFromTo(buildTx({ toAddress: '' }), CURRENT)).toEqual({ text: 'Received from', address: RAW_FROM });
    });

    it('reports the raw recipient if there is no raw sender', () => {
      expect(getFromTo(buildTx({ fromAddress: '' }), CURRENT)).toEqual({ text: 'Sent to', address: RAW_TO });
    });

    it('reports the address itself if the raw data names neither side', () => {
      expect(getFromTo(buildTx({ fromAddress: '', toAddress: '' }), CURRENT)).toEqual({ text: 'Sent to', address: CURRENT });
    });

    it('reports the address itself if it matches neither raw side', () => {
      expect(getFromTo(buildTx({}), CURRENT)).toEqual({ text: 'Sent to', address: CURRENT });
    });

    it('falls back to the raw data if the response has no transfer lists', () => {
      const tx = buildTx({ fromAddress: '0xAAA' });
      const withoutTransferLists = { ...tx, classificationData: omit(tx.classificationData, [ 'sent', 'received' ]) } as NovesResponseData;

      expect(getFromTo(withoutTransferLists, CURRENT)).toEqual({ text: 'Sent to', address: RAW_TO });
    });
  });
});
