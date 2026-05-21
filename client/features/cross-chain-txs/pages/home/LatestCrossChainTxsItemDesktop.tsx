// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import TxEntityInterchain from 'client/slices/tx/components/entity/TxEntityInterchain';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { mdash } from 'toolkit/utils/htmlEntities';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import CrossChainBridgeLink from '../../components/CrossChainBridgeLink';
import CrossChainMessageEntity from '../../components/CrossChainMessageEntity';
import CrossChainTxsStatusTag from '../../components/CrossChainTxsStatusTag';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
}

const LatestCrossChainTxsItemDesktop = ({ data, isLoading }: Props) => {

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
              chain={ data.source_chain }
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
            data={ data.source_chain }
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
              chain={ data.destination_chain }
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
            data={ data.destination_chain }
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
