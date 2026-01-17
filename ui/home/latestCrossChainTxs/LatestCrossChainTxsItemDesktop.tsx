import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { mdash } from 'toolkit/utils/htmlEntities';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
}

const LatestCrossChainTxsItemDesktop = ({ data, isLoading: isLoadingProp }: Props) => {
  const { data: crossChainConfig, isPending } = useCrossChainConfig();

  const isLoading = isLoadingProp || isPending;

  return (
    <TableRow>
      <TableCell w="42px">
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } lineHeight="24px" fontWeight={ 700 }/>
          <TimeWithTooltip timestamp={ data.send_timestamp || data.receive_timestamp } isLoading={ isLoading } color="text.secondary" timeFormat="absolute"/>
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
          ) : (
            <chakra.span color="text.secondary">{ mdash }</chakra.span>
          ) }
          <ChainLabel
            data={ crossChainConfig?.find((chain) => chain.id.toString() === data.source_chain_id) }
            isLoading={ isLoading }
            color="text.secondary"
            textStyle="xs"
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
          ) : (
            <chakra.span color="text.secondary">{ mdash }</chakra.span>
          ) }
          <ChainLabel
            data={ crossChainConfig?.find((chain) => chain.id.toString() === data.destination_chain_id) }
            isLoading={ isLoading }
            color="text.secondary"
            textStyle="xs"
          />
        </VStack>
      </TableCell>
      <TableCell>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } lineHeight="24px"/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LatestCrossChainTxsItemDesktop);
