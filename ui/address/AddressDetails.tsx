import { Box, Text, Grid } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import AddressBalance from './details/AddressBalance';
import AddressNameInfo from './details/AddressNameInfo';
import TokenSelect from './tokenSelect/TokenSelect';
import useAddressCountersQuery from './utils/useAddressCountersQuery';
import type { AddressQuery } from './utils/useAddressQuery';

interface Props {
  addressQuery: AddressQuery;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressDetails = ({ addressQuery, scrollRef }: Props) => {
  const { t } = useTranslation('common');

  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);

  const countersQuery = useAddressCountersQuery({
    hash: addressHash,
    addressQuery,
  });

  const handleCounterItemClick = React.useCallback(() => {
    window.setTimeout(() => {
      // cannot do scroll instantly, have to wait a little
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }, [ scrollRef ]);

  const error404Data = React.useMemo(() => ({
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

  // error handling (except 404 codes)
  if (addressQuery.isError) {
    if (isCustomAppError(addressQuery.error)) {
      const is404Error = addressQuery.isError && 'status' in addressQuery.error && addressQuery.error.status === 404;
      if (!is404Error) {
        throwOnResourceLoadError(addressQuery);
      }
    } else {
      return <DataFetchAlert/>;
    }
  }

  const data = addressQuery.isError ? error404Data : addressQuery.data;

  if (!data) {
    return null;
  }

  return (
    <>
      { addressQuery.isDegradedData && <ServiceDegradationWarning isLoading={ addressQuery.isPlaceholderData } mb={ 6 }/> }
      <Grid
        columnGap={ 8 }
        rowGap={{ base: 1, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
      >
        <AddressNameInfo data={ data } isLoading={ addressQuery.isPlaceholderData }/>
        { data.is_contract && data.creation_tx_hash && data.creator_address_hash && (
          <DetailsInfoItem
            title={ t('address_area.Creator') }
            hint={ t('address_area.Transaction_and_address_of_creation') }
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
            title={ t('address_area.Implementation') }
            hint={ t('address_area.Implementation_address_of_the_proxy_contract') }
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
            title={ t('address_area.Tokens') }
            hint={ t('address_area.All_tokens_in_the_account_and_total_value') }
            alignSelf="center"
            py={ 0 }
          >
            { addressQuery.data ? <TokenSelect onClick={ handleCounterItemClick }/> : <Box py="6px">0</Box> }
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title={ t('address_area.Transactions') }
          hint={ t('address_area.Number_of_transactions_related_to_this_address') }
          isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
        >
          { addressQuery.data ? (
            <AddressCounterItem
              prop="transactions_count"
              query={ countersQuery }
              address={ data.hash }
              onClick={ handleCounterItemClick }
              isAddressQueryLoading={ addressQuery.isPlaceholderData }
              isDegradedData={ addressQuery.isDegradedData }
            />
          ) :
            0 }
        </DetailsInfoItem>
        { data.has_token_transfers && (
          <DetailsInfoItem
            title={ t('address_area.Transfers') }
            hint={ t('address_area.Number_of_transfers_to_from_this_address') }
            isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
          >
            { addressQuery.data ? (
              <AddressCounterItem
                prop="token_transfers_count"
                query={ countersQuery }
                address={ data.hash }
                onClick={ handleCounterItemClick }
                isAddressQueryLoading={ addressQuery.isPlaceholderData }
                isDegradedData={ addressQuery.isDegradedData }
              />
            ) :
              0 }
          </DetailsInfoItem>
        ) }
        { countersQuery.data?.gas_usage_count && (
          <DetailsInfoItem
            title={ t('address_area.Gas_used') }
            hint={ t('address_area.Gas_used_by_the_address') }
            isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
          >
            { addressQuery.data ? (
              <AddressCounterItem
                prop="gas_usage_count"
                query={ countersQuery }
                address={ data.hash }
                onClick={ handleCounterItemClick }
                isAddressQueryLoading={ addressQuery.isPlaceholderData }
                isDegradedData={ addressQuery.isDegradedData }
              />
            ) :
              0 }
          </DetailsInfoItem>
        ) }
        { data.has_validated_blocks && (
          <DetailsInfoItem
            title={ t('address_area.Blocks_validated') }
            hint={ t('address_area.Number_of_blocks_validated_by_this_validator') }
            isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
          >
            { addressQuery.data ? (
              <AddressCounterItem
                prop="validations_count"
                query={ countersQuery }
                address={ data.hash }
                onClick={ handleCounterItemClick }
                isAddressQueryLoading={ addressQuery.isPlaceholderData }
                isDegradedData={ addressQuery.isDegradedData }
              />
            ) :
              0 }
          </DetailsInfoItem>
        ) }
        { data.block_number_balance_updated_at && (
          <DetailsInfoItem
            title={ t('address_area.Last_balance_update') }
            hint={ t('address_area.Block_number_in_which_the_address_was_updated') }
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
    </>
  );
};

export default React.memo(AddressDetails);
