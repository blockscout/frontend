import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { mdash } from 'toolkit/utils/htmlEntities';
import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TokenValueInterchain from 'ui/shared/value/TokenValueInterchain';

interface Props {
  data: InterchainTransfer;
  isLoading?: boolean;
}

const TokenTransfersCrossChainTableItem = ({ data, isLoading }: Props) => {

  const dashElement = <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>;

  return (
    <TableRow>
      <TableCell w="42px">
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          { data.source_token && (
            <TokenValueInterchain
              token={ data.source_token }
              amount={ data.source_amount }
              chain={ data.source_chain }
              loading={ isLoading }
              lineHeight="24px"
            />
          ) }
          {
            data.sender ? (
              <AddressEntityInterchain
                chain={ data.source_chain }
                address={ data.sender }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                textStyle="xs"
              />
            ) : dashElement
          }
        </VStack>
      </TableCell>
      <TableCell>
        <AddressFromToIcon type="unspecified" isLoading={ isLoading } mt={ 0.5 }/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          { data.destination_token && (
            <TokenValueInterchain
              token={ data.destination_token }
              amount={ data.destination_amount }
              chain={ data.destination_chain }
              loading={ isLoading }
              lineHeight="24px"
            />
          ) }
          {
            data.recipient ? (
              <AddressEntityInterchain
                chain={ data.destination_chain }
                address={ data.recipient }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                textStyle="xs"
              />
            ) : dashElement
          }
        </VStack>
      </TableCell>
      <TableCell>
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
      <TableCell>
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
      <TableCell>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } lineHeight="24px"/>
      </TableCell>
      <TableCell>
        <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } lineHeight="24px"/>
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ data.send_timestamp || data.receive_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          lineHeight="24px"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransfersCrossChainTableItem);
