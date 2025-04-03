import { Box, Text } from '@chakra-ui/react';
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
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

import AddressAlternativeFormat from './details/AddressAlternativeFormat';
import AddressBalance from './details/AddressBalance';
import AddressImplementations from './details/AddressImplementations';
import AddressNameInfo from './details/AddressNameInfo';
import AddressNetWorth from './details/AddressNetWorth';
import AddressSaveOnGas from './details/AddressSaveOnGas';
import FilecoinActorTag from './filecoin/FilecoinActorTag';
import TokenSelect from './tokenSelect/TokenSelect';
import useAddressCountersQuery from './utils/useAddressCountersQuery';
import type { AddressQuery } from './utils/useAddressQuery';

interface Props {
  addressQuery: AddressQuery;
}

const AddressDetails = ({ addressQuery }: Props) => {
  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);

  const countersQuery = useAddressCountersQuery({
    hash: addressHash,
    addressQuery,
  });

  const error404Data = React.useMemo(() => ({
    hash: addressHash || '',
    is_contract: false,
    implementations: null,
    token: null,
    watchlist_address_id: null,
    watchlist_names: null,
    creation_transaction_hash: null,
    block_number_balance_updated_at: null,
    name: null,
    exchange_rate: null,
    coin_balance: null,
    has_tokens: true,
    has_token_transfers: true,
    has_validated_blocks: false,
    filecoin: undefined,
    creator_filecoin_robust_address: null,
    creator_address_hash: null,
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

  const creatorAddressHash = data.creator_address_hash;

  return (
    <>
      { addressQuery.isDegradedData && <ServiceDegradationWarning isLoading={ addressQuery.isPlaceholderData } mb={ 6 }/> }
      <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} >
        <AddressAlternativeFormat isLoading={ addressQuery.isPlaceholderData } addressHash={ addressHash }/>

        { data.filecoin?.id && (
          <>
            <DetailedInfo.ItemLabel
              hint="Short identifier of an address that may change with chain state updates"
            >
              ID
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Text>{ data.filecoin.id }</Text>
              <CopyToClipboard text={ data.filecoin.id }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.filecoin?.actor_type && (
          <>
            <DetailedInfo.ItemLabel
              hint="Identifies the purpose and behavior of the address on the Filecoin network"
            >
              Actor
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <FilecoinActorTag actorType={ data.filecoin.actor_type }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { (data.filecoin?.actor_type === 'evm' || data.filecoin?.actor_type === 'ethaccount') && data?.filecoin?.robust && (
          <>
            <DetailedInfo.ItemLabel
              hint="0x-style address to which the Filecoin address is assigned by the Ethereum Address Manager"
            >
              Ethereum Address
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="nowrap">
              <AddressEntity
                address={{ hash: data.hash }}
                noIcon
                noLink
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        <AddressNameInfo data={ data } isLoading={ addressQuery.isPlaceholderData }/>

        { data.is_contract && data.creation_transaction_hash && (creatorAddressHash) && (
          <>
            <DetailedInfo.ItemLabel
              hint="Transaction and address of creation"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Creator
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressEntity
                address={{ hash: creatorAddressHash, filecoin: { robust: data.creator_filecoin_robust_address } }}
                truncation="constant"
                noIcon
              />
              <Text whiteSpace="pre"> at txn </Text>
              <TxEntity hash={ data.creation_transaction_hash } truncation="constant" noIcon noCopy={ false }/>
            </DetailedInfo.ItemValue>
          </>
        ) }
        { !addressQuery.isPlaceholderData && data.is_contract && data.implementations && data.implementations?.length > 0 && (
          <AddressImplementations
            data={ data.implementations }
            isLoading={ addressQuery.isPlaceholderData }
            proxyType={ data.proxy_type }
          />
        ) }

        <AddressBalance data={ data } isLoading={ addressQuery.isPlaceholderData }/>

        { data.has_tokens && (
          <>
            <DetailedInfo.ItemLabel
              hint="All tokens in the account and total value"
            >
              Tokens
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue py={ addressQuery.data ? 0 : undefined }>
              { addressQuery.data ? <TokenSelect/> : <Box>0</Box> }
            </DetailedInfo.ItemValue>
          </>
        ) }
        { (config.features.multichainButton.isEnabled || (data.exchange_rate && data.has_tokens)) && (
          <>
            <DetailedInfo.ItemLabel
              hint="Total net worth in USD of all tokens for the address"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Net worth
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue alignSelf="center" py={ 0 }>
              <AddressNetWorth addressData={ addressQuery.data } addressHash={ addressHash } isLoading={ addressQuery.isPlaceholderData }/>
            </DetailedInfo.ItemValue>
          </>
        )
        }

        <DetailedInfo.ItemLabel
          hint="Number of transactions related to this address"
          isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
        >
          Transactions
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { addressQuery.data ? (
            <AddressCounterItem
              prop="transactions_count"
              query={ countersQuery }
              address={ data.hash }
              isAddressQueryLoading={ addressQuery.isPlaceholderData }
              isDegradedData={ addressQuery.isDegradedData }
            />
          ) :
            0 }
        </DetailedInfo.ItemValue>

        { data.has_token_transfers && (
          <>
            <DetailedInfo.ItemLabel
              hint="Number of transfers to/from this address"
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              Transfers
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="token_transfers_count"
                  query={ countersQuery }
                  address={ data.hash }
                  isAddressQueryLoading={ addressQuery.isPlaceholderData }
                  isDegradedData={ addressQuery.isDegradedData }
                />
              ) :
                0 }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { countersQuery.data?.gas_usage_count && (
          <>
            <DetailedInfo.ItemLabel
              hint="Gas used by the address"
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              Gas used
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="gas_usage_count"
                  query={ countersQuery }
                  address={ data.hash }
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
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.has_validated_blocks && (
          <>
            <DetailedInfo.ItemLabel
              hint={ `Number of blocks ${ getNetworkValidationActionText() } by this ${ getNetworkValidatorTitle() }` }
              isLoading={ addressQuery.isPlaceholderData || countersQuery.isPlaceholderData }
            >
              { `Blocks ${ getNetworkValidationActionText() }` }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { addressQuery.data ? (
                <AddressCounterItem
                  prop="validations_count"
                  query={ countersQuery }
                  address={ data.hash }
                  isAddressQueryLoading={ addressQuery.isPlaceholderData }
                  isDegradedData={ addressQuery.isDegradedData }
                />
              ) :
                0 }
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.block_number_balance_updated_at && (
          <>
            <DetailedInfo.ItemLabel
              hint="Block number in which the address was updated"
              isLoading={ addressQuery.isPlaceholderData }
            >
              Last balance update
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <BlockEntity
                number={ data.block_number_balance_updated_at }
                isLoading={ addressQuery.isPlaceholderData }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfoSponsoredItem isLoading={ addressQuery.isPlaceholderData }/>
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(AddressDetails);
