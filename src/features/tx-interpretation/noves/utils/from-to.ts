// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NovesRawTransactionData, NovesResponseData, NovesSentReceived } from 'src/features/tx-interpretation/noves/types/api';

import type { NovesFlowViewItem } from 'src/features/tx-interpretation/noves/utils/generateFlowViewData';

export interface FromToData {
  text: string;
  address: string;
  name?: string | null;
}

const findSentByAddress = (sent: Array<NovesSentReceived> | undefined, currentAddress: string): Array<NovesSentReceived> => {
  if (!sent?.[0]) {
    return [];
  }

  return sent
    .filter((sent) => sent.from.address.toLocaleLowerCase() === currentAddress)
    .filter((sent) => sent.to.address);
};

const findReceivedByAddress = (received: Array<NovesSentReceived> | undefined, currentAddress: string): Array<NovesSentReceived> => {
  if (!received?.[0]) {
    return [];
  }

  return received
    .filter((received) => received.to.address?.toLocaleLowerCase() === currentAddress)
    .filter((received) => received.from.address);
};

// already filtered if null
const sentTo = (sent: NovesSentReceived): FromToData => ({ text: 'Sent to', address: sent.to.address! });

const receivedFrom = (received: NovesSentReceived): FromToData => ({ text: 'Received from', address: received.from.address });

const getFromToByRawParticipant = (raw: NovesRawTransactionData, currentAddress: string): FromToData | undefined => {
  if (raw.toAddress.toLocaleLowerCase() === currentAddress) {
    return { text: 'Received from', address: raw.fromAddress };
  }

  if (raw.fromAddress.toLocaleLowerCase() === currentAddress) {
    return { text: 'Sent to', address: raw.toAddress };
  }
};

const getFromToByTransfers = (
  sentFound: Array<NovesSentReceived>,
  receivedFound: Array<NovesSentReceived>,
  raw: NovesRawTransactionData,
  currentAddress: string,
): FromToData | undefined => {
  if (!sentFound[0]) {
    return receivedFound[0] ? receivedFrom(receivedFound[0]) : undefined;
  }

  const byRawParticipant = sentFound.length === receivedFound.length ? getFromToByRawParticipant(raw, currentAddress) : undefined;
  if (byRawParticipant) {
    return byRawParticipant;
  }

  return sentFound.length > receivedFound.length ? sentTo(sentFound[0]) : receivedFrom(receivedFound[0]);
};

const getFromToByRawData = (raw: NovesRawTransactionData, currentAddress: string): FromToData => {
  if (raw.toAddress && raw.toAddress.toLocaleLowerCase() === currentAddress) {
    return { text: 'Received from', address: raw.fromAddress };
  }

  if (raw.fromAddress && raw.fromAddress.toLocaleLowerCase() === currentAddress) {
    return { text: 'Sent to', address: raw.toAddress };
  }

  if (!raw.toAddress && raw.fromAddress) {
    return { text: 'Received from', address: raw.fromAddress };
  }

  if (!raw.fromAddress && raw.toAddress) {
    return { text: 'Sent to', address: raw.toAddress };
  }

  return { text: 'Sent to', address: currentAddress };
};

export const getFromTo = (txData: NovesResponseData, currentAddress: string): FromToData => {
  const raw = txData.rawTransactionData;
  const sentFound = findSentByAddress(txData.classificationData.sent, currentAddress);
  const receivedFound = findReceivedByAddress(txData.classificationData.received, currentAddress);

  return getFromToByTransfers(sentFound, receivedFound, raw, currentAddress) ?? getFromToByRawData(raw, currentAddress);
};

export const getFromToValue = (txData: NovesResponseData, currentAddress: string) => {
  const fromTo = getFromTo(txData, currentAddress);

  return fromTo.text.split(' ').shift()?.toLowerCase();
};

export const getActionFromTo = (item: NovesFlowViewItem): FromToData => {
  return {
    text: item.action.flowDirection === 'toRight' ? 'Sent to' : 'Received from',
    address: item.rightActor.address,
    name: item.rightActor.name,
  };
};
