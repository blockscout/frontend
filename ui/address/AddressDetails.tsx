import { Box, Flex, Text, Icon, Grid, Link } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
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

import AddressAddToMetaMask from './details/AddressAddToMetaMask';
import AddressBalance from './details/AddressBalance';
import AddressDetailsSkeleton from './details/AddressDetailsSkeleton';
import AddressFavoriteButton from './details/AddressFavoriteButton';
import AddressNameInfo from './details/AddressNameInfo';
import AddressQrCode from './details/AddressQrCode';
import TokenSelect from './tokenSelect/TokenSelect';

interface Props {
  addressQuery: UseQueryResult<TAddress>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressDetails = ({ addressQuery, scrollRef }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const countersQuery = useApiQuery('address_counters', {
    pathParams: { id: router.query.id?.toString() },
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

  if (addressQuery.isError) {
    throw Error('Address fetch error', { cause: addressQuery.error as unknown as Error });
  }

  if (addressQuery.isLoading) {
    return <AddressDetailsSkeleton/>;
  }

  if (addressQuery.isError) {
    return <DataFetchAlert/>;
  }

  const explorers = appConfig.network.explorers.filter(({ paths }) => paths.address);

  return (
    <Box>
      <Flex alignItems="center">
        <AddressIcon address={ addressQuery.data }/>
        <Text ml={ 2 } fontFamily="heading" fontWeight={ 500 }>
          { isMobile ? <HashStringShorten hash={ addressQuery.data.hash }/> : addressQuery.data.hash }
        </Text>
        <CopyToClipboard text={ addressQuery.data.hash }/>
        { addressQuery.data.is_contract && addressQuery.data.token && <AddressAddToMetaMask ml={ 2 } token={ addressQuery.data.token }/> }
        { !addressQuery.data.is_contract && (
          <AddressFavoriteButton hash={ addressQuery.data.hash } isAdded={ Boolean(addressQuery.data.watchlist_names?.length) } ml={ 3 }/>
        ) }
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
            <AddressLink hash={ addressQuery.data.creation_tx_hash } type="transaction" truncation="constant"/>
          </DetailsInfoItem>
        ) }
        <AddressBalance data={ addressQuery.data }/>
        { addressQuery.data.has_tokens && (
          <DetailsInfoItem
            title="Tokens"
            hint="All tokens in the account and total value."
            alignSelf="center"
            py={ 0 }
          >
            <TokenSelect/>
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Transactions"
          hint="Number of transactions related to this address."
        >
          <AddressCounterItem prop="transactions_count" query={ countersQuery } address={ addressQuery.data.hash } onClick={ handleCounterItemClick }/>
        </DetailsInfoItem>
        { addressQuery.data.has_token_transfers && (
          <DetailsInfoItem
            title="Transfers"
            hint="Number of transfers to/from this address."
          >
            <AddressCounterItem prop="token_transfers_count" query={ countersQuery } address={ addressQuery.data.hash } onClick={ handleCounterItemClick }/>
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Gas used"
          hint="Gas used by the address."
        >
          <AddressCounterItem prop="gas_usage_count" query={ countersQuery } address={ addressQuery.data.hash } onClick={ handleCounterItemClick }/>
        </DetailsInfoItem>
        { addressQuery.data.has_validated_blocks && (
          <DetailsInfoItem
            title="Blocks validated"
            hint="Number of blocks validated by this validator."
          >
            <AddressCounterItem prop="validations_count" query={ countersQuery } address={ addressQuery.data.hash } onClick={ handleCounterItemClick }/>
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
