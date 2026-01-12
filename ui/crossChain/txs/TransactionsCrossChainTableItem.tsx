import { chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
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
  data: InterchainMessage;
  isLoading?: boolean;
}

const TransactionsCrossChainTableItem = ({ data, isLoading: isLoadingProp }: Props) => {
  const { data: crossChainConfig, isPending } = useCrossChainConfig();
  const isLoading = isLoadingProp || isPending;

  const firstTransfer = data.transfers[0];
  const txHashWithTransfers = (() => {
    if (data.transfers.length === 0) {
      return;
    }

    if (config.chain.id === data.source_chain_id) {
      return data.source_transaction_hash;
    }

    if (config.chain.id === data.destination_chain_id) {
      return data.destination_transaction_hash;
    }
  })();

  return (
    <TableRow>
      <TableCell w="42px">
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
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
      <TableCell>
        { data.sender ? (
          <AddressEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.source_chain_id }
            address={ data.sender }
            isLoading={ isLoading }
            truncation="constant"
            noIcon
            lineHeight="24px"
          />
        ) : <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span> }
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
            <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>
          ) }
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
          ) : (
            <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>
          ) }
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
        { txHashWithTransfers ? (
          <Link
            href={ route({ pathname: '/tx/[hash]', query: { hash: txHashWithTransfers, tab: 'token_transfers_cross_chain' } }) }
            loading={ isLoading }
            lineHeight="24px"
          >
            { data.transfers.length }
          </Link>
        ) : (
          <Skeleton loading={ isLoading } color="text.secondary" lineHeight="24px">{ data.transfers.length }</Skeleton>
        ) }
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          {
            firstTransfer.sender ? (
              <AddressEntityInterchain
                chains={ crossChainConfig }
                chainId={ data.source_chain_id }
                address={ firstTransfer.sender }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                lineHeight="24px"
              />
            ) : <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>
          }
          { firstTransfer.source_token && (
            <TokenValueInterchain
              token={ firstTransfer.source_token }
              amount={ firstTransfer.source_amount }
              chainId={ firstTransfer.source_chain_id }
              chains={ crossChainConfig }
              loading={ isLoading }
              textStyle="xs"
              color="text.secondary"
            />
          ) }
          { data.transfers.length > 1 && (
            <Link
              variant="secondary"
              textDecorationStyle="dashed"
              textDecorationLine="underline"
              mt={ 2 }
              href={ route({ pathname: '/cross-chain-tx/[id]', query: { id: data.message_id, tab: 'transfers' } }) }
            >
              View all
            </Link>
          ) }
        </VStack>
      </TableCell>
      <TableCell>
        <AddressFromToIcon type="unspecified" isLoading={ isLoading } mt={ 0.5 }/>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          {
            firstTransfer.recipient ? (
              <AddressEntityInterchain
                chains={ crossChainConfig }
                chainId={ data.source_chain_id }
                address={ firstTransfer.recipient }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                lineHeight="24px"
              />
            ) : <chakra.span color="text.secondary" lineHeight="24px">{ mdash }</chakra.span>
          }
          { firstTransfer.destination_token && (
            <TokenValueInterchain
              token={ firstTransfer.destination_token }
              amount={ firstTransfer.destination_amount }
              chainId={ firstTransfer.destination_chain_id }
              chains={ crossChainConfig }
              loading={ isLoading }
              textStyle="xs"
              color="text.secondary"
            />
          ) }
        </VStack>
      </TableCell>
      <TableCell>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } lineHeight="24px"/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TransactionsCrossChainTableItem);
