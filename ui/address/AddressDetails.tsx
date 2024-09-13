import { Box, Text, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressCounterItem from 'ui/address/details/AddressCounterItem';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import AddressBalance from './details/AddressBalance';
import AddressImplementations from './details/AddressImplementations';
import AddressNameInfo from './details/AddressNameInfo';
import AddressNetWorth from './details/AddressNetWorth';
import AddressSaveOnGas from './details/AddressSaveOnGas';
import TokenSelect from './tokenSelect/TokenSelect';
import useAddressCountersQuery from './utils/useAddressCountersQuery';
import type { AddressQuery } from './utils/useAddressQuery';

interface Props {
  addressQuery: AddressQuery;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressDetails = ({ addressQuery, scrollRef }: Props) => {
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
    implementations: null,
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
          <>
            <DetailsInfoItem.Label
              hint="Transaction and address of creation"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Creator
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
              <AddressEntity
                address={{ hash: data.creator_address_hash }}
                truncation="constant"
                noIcon
              />
              <Text whiteSpace="pre"> at txn </Text>
              <TxEntity hash={ data.creation_tx_hash } truncation="constant" noIcon noCopy={ false }/>
            </DetailsInfoItem.Value>
          </>
        ) }
        { data.is_contract && data.implementations && data.implementations?.length > 0 && (
          <AddressImplementations
            data={ data.implementations }
            isLoading={ addressQuery.isPlaceholderData }
          />
        ) }

        <AddressBalance data={ data } isLoading={ addressQuery.isPlaceholderData }/>

        { data.has_tokens && (
          <>
            <DetailsInfoItem.Label
              hint="All tokens in the account and total value"
            >
              Tokens
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value py={ addressQuery.data ? 0 : undefined }>
              { addressQuery.data ? <TokenSelect onClick={ handleCounterItemClick }/> : <Box>0</Box> }
            </DetailsInfoItem.Value>
          </>
        ) }
        { (config.features.multichainButton.isEnabled || (data.exchange_rate && data.has_tokens)) && (
          <>
            <DetailsInfoItem.Label
              hint="Total net worth in USD of all tokens for the address"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Net worth
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value alignSelf="center" py={ 0 }>
              <AddressNetWorth addressData={ addressQuery.data } addressHash={ addressHash } isLoading={ addressQuery.isPlaceholderData }/>
            </DetailsInfoItem.Value>
          </>
        )
        }

        <DetailsInfoItem.Label
          hint="Number of transactions related to this address"
          isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
        >
          Transactions
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
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
        </DetailsInfoItem.Value>

        { data.has_token_transfers && (
          <>
            <DetailsInfoItem.Label
              hint="Number of transfers to/from this address"
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              Transfers
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { countersQuery.data?.gas_usage_count && (
          <>
            <DetailsInfoItem.Label
              hint="Gas used by the address"
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              Gas used
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
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
              { !countersQuery.isPlaceholderData && countersQuery.data?.gas_usage_count && (
                <AddressSaveOnGas
                  gasUsed={ countersQuery.data.gas_usage_count }
                  address={ data.hash }
                />
              ) }
            </DetailsInfoItem.Value>
          </>
        ) }

        { data.has_validated_blocks && (
          <>
            <DetailsInfoItem.Label
              hint={ `Number of blocks ${ getNetworkValidationActionText() } by this ${ getNetworkValidatorTitle() }` }
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              { `Blocks ${ getNetworkValidationActionText() }` }
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
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
            </DetailsInfoItem.Value>
          </>
        ) }

        { data.block_number_balance_updated_at && (
          <>
            <DetailsInfoItem.Label
              hint="Block number in which the address was updated"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Last balance update
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
              <BlockEntity
                number={ data.block_number_balance_updated_at }
                isLoading={ addressQuery.isPlaceholderData }
              />
            </DetailsInfoItem.Value>
          </>
        ) }

        <DetailsSponsoredItem isLoading={ addressQuery.isPlaceholderData }/>
      </Grid>
    </>
  );
};

export default React.memo(AddressDetails);
