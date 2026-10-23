// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import AddressEntityInterchain from 'src/slices/address/components/entity/AddressEntityInterchain';
import TxEntityInterchain from 'src/slices/tx/components/entity/TxEntityInterchain';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainLabel from 'src/shared/external-chains/ChainLabel';
import TokenValueInterchain from 'src/shared/values/entity/TokenValueInterchain';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import CrossChainBridgeLink from '../CrossChainBridgeLink';
import CrossChainFromToTag from '../CrossChainFromToTag';
import CrossChainMessageEntity from '../CrossChainMessageEntity';
import CrossChainTxsStatusTag from '../CrossChainTxsStatusTag';

interface Props {
  data: InterchainTransfer;
  isLoading?: boolean;
  currentAddress?: string;
}

const TOKEN_VALUE_PROPS = {
  fontWeight: 'semibold',
  tokenEntityProps: { fontWeight: 'medium' },
};
const ADDRESS_LINK_PROPS = { variant: 'secondary' as const };

const TokenTransfersCrossChainTableItem = ({ data, isLoading, currentAddress }: Props) => {

  const dashElement = <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>;

  return (
    <TableRow>
      <TableCell>
        <VStack alignItems="start" gap={ 1.5 }>
          { currentAddress && (
            <CrossChainFromToTag
              currentAddress={ currentAddress }
              sender={ data.sender?.hash }
              recipient={ data.recipient?.hash }
              isLoading={ isLoading }
            />
          ) }
          <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
        </VStack>
      </TableCell>
      <TableCell maxW="200px">
        <VStack alignItems="start">
          { data.source_token && (
            <TokenValueInterchain
              token={ data.source_token }
              amount={ data.source_amount }
              chain={ data.source_chain }
              loading={ isLoading }
              lineHeight="24px"
              { ...TOKEN_VALUE_PROPS }
            />
          ) }
          {
            data.sender ? (
              <AddressEntityInterchain
                chain={ data.source_chain }
                address={ data.sender }
                isLoading={ isLoading }
                truncation="constant"
                link={ ADDRESS_LINK_PROPS }
                noIcon
                currentAddress={ currentAddress }
                textStyle="xs"
              />
            ) : dashElement
          }
        </VStack>
      </TableCell>
      <TableCell maxW="200px">
        <VStack alignItems="start">
          { data.destination_token && (
            <TokenValueInterchain
              token={ data.destination_token }
              amount={ data.destination_amount }
              chain={ data.destination_chain }
              loading={ isLoading }
              lineHeight="24px"
              { ...TOKEN_VALUE_PROPS }
            />
          ) }
          {
            data.recipient ? (
              <AddressEntityInterchain
                chain={ data.destination_chain }
                address={ data.recipient }
                isLoading={ isLoading }
                truncation="constant"
                link={ ADDRESS_LINK_PROPS }
                noIcon
                currentAddress={ currentAddress }
                textStyle="xs"
              />
            ) : dashElement
          }
        </VStack>
      </TableCell>
      <TableCell maxW="150px">
        <VStack alignItems="start">
          { data.source_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.source_chain }
              hash={ data.source_transaction_hash }
              isLoading={ isLoading }
              noIcon
              truncation="constant"
              lineHeight="24px"
            />
          ) : dashElement }
          <ChainLabel
            data={ data.source_chain }
            isLoading={ isLoading }
            color="text.secondary"
            textStyle="xs"
            gap={ 1 }
          />
        </VStack>
      </TableCell>
      <TableCell maxW="150px">
        <VStack alignItems="start">
          { data.destination_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.destination_chain }
              hash={ data.destination_transaction_hash }
              isLoading={ isLoading }
              noIcon
              truncation="constant"
              lineHeight="24px"
            />
          ) : dashElement }
          <ChainLabel
            data={ data.destination_chain }
            isLoading={ isLoading }
            color="text.secondary"
            textStyle="xs"
            gap={ 1 }
          />
        </VStack>
      </TableCell>
      <TableCell maxW="150px">
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } messageId={ data.message_id } lineHeight="24px"/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          <CrossChainMessageEntity id={ data.message_id } bridgeId={ data.bridge?.id } isLoading={ isLoading } lineHeight="24px"/>
          <TimeWithTooltip
            timestamp={ data.send_timestamp || data.receive_timestamp }
            isLoading={ isLoading }
            color="text.secondary"
            whiteSpace="nowrap"
          />
        </VStack>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransfersCrossChainTableItem);
