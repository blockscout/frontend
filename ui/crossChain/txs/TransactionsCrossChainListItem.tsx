import type { JsxStyleProps } from '@chakra-ui/react';
import { chakra, Grid } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
import dayjs from 'lib/date/dayjs';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TextSeparator from 'ui/shared/TextSeparator';
import Time from 'ui/shared/time/Time';
import TokenValueInterchain from 'ui/shared/value/TokenValueInterchain';

interface Props extends JsxStyleProps {
  data: InterchainMessage;
  isLoading?: boolean;
}

const TransactionsCrossChainListItem = ({ data, isLoading: isLoadingProp, rowGap = 3, ...rest }: Props) => {
  const { data: crossChainConfig, isPending } = useCrossChainConfig();
  const isLoading = isLoadingProp || isPending;

  const timestamp = data.send_timestamp || data.receive_timestamp;
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

  const dashElement = <chakra.span color="text.secondary">{ mdash }</chakra.span>;

  return (
    <ListItemMobile rowGap={ rowGap } { ...rest }>
      <CrossChainTxsStatusTag status={ data.status } loading={ isLoading } mode="full"/>
      <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } fontWeight={ 600 } noIcon={ false } truncation="dynamic" w="100%"/>
      { timestamp && (
        <Skeleton loading={ isLoading } display="flex" alignItems="center" color="text.secondary">
          <div>{ dayjs(timestamp).fromNow() }</div>
          <TextSeparator/>
          <Time timestamp={ timestamp } format="lll_s"/>
        </Skeleton>
      ) }
      <Grid templateColumns="120px 1fr" columnGap={ 2 } rowGap={ rowGap }>
        <Skeleton loading={ isLoading }>
          Source tx
        </Skeleton>
        { data.source_transaction_hash ? (
          <TxEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.source_chain_id }
            hash={ data.source_transaction_hash }
            isLoading={ isLoading }
            noCopy
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Destination tx
        </Skeleton>
        { data.destination_transaction_hash ? (
          <TxEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.destination_chain_id }
            hash={ data.destination_transaction_hash }
            isLoading={ isLoading }
            noCopy
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Msg sender
        </Skeleton>
        { data.sender ? (
          <AddressEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.source_chain_id }
            address={ data.sender }
            isLoading={ isLoading }
            noIcon
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Transf
        </Skeleton>
        { txHashWithTransfers ? (
          <Link
            href={ route({ pathname: '/tx/[hash]', query: { hash: txHashWithTransfers, tab: 'token_transfers_cross_chain' } }) }
            loading={ isLoading }
          >
            { data.transfers.length }
          </Link>
        ) : (
          <Skeleton loading={ isLoading } color="text.secondary">{ data.transfers.length }</Skeleton>
        ) }
        <Skeleton loading={ isLoading }>
          Sender
        </Skeleton>
        { firstTransfer.sender ? (
          <AddressEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.source_chain_id }
            address={ firstTransfer.sender }
            isLoading={ isLoading }
            noIcon
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Source token
        </Skeleton>
        { firstTransfer.source_token ? (
          <TokenValueInterchain
            token={ firstTransfer.source_token }
            amount={ firstTransfer.source_amount }
            chainId={ firstTransfer.source_chain_id }
            chains={ crossChainConfig }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Recipient
        </Skeleton>
        { firstTransfer.recipient ? (
          <AddressEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.destination_chain_id }
            address={ firstTransfer.recipient }
            isLoading={ isLoading }
            noIcon
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Target token
        </Skeleton>
        { firstTransfer.destination_token ? (
          <TokenValueInterchain
            token={ firstTransfer.destination_token }
            amount={ firstTransfer.destination_amount }
            chainId={ firstTransfer.destination_chain_id }
            chains={ crossChainConfig }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Protocol
        </Skeleton>
        { data.bridge ? (
          <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading }/>
        ) : dashElement }
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(TransactionsCrossChainListItem);
