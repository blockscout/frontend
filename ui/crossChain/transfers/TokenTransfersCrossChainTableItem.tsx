import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
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

const TokenTransfersCrossChainTableItem = ({ data, isLoading: isLoadingProp }: Props) => {
  const { data: crossChainConfig, isPending } = useCrossChainConfig();
  const isLoading = isLoadingProp || isPending;

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
              chainId={ data.source_chain_id }
              chains={ crossChainConfig }
              loading={ isLoading }
              lineHeight="24px"
            />
          ) }
          {
            data.sender ? (
              <AddressEntityInterchain
                chains={ crossChainConfig }
                chainId={ data.source_chain_id }
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
              chainId={ data.destination_chain_id }
              chains={ crossChainConfig }
              loading={ isLoading }
              lineHeight="24px"
            />
          ) }
          {
            data.recipient ? (
              <AddressEntityInterchain
                chains={ crossChainConfig }
                chainId={ data.destination_chain_id }
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
              chains={ crossChainConfig }
              chainId={ data.source_chain_id }
              hash={ data.source_transaction_hash }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
              lineHeight="24px"
            />
          ) : dashElement }
          <ChainLabel
            data={ crossChainConfig?.find((chain) => chain.id.toString() === data.source_chain_id) }
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
              chains={ crossChainConfig }
              chainId={ data.destination_chain_id }
              hash={ data.destination_transaction_hash }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
              lineHeight="24px"
            />
          ) : dashElement }
          <ChainLabel
            data={ crossChainConfig?.find((chain) => chain.id.toString() === data.destination_chain_id) }
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
        <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } lineHeight="24px" fontWeight={ 700 }/>
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
