import { chakra, Grid, type JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import useCrossChainConfig from 'lib/crossChain/useCrossChainConfig';
import dayjs from 'lib/date/dayjs';
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
  data: InterchainTransfer;
  isLoading?: boolean;
}

const TokenTransfersCrossChainListItem = ({ data, isLoading: isLoadingProp, rowGap = 3, ...rest }: Props) => {
  const { data: crossChainConfig, isPending } = useCrossChainConfig();
  const isLoading = isLoadingProp || isPending;

  const timestamp = data.send_timestamp || data.receive_timestamp;

  const dashElement = <chakra.span color="text.secondary">{ mdash }</chakra.span>;

  return (
    <ListItemMobile rowGap={ rowGap } { ...rest }>
      <CrossChainTxsStatusTag status={ data.status } loading={ isLoading } mode="full"/>
      { timestamp && (
        <Skeleton loading={ isLoading } display="flex" alignItems="center" color="text.secondary">
          <div>{ dayjs(timestamp).fromNow() }</div>
          <TextSeparator/>
          <Time timestamp={ timestamp } format="lll_s"/>
        </Skeleton>
      ) }
      <Grid templateColumns="100px 1fr" columnGap={ 2 } rowGap={ rowGap }>
        <Skeleton loading={ isLoading }>
          Source token
        </Skeleton>
        { data.source_token ? (
          <TokenValueInterchain
            token={ data.source_token }
            amount={ data.source_amount }
            chainId={ data.source_chain_id }
            chains={ crossChainConfig }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Sender
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
          Target token
        </Skeleton>
        { data.destination_token ? (
          <TokenValueInterchain
            token={ data.destination_token }
            amount={ data.destination_amount }
            chainId={ data.destination_chain_id }
            chains={ crossChainConfig }
            loading={ isLoading }
          />
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Recipient
        </Skeleton>
        { data.recipient ? (
          <AddressEntityInterchain
            chains={ crossChainConfig }
            chainId={ data.destination_chain_id }
            address={ data.recipient }
            isLoading={ isLoading }
            noIcon
          />
        ) : dashElement }
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
          Protocol
        </Skeleton>
        { data.bridge ? (
          <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading }/>
        ) : dashElement }
        <Skeleton loading={ isLoading }>
          Message
        </Skeleton>
        { data.message_id ? (
          <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading }/>
        ) : dashElement }
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(TokenTransfersCrossChainListItem);
