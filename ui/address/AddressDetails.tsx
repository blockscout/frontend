import { Box, Flex, Text, Icon, Grid, Link } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address as TAddress, AddressCounters, AddressTokenBalance } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import ExternalLink from 'ui/shared/ExternalLink';
import HashStringShorten from 'ui/shared/HashStringShorten';

import AddressAddToMetaMask from './details/AddressAddToMetaMask';
import AddressBalance from './details/AddressBalance';
import AddressDetailsSkeleton from './details/AddressDetailsSkeleton';
import AddressFavoriteButton from './details/AddressFavoriteButton';
import AddressNameInfo from './details/AddressNameInfo';
import AddressQrCode from './details/AddressQrCode';
import TokenSelect from './tokenSelect/TokenSelect';

interface Props {
  addressQuery: UseQueryResult<TAddress>;
}

const AddressDetails = ({ addressQuery }: Props) => {
  const router = useRouter();
  const fetch = useFetch();
  const isMobile = useIsMobile();

  const countersQuery = useQuery<unknown, unknown, AddressCounters>(
    [ QueryKeys.addressCounters, router.query.id ],
    async() => await fetch(`/node-api/addresses/${ router.query.id }/counters`),
    {
      enabled: Boolean(router.query.id) && Boolean(addressQuery.data),
    },
  );

  const tokenBalancesQuery = useQuery<unknown, unknown, Array<AddressTokenBalance>>(
    [ QueryKeys.addressTokenBalances, router.query.id ],
    async() => await fetch(`/node-api/addresses/${ router.query.id }/token-balances`),
    {
      enabled: Boolean(router.query.id) && Boolean(addressQuery.data),
    },
  );

  if (addressQuery.isError) {
    throw Error('Address fetch error', { cause: addressQuery.error as unknown as Error });
  }

  if (countersQuery.isLoading || addressQuery.isLoading || tokenBalancesQuery.isLoading) {
    return <AddressDetailsSkeleton/>;
  }

  if (countersQuery.isError || addressQuery.isError || tokenBalancesQuery.isError) {
    return <DataFetchAlert/>;
  }

  const explorers = appConfig.network.explorers.filter(({ paths }) => paths.address);
  const validationsCount = Number(countersQuery.data.validations_count);

  return (
    <Box>
      <Flex alignItems="center">
        <AddressIcon hash={ addressQuery.data.hash }/>
        <Text ml={ 2 } fontFamily="heading" fontWeight={ 500 }>
          { isMobile ? <HashStringShorten hash={ addressQuery.data.hash }/> : addressQuery.data.hash }
        </Text>
        <CopyToClipboard text={ addressQuery.data.hash }/>
        { addressQuery.data.is_contract && addressQuery.data.token && <AddressAddToMetaMask ml={ 2 } token={ addressQuery.data.token }/> }
        <AddressFavoriteButton hash={ addressQuery.data.hash } isAdded={ Boolean(addressQuery.data.watchlist_names?.length) } ml={ 3 }/>
        <AddressQrCode hash={ addressQuery.data.hash } ml={ 2 }/>
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
        <AddressNameInfo data={ addressQuery.data }/>
        { addressQuery.data.is_contract && addressQuery.data.creation_tx_hash && addressQuery.data.creator_address_hash && (
          <DetailsInfoItem
            title="Creator"
            hint="Transaction and address of creation."
          >
            <AddressLink hash={ addressQuery.data.creator_address_hash } truncation="constant"/>
            <Text whiteSpace="pre"> at </Text>
            <AddressLink hash={ addressQuery.data.creation_tx_hash } truncation="constant"/>
          </DetailsInfoItem>
        ) }
        <AddressBalance data={ addressQuery.data }/>
        <DetailsInfoItem
          title="Tokens"
          hint="All tokens in the account and total value."
          alignSelf="center"
          py={ 0 }
        >
          <TokenSelect/>
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Transactions"
          hint="Number of transactions related to this address."
        >
          { Number(countersQuery.data.transactions_count).toLocaleString() }
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Transfers"
          hint="Number of transfers to/from this address."
        >
          { Number(countersQuery.data.token_transfers_count).toLocaleString() }
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Gas used"
          hint="Gas used by the address."
        >
          { BigNumber(countersQuery.data.gas_usage_count).toFormat() }
        </DetailsInfoItem>
        { !Object.is(validationsCount, NaN) && validationsCount > 0 && (
          <DetailsInfoItem
            title="Blocks validated"
            hint="Number of blocks validated by this validator."
          >
            { validationsCount.toLocaleString() }
          </DetailsInfoItem>
        ) }
        { addressQuery.data.block_number_balance_updated_at && (
          <DetailsInfoItem
            title="Last balance update"
            hint="Block number in which the address was updated."
            alignSelf="center"
            py={{ base: '2px', lg: 1 }}
          >
            <Link
              href={ link('block', { id: String(addressQuery.data.block_number_balance_updated_at) }) }
              display="flex"
              alignItems="center"
            >
              <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 }/>
              { addressQuery.data.block_number_balance_updated_at }
            </Link>
          </DetailsInfoItem>
        ) }
      </Grid>
    </Box>
  );
};

export default React.memo(AddressDetails);
