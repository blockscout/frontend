import { Box, Text, Icon, Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import blockIcon from 'icons/block.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import AddressLink from 'ui/shared/address/AddressLink';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import NetworkExplorers from 'ui/shared/NetworkExplorers';

import AddressBalance from './details/AddressBalance';
import AddressDetailsSkeleton from './details/AddressDetailsSkeleton';
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

  if (addressQuery.isLoading) {
    return <AddressDetailsSkeleton/>;
  }

  const data = addressQuery.isError ? errorData : addressQuery.data;

  return (
    <Box>
      <AddressHeadingInfo address={ data } token={ data.token } isLinkDisabled/>
      <NetworkExplorers mt={ 8 } type="address" pathParam={ addressHash }/>
      <Grid
        mt={ 8 }
        columnGap={ 8 }
        rowGap={{ base: 1, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
      >
        <AddressNameInfo data={ data }/>
        { data.is_contract && data.creation_tx_hash && data.creator_address_hash && (
          <DetailsInfoItem
            title="Creator"
            hint="Transaction and address of creation"
          >
            <AddressLink type="address" hash={ data.creator_address_hash } truncation="constant"/>
            <Text whiteSpace="pre"> at txn </Text>
            <AddressLink hash={ data.creation_tx_hash } type="transaction" truncation="constant"/>
          </DetailsInfoItem>
        ) }
        { data.is_contract && data.implementation_address && (
          <DetailsInfoItem
            title="Implementation"
            hint="Implementation address of the proxy contract"
            columnGap={ 1 }
          >
            <LinkInternal href={ route({ pathname: '/address/[hash]', query: { hash: data.implementation_address } }) } overflow="hidden">
              { data.implementation_name || <HashStringShortenDynamic hash={ data.implementation_address }/> }
            </LinkInternal>
            { data.implementation_name && (
              <Text variant="secondary" overflow="hidden">
                <HashStringShortenDynamic hash={ `(${ data.implementation_address })` }/>
              </Text>
            ) }
          </DetailsInfoItem>
        ) }
        <AddressBalance data={ data }/>
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
        >
          { addressQuery.data ?
            <AddressCounterItem prop="transactions_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
            0 }
        </DetailsInfoItem>
        { data.has_token_transfers && (
          <DetailsInfoItem
            title="Transfers"
            hint="Number of transfers to/from this address"
          >
            { addressQuery.data ?
              <AddressCounterItem prop="token_transfers_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
              0 }
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Gas used"
          hint="Gas used by the address"
        >
          { addressQuery.data ?
            <AddressCounterItem prop="gas_usage_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
            0 }
        </DetailsInfoItem>
        { data.has_validated_blocks && (
          <DetailsInfoItem
            title="Blocks validated"
            hint="Number of blocks validated by this validator"
          >
            { addressQuery.data ?
              <AddressCounterItem prop="validations_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
              0 }
          </DetailsInfoItem>
        ) }
        { data.block_number_balance_updated_at && (
          <DetailsInfoItem
            title="Last balance update"
            hint="Block number in which the address was updated"
            alignSelf="center"
            py={{ base: '2px', lg: 1 }}
          >
            <LinkInternal
              href={ route({ pathname: '/block/[height]', query: { height: String(data.block_number_balance_updated_at) } }) }
              display="flex"
              alignItems="center"
            >
              <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 }/>
              { data.block_number_balance_updated_at }
            </LinkInternal>
          </DetailsInfoItem>
        ) }
        <DetailsSponsoredItem/>
      </Grid>
    </Box>
  );
};

export default React.memo(AddressDetails);
