// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import type { AddressCountersQuery } from 'client/slices/address/hooks/useAddressCountersQuery';
import type { AddressQuery } from 'client/slices/address/hooks/useAddressQuery';
import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import ContractCreationStatus from 'client/slices/contract/components/ContractCreationStatus';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';

import Address3rdPartyWidgets from 'client/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'client/features/address-3rd-party-widgets/pages/address/useAddress3rdPartyWidgets';
import AddressCeloAccount from 'client/features/chain-variants/celo/pages/address/AddressCeloAccount';
import FilecoinActorTag from 'client/features/chain-variants/filecoin/pages/address/FilecoinActorTag';

import getChainValidationActionText from 'client/shared/chain/get-chain-validation-action-text';
import getChainValidatorTitle from 'client/shared/chain/get-chain-validator-title';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';

import AddressAlternativeFormat from './AddressAlternativeFormat';
import AddressBalance from './AddressBalance';
import AddressCounterItem from './AddressCounterItem';
import AddressImplementations from './AddressImplementations';
import AddressNameInfo from './AddressNameInfo';
import AddressNetWorth from './AddressNetWorth';
import TokenSelect from './token-select/TokenSelect';

interface Props {
  addressQuery: AddressQuery;
  countersQuery: AddressCountersQuery;
  isLoading?: boolean;
}

const AddressDetails = ({ addressQuery, countersQuery, isLoading }: Props) => {
  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);

  const addressType = addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'contract' : 'eoa';
  const address3rdPartyWidgets = useAddress3rdPartyWidgets(addressType, addressQuery.isPlaceholderData);

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
    celo: undefined,
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
      { addressQuery.isDegradedData && <ServiceDegradationWarning isLoading={ isLoading } mb={ 6 }/> }
      <DetailedInfo.Container>

        { data.celo?.account && (
          <AddressCeloAccount data={ data.celo.account } isLoading={ isLoading }/>
        ) }

        <AddressAlternativeFormat isLoading={ isLoading } addressHash={ addressHash }/>

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

        <AddressNameInfo data={ data } isLoading={ isLoading }/>

        { data.is_contract && data.creation_transaction_hash && (creatorAddressHash) && (
          <>
            <DetailedInfo.ItemLabel
              hint="Transaction and address of creation"
              isLoading={ isLoading }
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
              <TxEntity hash={ data.creation_transaction_hash } truncation="constant" noIcon/>
              { data.creation_status && <ContractCreationStatus status={ data.creation_status } ml={{ base: 0, lg: 2 }}/> }
            </DetailedInfo.ItemValue>
          </>
        ) }
        { !isLoading && data.is_contract && data.implementations && data.implementations?.length > 0 && (
          <AddressImplementations
            data={ data.implementations }
            isLoading={ isLoading }
            proxyType={ data.proxy_type }
          />
        ) }

        <AddressBalance data={ data } isLoading={ isLoading }/>

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
              isLoading={ isLoading }
            >
              Net worth
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <AddressNetWorth addressData={ addressQuery.data } addressHash={ addressHash } isLoading={ isLoading }/>
            </DetailedInfo.ItemValue>
          </>
        )
        }

        <DetailedInfo.ItemLabel
          hint="Number of transactions related to this address"
          isLoading={ isLoading || countersQuery.isPlaceholderData }
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
              isLoading={ isLoading || countersQuery.isPlaceholderData }
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
              isLoading={ isLoading || countersQuery.isPlaceholderData }
            >
              Gas used
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
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
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.has_validated_blocks && (
          <>
            <DetailedInfo.ItemLabel
              hint={ `Number of blocks ${ getChainValidationActionText() } by this ${ getChainValidatorTitle() }` }
              isLoading={ isLoading || countersQuery.isPlaceholderData }
            >
              { `Blocks ${ getChainValidationActionText() }` }
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
              isLoading={ isLoading }
            >
              Last balance update
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <BlockEntity
                number={ data.block_number_balance_updated_at }
                isLoading={ isLoading }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfoSponsoredItem isLoading={ isLoading }/>

        { (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.items.length > 0) && (
          <>
            <DetailedInfo.ItemLabel
              hint="Metrics provided by third party partners"
              isLoading={ address3rdPartyWidgets.configQuery.isPlaceholderData || addressQuery.isPlaceholderData }
            >
              Widgets
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Address3rdPartyWidgets
                addressType={ addressType }
                isLoading={ addressQuery.isPlaceholderData }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }
      </DetailedInfo.Container>
    </>
  );
};

export default React.memo(AddressDetails);
