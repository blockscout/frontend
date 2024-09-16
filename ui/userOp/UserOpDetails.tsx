import { Grid, GridItem, Text, Link, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { UserOp } from 'types/api/userOps';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CurrencyValue from 'ui/shared/CurrencyValue';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import UserOpSponsorType from 'ui/shared/userOps/UserOpSponsorType';
import UserOpStatus from 'ui/shared/userOps/UserOpStatus';
import Utilization from 'ui/shared/Utilization/Utilization';

import UserOpCallData from './UserOpCallData';
import UserOpDecodedCallData from './UserOpDecodedCallData';
import UserOpDetailsActions from './UserOpDetailsActions';

interface Props {
  query: UseQueryResult<UserOp, ResourceError>;
}

const CUT_LINK_NAME = 'UserOpDetails__cutLink';

const UserOpDetails = ({ query }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const { data, isPlaceholderData, isError, error } = query;

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo(CUT_LINK_NAME, {
      duration: 500,
      smooth: true,
    });
  }, []);

  if (isError) {
    if (error?.status === 400 || isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 220px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint="Unique character string assigned to every User operation"
        isLoading={ isPlaceholderData }
      >
        User operation hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <UserOpEntity hash={ data.hash } noIcon noLink noCopy={ false }/>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The address of the smart contract account"
        isLoading={ isPlaceholderData }
      >
        Sender
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressStringOrParam address={ data.sender } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Current User operation state"
        isLoading={ isPlaceholderData }
      >
        Status
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <UserOpStatus status={ data.status } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      { data.revert_reason && (
        <>
          <DetailsInfoItem.Label
            hint="The revert reason of the User operation"
            isLoading={ isPlaceholderData }
          >
            Revert reason
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value
            wordBreak="break-all"
            whiteSpace="normal"
          >
            <Skeleton isLoaded={ !isPlaceholderData }>
              { data.revert_reason }
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailsInfoItem.Label
            hint="Date and time of User operation"
            isLoading={ isPlaceholderData }
          >
            Timestamp
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem.Value>
        </>

      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <DetailsInfoItem.Label
            hint="Total User operation fee"
            isLoading={ isPlaceholderData }
          >
            Fee
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.fee }
              currency={ currencyUnits.ether }
              isLoading={ isPlaceholderData }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label
        hint="Gas limit for the User operation"
        isLoading={ isPlaceholderData }
      >
        Gas limit
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas).toFormat() }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Actual gas amount used by the User operation"
        isLoading={ isPlaceholderData }
      >
        Gas used
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_used).toFormat() }
        </Skeleton>
        <Utilization
          ml={ 4 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used).dividedBy(BigNumber(data.gas)).toNumber() }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Hash of the transaction this User operation belongs to"
        isLoading={ isPlaceholderData }
      >
        Transaction hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TxEntity hash={ data.transaction_hash } isLoading={ isPlaceholderData } noCopy={ false }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Block number containing this User operation"
        isLoading={ isPlaceholderData }
      >
        Block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <BlockEntity number={ Number(data.block_number) } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Contract that executes bundles of User operations"
        isLoading={ isPlaceholderData }
      >
        Entry point
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressStringOrParam address={ data.entry_point } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      { config.features.txInterpretation.isEnabled && <UserOpDetailsActions hash={ data.hash } isUserOpDataLoading={ isPlaceholderData }/> }

      { /* CUT */ }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name={ CUT_LINK_NAME }>
          <Skeleton isLoaded={ !isPlaceholderData } mt={ 6 } display="inline-block">
            <Link
              fontSize="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              onClick={ handleCutClick }
            >
              { isExpanded ? 'Hide details' : 'View details' }
            </Link>
          </Skeleton>
        </Element>
      </GridItem>

      { /* ADDITIONAL INFO */ }
      { isExpanded && !isPlaceholderData && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

          <DetailsInfoItem.Label
            hint="Gas limit for execution phase"
          >
            Call gas limit
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { BigNumber(data.call_gas_limit).toFormat() }
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint="Gas limit for verification phase"
          >
            Verification gas limit
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { BigNumber(data.verification_gas_limit).toFormat() }
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint="Gas to compensate the bundler"
          >
            Pre-verification gas
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { BigNumber(data.pre_verification_gas).toFormat() }
          </DetailsInfoItem.Value>

          { !config.UI.views.tx.hiddenFields?.gas_fees && (
            <>
              <DetailsInfoItem.Label
                hint="Maximum fee per gas "
              >
                Max fee per gas
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ BigNumber(data.max_fee_per_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
                <Text variant="secondary" whiteSpace="pre">
                  { space }({ BigNumber(data.max_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
                </Text>
              </DetailsInfoItem.Value>

              <DetailsInfoItem.Label
                hint="Maximum priority fee per gas"
              >
                Max priority fee per gas
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
                <Text variant="secondary" whiteSpace="pre">
                  { space }({ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
                </Text>
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItemDivider/>

          { data.aggregator && (
            <>
              <DetailsInfoItem.Label
                hint="Helper contract to validate an aggregated signature"
              >
                Aggregator
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <AddressStringOrParam address={ data.aggregator }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.aggregator_signature && (
            <>
              <DetailsInfoItem.Label
                hint="Aggregator signature"
              >
                Aggregator signature
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                { data.aggregator_signature }
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItem.Label
            hint="A node (block builder) that handles User operations"
          >
            Bundler
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <AddressStringOrParam address={ data.bundler }/>
          </DetailsInfoItem.Value>

          { data.factory && (
            <>
              <DetailsInfoItem.Label
                hint="Smart contract that deploys new smart contract wallets for users"
              >
                Factory
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <AddressStringOrParam address={ data.factory }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.paymaster && (
            <>
              <DetailsInfoItem.Label
                hint="Contract to sponsor the gas fees for User operations"
              >
                Paymaster
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <AddressStringOrParam address={ data.paymaster }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItem.Label
            hint="Type of the gas fees sponsor"
          >
            Sponsor type
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <UserOpSponsorType sponsorType={ data.sponsor_type }/>
          </DetailsInfoItem.Value>

          <DetailsInfoItemDivider/>

          <DetailsInfoItem.Label
            hint="Used to validate a User operation along with the nonce during verification"
          >
            Signature
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value
            wordBreak="break-all"
            whiteSpace="normal"
          >
            { data.signature }
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint="Anti-replay protection; also used as the salt for first-time account creation"
          >
            Nonce
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value
            wordBreak="break-all"
            whiteSpace="normal"
          >
            { data.nonce }
          </DetailsInfoItem.Value>

          <UserOpCallData data={ data }/>

          <UserOpDecodedCallData data={ data }/>
        </>
      ) }
    </Grid>
  );
};

export default UserOpDetails;
