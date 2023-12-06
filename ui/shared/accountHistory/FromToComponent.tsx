import { Box, Tag, TagLabel } from '@chakra-ui/react';
import React from 'react';

import type { ResponseData, SentReceived } from 'types/translateApi';

import type { FlowViewItem } from 'ui/tx/assetFlows/utils/generateFlowViewData';

import AddressEntity from '../entities/address/AddressEntity';

export const fromToComponent = (text: string, address: string, getValue?: boolean, name?: string | null, truncate?: number) => {
  const isSent = text.startsWith('Sent');

  if (getValue) {
    return text.split(' ').shift()?.toLowerCase();
  }
  return (
    <Box display="flex">
      <Tag
        bg={ isSent ? '#FFFAF0' : '#F0FFF4' }
        _dark={{ bg: isSent ? 'rgba(251, 211, 141, 0.16)' : 'rgba(154, 230, 180, 0.16)' }}
        px={ 0 }
        pos="relative"
        minW="max-content"
      >
        <TagLabel
          position="absolute"
          w="full"
          textAlign="center"
          color={ isSent ? '#D69E2E' : '#38A169' }
          _dark={{ color: isSent ? 'orange.200' : 'green.200' }}
        >
          { text }
        </TagLabel>
        <TagLabel visibility="hidden" whiteSpace="nowrap" px={ 2 } >Received from</TagLabel>
      </Tag>

      <Box ml="2" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
        <AddressEntity
          address={{ hash: address || '', name: name || '' }}
          fontWeight="500"
          truncate={ truncate ? truncate : 7 }
          noCopy={ !address }
          noLink={ !address }
        />
      </Box>
    </Box>
  );
};

export const getFromTo = (txData: ResponseData, currentAddress: string, getValue?: boolean) => {
  const raw = txData.rawTransactionData;
  const sent = txData.classificationData.sent;
  let sentFound: Array<SentReceived> = [];
  if (sent && sent[0]) {
    sentFound = sent
      .filter((sent) => sent.from.address.toLocaleLowerCase() === currentAddress)
      .filter((sent) => sent.to.address);
  }

  const received = txData.classificationData.received;
  let receivedFound: Array<SentReceived> = [];
  if (received && received[0]) {
    receivedFound = received
      .filter((received) => received.to.address.toLocaleLowerCase() === currentAddress)
      .filter((received) => received.from.address);
  }

  if (sentFound[0] && receivedFound[0]) {
    if (sentFound.length === receivedFound.length) {
      if (raw.toAddress.toLocaleLowerCase() === currentAddress) {
        return fromToComponent('Received from', raw.fromAddress, getValue);
      }

      if (raw.fromAddress.toLocaleLowerCase() === currentAddress) {
        return fromToComponent('Sent to', raw.toAddress, getValue);
      }
    }
    if (sentFound.length > receivedFound.length) {
      return fromToComponent('Sent to', sentFound[0].to.address, getValue);
    } else {
      return fromToComponent('Received from', receivedFound[0].from.address, getValue);
    }
  }

  if (sent && sentFound[0]) {
    return fromToComponent('Sent to', sentFound[0].to.address, getValue);
  }

  if (received && receivedFound[0]) {
    return fromToComponent('Received from', receivedFound[0].from.address, getValue);
  }

  if (raw.toAddress && raw.toAddress.toLocaleLowerCase() === currentAddress) {
    return fromToComponent('Received from', raw.fromAddress, getValue);
  }

  if (raw.fromAddress && raw.fromAddress.toLocaleLowerCase() === currentAddress) {
    return fromToComponent('Sent to', raw.toAddress, getValue);
  }

  if (!raw.toAddress && raw.fromAddress) {
    return fromToComponent('Received from', raw.fromAddress, getValue);
  }

  if (!raw.fromAddress && raw.toAddress) {
    return fromToComponent('Sent to', raw.toAddress, getValue);
  }

  return fromToComponent('Sent to', currentAddress, getValue);
};

export const getActionFromTo = (item: FlowViewItem, truncate = 7) => {
  if (item.action.flowDirection === 'toRight') {
    return fromToComponent('Sent to', item.rightActor.address, false, item.rightActor.name, truncate);
  }
  return fromToComponent('Received from', item.rightActor.address, false, item.rightActor.name, truncate);
};
