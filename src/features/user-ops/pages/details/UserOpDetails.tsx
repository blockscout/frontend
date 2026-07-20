// SPDX-License-Identifier: LicenseRef-Blockscout

import { GridItem } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { ResourceError } from 'src/api/resources';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import AddressStringOrParam from 'src/slices/address/components/entity/AddressStringOrParam';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';
import UserOpSponsorType from 'src/features/user-ops/components/UserOpSponsorType';
import UserOpStatus from 'src/features/user-ops/components/UserOpStatus';

import config from 'src/config';
import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import GasPriceValue from 'src/shared/values/entity/GasPriceValue';
import Utilization from 'src/shared/values/utilization/Utilization';

import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import UserOpCallData from './UserOpCallData';
import UserOpDecodedCallData from './UserOpDecodedCallData';
import UserOpDetailsActions from './UserOpDetailsActions';

interface Props {
  query: UseQueryResult<schemas['UserOperation'], ResourceError>;
}

const UserOpDetails = ({ query }: Props) => {
  const { data, isPlaceholderData, isError, error } = query;

  const statsQuery = useStatsQuery({ enabled: !isPlaceholderData && !isError });

  if (isError) {
    if (error?.status === 400 || isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <ApiFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const isLoading = isPlaceholderData || statsQuery.isPlaceholderData;

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 220px) minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
        hint="Unique character string assigned to every User operation"
        isLoading={ isLoading }
      >
        User operation hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading } overflow="hidden">
          <UserOpEntity hash={ data.hash } noIcon noLink/>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="The address of the smart contract account"
        isLoading={ isLoading }
      >
        Sender
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressStringOrParam address={ data.sender } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data.execute_target && (
        <>
          <DetailedInfo.ItemLabel
            hint="Target smart contract called by the User operation"
            isLoading={ isLoading }
          >
            Target
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity address={ data.execute_target } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Current User operation state"
        isLoading={ isLoading }
      >
        Status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="wrap" columnGap={ 3 } rowGap={ 1 }>
        <UserOpStatus status={ data.status } loading={ isLoading } my={{ base: '3px', lg: 1 }}/>
        { data.revert_reason && (
          <CollapsibleDetails
            text={ [ 'Show revert reason', 'Hide revert reason' ] }
            variant="secondary"
            noScroll
            isExpanded
            id="CollapsibleDetails__revert-reason"
          >
            <Skeleton
              loading={ isLoading }
              w="100%"
              p={{ base: 3, lg: 4 }}
              bgColor={{ _light: 'red.50', _dark: 'red.900/80' }}
              textStyle="sm"
              borderBottomRadius="md"
              mb={ 4 }
              whiteSpace="normal"
              wordBreak="break-all"
            >
              { data.revert_reason }
            </Skeleton>
          </CollapsibleDetails>
        ) }
      </DetailedInfo.ItemValue>

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint="Date and time of User operation"
            isLoading={ isLoading }
          >
            Timestamp
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>

      ) }
      { !config.slices.tx.hiddenFields?.tx_fee && (
        <>
          <DetailedInfo.ItemLabel
            hint="Total User operation fee"
            isLoading={ isLoading }
          >
            Fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.fee }
            loading={ isLoading }
            exchangeRate={ statsQuery.data?.coin_price }
          />
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Gas limit for the User operation"
        isLoading={ isLoading }
      >
        Gas limit
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { BigNumber(data.gas).toFormat() }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Actual gas amount used by the User operation"
        isLoading={ isLoading }
      >
        Gas used
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { BigNumber(data.gas_used).toFormat() }
        </Skeleton>
        <Utilization
          ml={ 4 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used).dividedBy(BigNumber(data.gas)).toNumber() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Hash of the transaction this User operation belongs to"
        isLoading={ isLoading }
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxEntity hash={ data.transaction_hash } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Block number containing this User operation"
        isLoading={ isLoading }
      >
        Block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <BlockEntity number={ Number(data.block_number) } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Contract that executes bundles of User operations"
        isLoading={ isLoading }
      >
        Entry point
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressStringOrParam address={ data.entry_point } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { config.features.txInterpretation.isEnabled && <UserOpDetailsActions hash={ data.hash } isUserOpDataLoading={ isLoading }/> }

      { /* ADDITIONAL INFO */ }
      <CollapsibleDetails loading={ isLoading } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }}>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <DetailedInfo.ItemLabel
          hint="Gas limit for execution phase"
        >
          Call gas limit
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { BigNumber(data.call_gas_limit).toFormat() }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint="Gas limit for verification phase"
        >
          Verification gas limit
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { BigNumber(data.verification_gas_limit).toFormat() }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint="Gas to compensate the bundler"
        >
          Pre-verification gas
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { BigNumber(data.pre_verification_gas).toFormat() }
        </DetailedInfo.ItemValue>

        { !config.slices.tx.hiddenFields?.gas_fees && (
          <>
            <DetailedInfo.ItemLabel
              hint="Maximum fee per gas "
            >
              Max fee per gas
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <GasPriceValue amount={ data.max_fee_per_gas }/>
            </DetailedInfo.ItemValue>

            <DetailedInfo.ItemLabel
              hint="Maximum priority fee per gas"
            >
              Max priority fee per gas
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue multiRow>
              <GasPriceValue amount={ data.max_priority_fee_per_gas }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemDivider/>

        { data.aggregator && (
          <>
            <DetailedInfo.ItemLabel
              hint="Helper contract to validate an aggregated signature"
            >
              Aggregator
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.aggregator }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.aggregator_signature && (
          <>
            <DetailedInfo.ItemLabel
              hint="Aggregator signature"
            >
              Aggregator signature
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { data.aggregator_signature }
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemLabel
          hint="A node (block builder) that handles User operations"
        >
          Bundler
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <AddressStringOrParam address={ data.bundler }/>
        </DetailedInfo.ItemValue>

        { data.factory && (
          <>
            <DetailedInfo.ItemLabel
              hint="Smart contract that deploys new smart contract wallets for users"
            >
              Factory
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.factory }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.paymaster && (
          <>
            <DetailedInfo.ItemLabel
              hint="Contract to sponsor the gas fees for User operations"
            >
              Paymaster
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <AddressStringOrParam address={ data.paymaster }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemLabel
          hint="Type of the gas fees sponsor"
        >
          Sponsor type
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <UserOpSponsorType sponsorType={ data.sponsor_type }/>
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemDivider/>

        <DetailedInfo.ItemLabel
          hint="Used to validate a User operation along with the nonce during verification"
        >
          Signature
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue
          wordBreak="break-all"
          whiteSpace="normal"
        >
          { data.signature }
        </DetailedInfo.ItemValue>

        <DetailedInfo.ItemLabel
          hint="Anti-replay protection; also used as the salt for first-time account creation"
        >
          Nonce
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue
          wordBreak="break-all"
          whiteSpace="normal"
        >
          { data.nonce }
        </DetailedInfo.ItemValue>

        <UserOpCallData data={ data }/>

        <UserOpDecodedCallData data={ data }/>
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default UserOpDetails;
