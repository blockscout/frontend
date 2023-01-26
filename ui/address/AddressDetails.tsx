import { Box, Flex, Text, Icon, Grid, Link } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import ExternalLink from 'ui/shared/ExternalLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import AddressAddToMetaMask from './details/AddressAddToMetaMask';
import AddressBalance from './details/AddressBalance';
import AddressDetailsSkeleton from './details/AddressDetailsSkeleton';
import AddressFavoriteButton from './details/AddressFavoriteButton';
import AddressNameInfo from './details/AddressNameInfo';
import AddressQrCode from './details/AddressQrCode';
import TokenSelect from './tokenSelect/TokenSelect';

interface Props {
  addressQuery: UseQueryResult<TAddress, ResourceError>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressDetails = ({ addressQuery, scrollRef }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const addressHash = router.query.id?.toString();

  const countersQuery = useApiQuery('address_counters', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(router.query.id) && Boolean(addressQuery.data),
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

  const explorers = appConfig.network.explorers.filter(({ paths }) => paths.address);
  const data = addressQuery.isError ? errorData : addressQuery.data;

  return (
    <Box>
      <Flex alignItems="center">
        <AddressIcon address={ data }/>
        <Text ml={ 2 } fontFamily="heading" fontWeight={ 500 }>
          { isMobile ? <HashStringShorten hash={ data.hash }/> : data.hash }
        </Text>
        <CopyToClipboard text={ data.hash }/>
        { data.is_contract && data.token && <AddressAddToMetaMask ml={ 2 } token={ data.token }/> }
        { !data.is_contract && (
          <AddressFavoriteButton hash={ data.hash } isAdded={ Boolean(data.watchlist_names?.length) } ml={ 3 }/>
        ) }
        <AddressQrCode hash={ data.hash } ml={ 2 }/>
      </Flex>
      { explorers.length > 0 && (
        <Flex mt={ 8 } columnGap={ 4 } flexWrap="wrap">
          <Text fontSize="sm">Verify with other explorers</Text>
          { explorers.map((explorer) => {
            const url = new URL(explorer.paths.tx + '/' + router.query.id, explorer.baseUrl);
            return <ExternalLink key={ explorer.baseUrl } title={ explorer.title } href={ url.toString() }/>;
          }) }
        </Flex>
      ) }
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
            hint="Transaction and address of creation."
          >
            <AddressLink type="address" hash={ data.creator_address_hash } truncation="constant"/>
            <Text whiteSpace="pre"> at txn </Text>
            <AddressLink hash={ data.creation_tx_hash } type="transaction" truncation="constant"/>
          </DetailsInfoItem>
        ) }
        { data.is_contract && data.implementation_address && (
          <DetailsInfoItem
            title="Implementation"
            hint="Implementation address of the proxy contract."
            columnGap={ 1 }
          >
            <Link href={ link('address_index', { id: data.implementation_address }) }>{ data.implementation_name }</Link>
            <Text variant="secondary" overflow="hidden">
              <HashStringShortenDynamic hash={ `(${ data.implementation_address })` }/>
            </Text>
          </DetailsInfoItem>
        ) }
        <AddressBalance data={ data }/>
        { data.has_tokens && (
          <DetailsInfoItem
            title="Tokens"
            hint="All tokens in the account and total value."
            alignSelf="center"
            py={ 0 }
          >
            { addressQuery.data ? <TokenSelect onClick={ handleCounterItemClick }/> : <Box py="6px">0</Box> }
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Transactions"
          hint="Number of transactions related to this address."
        >
          { addressQuery.data ?
            <AddressCounterItem prop="transactions_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
            0 }
        </DetailsInfoItem>
        { data.has_token_transfers && (
          <DetailsInfoItem
            title="Transfers"
            hint="Number of transfers to/from this address."
          >
            { addressQuery.data ?
              <AddressCounterItem prop="token_transfers_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
              0 }
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Gas used"
          hint="Gas used by the address."
        >
          { addressQuery.data ?
            <AddressCounterItem prop="gas_usage_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
            0 }
        </DetailsInfoItem>
        { data.has_validated_blocks && (
          <DetailsInfoItem
            title="Blocks validated"
            hint="Number of blocks validated by this validator."
          >
            { addressQuery.data ?
              <AddressCounterItem prop="validations_count" query={ countersQuery } address={ data.hash } onClick={ handleCounterItemClick }/> :
              0 }
          </DetailsInfoItem>
        ) }
        { data.block_number_balance_updated_at && (
          <DetailsInfoItem
            title="Last balance update"
            hint="Block number in which the address was updated."
            alignSelf="center"
            py={{ base: '2px', lg: 1 }}
          >
            <Link
              href={ link('block', { id: String(data.block_number_balance_updated_at) }) }
              display="flex"
              alignItems="center"
            >
              <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 }/>
              { data.block_number_balance_updated_at }
            </Link>
          </DetailsInfoItem>
        ) }
      </Grid>
    </Box>
  );
};

export default React.memo(AddressDetails);
