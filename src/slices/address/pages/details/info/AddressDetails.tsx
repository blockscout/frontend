// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressCountersQuery } from 'src/slices/address/hooks/useAddressCountersQuery';
import type { AddressQuery } from 'src/slices/address/hooks/useAddressQuery';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import getChainValidationActionText from 'src/slices/chain/verification-type/utils/get-chain-validation-action-text';
import getChainValidatorTitle from 'src/slices/chain/verification-type/utils/get-chain-validator-title';

import Address3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/useAddress3rdPartyWidgets';
import AddressCeloAccount from 'src/features/chain-variants/celo/pages/address/AddressCeloAccount';
import AddressDetailsFilecoin from 'src/features/chain-variants/filecoin/pages/address/AddressDetailsFilecoin';

import config from 'src/config';
import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import ApiDegradationAlert from 'src/shared/api-degradation/ApiDegradationAlert';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoSponsoredItem from 'src/shared/detailed-info/DetailedInfoSponsoredItem';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import AddressAlternativeFormat from './AddressAlternativeFormat';
import AddressBalance from './AddressBalance';
import AddressCreator from './AddressCreator';
import AddressDetailsCounterRow from './AddressDetailsCounterRow';
import AddressImplementations from './AddressImplementations';
import AddressNameInfo from './AddressNameInfo';
import AddressNetWorth from './AddressNetWorth';
import TokenSelect from './token-select/TokenSelect';
import useAddressDetailsData from './useAddressDetailsData';

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

  const detailsData = useAddressDetailsData({ addressQuery, addressHash });

  if (detailsData.status === 'fetch_error') {
    return <ApiFetchAlert/>;
  }

  if (detailsData.status === 'empty') {
    return null;
  }

  const { data } = detailsData;

  return (
    <>
      { addressQuery.isDegradedData && <ApiDegradationAlert isLoading={ isLoading } mb={ 6 }/> }
      <DetailedInfo.Container>

        { data.celo?.account && (
          <AddressCeloAccount data={ data.celo.account } isLoading={ isLoading }/>
        ) }

        <AddressAlternativeFormat isLoading={ isLoading } addressHash={ addressHash }/>

        <AddressDetailsFilecoin data={ data }/>

        <AddressNameInfo data={ data } isLoading={ isLoading }/>

        <AddressCreator data={ data } isLoading={ isLoading }/>
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

        <AddressDetailsCounterRow
          prop="transactions_count"
          label="Transactions"
          hint="Number of transactions related to this address"
          addressQuery={ addressQuery }
          countersQuery={ countersQuery }
          addressHash={ data.hash }
          isLoading={ isLoading }
        />

        { data.has_token_transfers && (
          <AddressDetailsCounterRow
            prop="token_transfers_count"
            label="Transfers"
            hint="Number of transfers to/from this address"
            addressQuery={ addressQuery }
            countersQuery={ countersQuery }
            addressHash={ data.hash }
            isLoading={ isLoading }
          />
        ) }

        { countersQuery.data?.gas_usage_count && Number(countersQuery.data.gas_usage_count) > 0 && (
          <AddressDetailsCounterRow
            prop="gas_usage_count"
            label="Gas used"
            hint="Gas used by the address"
            addressQuery={ addressQuery }
            countersQuery={ countersQuery }
            addressHash={ data.hash }
            isLoading={ isLoading }
            multiRow
          />
        ) }

        { data.has_validated_blocks && (
          <AddressDetailsCounterRow
            prop="validations_count"
            label={ `Blocks ${ getChainValidationActionText() }` }
            hint={ `Number of blocks ${ getChainValidationActionText() } by this ${ getChainValidatorTitle() }` }
            addressQuery={ addressQuery }
            countersQuery={ countersQuery }
            addressHash={ data.hash }
            isLoading={ isLoading }
          />
        ) }

        { data.block_number_balance_updated_at !== null && (
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
