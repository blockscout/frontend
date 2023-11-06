import { Box, Text, Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_COUNTERS } from 'stubs/address';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import AddressBalance from './details/AddressBalance';
import AddressNameInfo from './details/AddressNameInfo';
import TokenSelect from './tokenSelect/TokenSelect';

interface Props {
  addressQuery: UseQueryResult<TAddress, ResourceError>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressDetails = ({ addressQuery, scrollRef }: Props) => {
  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);

  const countersQuery = useApiQuery('address_counters', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && Boolean(addressQuery.data),
      placeholderData: ADDRESS_COUNTERS,
    },
  });

  const handleCounterItemClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  const errorData = React.useMemo(() => ({
    hash: addressHash || '',
    is_contract: false,
    implementation_name: null,
    implementation_address: null,
    token: null,
    watchlist_address_id: null,
    watchlist_names: null,
    creation_tx_hash: null,
    block_number_balance_updated_at: null,
    name: null,
    exchange_rate: null,
    coin_balance: null,
    has_tokens: true,
    has_token_transfers: true,
    has_validated_blocks: false,
  }), [ addressHash ]);

  const is404Error = addressQuery.isError && 'status' in addressQuery.error && addressQuery.error.status === 404;
  const is422Error = addressQuery.isError && 'status' in addressQuery.error && addressQuery.error.status === 422;

  if (addressQuery.isError && is422Error) {
    throw Error('Address fetch error', { cause: addressQuery.error as unknown as Error });
  }

  if (addressQuery.isError && !is404Error) {
    return <DataFetchAlert/>;
  }

  const data = addressQuery.isError ? errorData : addressQuery.data;

  if (!data) {
    return null;
  }

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 1, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
    >
      <AddressNameInfo data={ data } isLoading={ addressQuery.isPlaceholderData }/>
      { data.is_contract && data.creation_tx_hash && data.creator_address_hash && (
        <DetailsInfoItem
          title="Creator"
          hint="Transaction and address of creation"
          isLoading={ addressQuery.isPlaceholderData }
        >
          <AddressEntity
            address={{ hash: data.creator_address_hash }}
            truncation="constant"
            noIcon
          />
          <Text whiteSpace="pre"> at txn </Text>
          <TxEntity hash={ data.creation_tx_hash } truncation="constant" noIcon noCopy={ false }/>
        </DetailsInfoItem>
      ) }
      { data.is_contract && data.implementation_address && (
        <DetailsInfoItem
          title="Implementation"
          hint="Implementation address of the proxy contract"
          columnGap={ 1 }
        >
          <AddressEntity
            address={{ hash: data.implementation_address, name: data.implementation_name, is_contract: true }}
            isLoading={ addressQuery.isPlaceholderData }
            noIcon
          />
        </DetailsInfoItem>
      ) }
      <AddressBalance data={ data } isLoading={ addressQuery.isPlaceholderData }/>
      { data.has_tokens && (
        <DetailsInfoItem
          title="Tokens"
          hint="All tokens in the account and total value"
          alignSelf="center"
          py={ 0 }
        >
          { addressQuery.data ? <TokenSelect onClick={ handleCounterItemClick }/> : <Box py="6px">0</Box> }
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Transactions"
        hint="Number of transactions related to this address"
        isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
      >
        { addressQuery.data ? (
          <AddressCounterItem
            prop="transactions_count"
            query={ countersQuery }
            address={ data.hash }
            onClick={ handleCounterItemClick }
            isAddressQueryLoading={ addressQuery.isPlaceholderData }
          />
        ) :
          0 }
      </DetailsInfoItem>
      { data.has_token_transfers && (
        <DetailsInfoItem
          title="Transfers"
          hint="Number of transfers to/from this address"
          isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
        >
          { addressQuery.data ? (
            <AddressCounterItem
              prop="token_transfers_count"
              query={ countersQuery }
              address={ data.hash }
              onClick={ handleCounterItemClick }
              isAddressQueryLoading={ addressQuery.isPlaceholderData }
            />
          ) :
            0 }
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Gas used"
        hint="Gas used by the address"
        isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
      >
        { addressQuery.data ? (
          <AddressCounterItem
            prop="gas_usage_count"
            query={ countersQuery }
            address={ data.hash }
            onClick={ handleCounterItemClick }
            isAddressQueryLoading={ addressQuery.isPlaceholderData }
          />
        ) :
          0 }
      </DetailsInfoItem>
      { data.has_validated_blocks && (
        <DetailsInfoItem
          title="Blocks validated"
          hint="Number of blocks validated by this validator"
          isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
        >
          { addressQuery.data ? (
            <AddressCounterItem
              prop="validations_count"
              query={ countersQuery }
              address={ data.hash }
              onClick={ handleCounterItemClick }
              isAddressQueryLoading={ addressQuery.isPlaceholderData }
            />
          ) :
            0 }
        </DetailsInfoItem>
      ) }
      { data.block_number_balance_updated_at && (
        <DetailsInfoItem
          title="Last balance update"
          hint="Block number in which the address was updated"
          alignSelf="center"
          py={{ base: '2px', lg: 1 }}
          isLoading={ addressQuery.isPlaceholderData }
        >
          <BlockEntity
            number={ data.block_number_balance_updated_at }
            isLoading={ addressQuery.isPlaceholderData }
          />
        </DetailsInfoItem>
      ) }
      <DetailsSponsoredItem isLoading={ addressQuery.isPlaceholderData }/>
    </Grid>
  );
};

export default React.memo(AddressDetails);
