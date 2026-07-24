// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Box,
  GridItem,
  Text,
  Flex,
  chakra,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { SCROLL_L2_BLOCK_STATUSES } from 'src/features/rollup/scroll/types/api';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'src/features/rollup/zk-sync/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import { currencyUnits } from 'src/slices/chain/units';
import getChainValidatorTitle from 'src/slices/chain/verification-type/utils/get-chain-validator-title';
import LogDecodedInputData from 'src/slices/log/components/LogDecodedInputData';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import getConfirmationDuration from 'src/slices/tx/utils/get-confirmation-duration';

import TxAllowedPeekers from 'src/features/chain-variants/suave/pages/tx/TxAllowedPeekers';
import TxDetailsTacOperation from 'src/features/chain-variants/tac/pages/tx/TxDetailsTacOperation';
import TxDetailsCrossChainMessages from 'src/features/cross-chain-txs/pages/tx/TxDetailsCrossChainMessages';
import TxDetailsCrossChainTransfers from 'src/features/cross-chain-txs/pages/tx/TxDetailsCrossChainTransfers';
import AddressEntityInterop from 'src/features/op-interop/components/AddressEntityInterop';
import TxDetailsInterop from 'src/features/op-interop/pages/tx/TxDetailsInterop';
import TxDetailsWithdrawalStatusArbitrum from 'src/features/rollup/arbitrum/pages/tx/TxDetailsWithdrawalStatusArbitrum';
import * as arbitrum from 'src/features/rollup/arbitrum/utils/batch-verification';
import BatchEntityL2 from 'src/features/rollup/common/components/BatchEntityL2';
import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'src/features/rollup/common/utils/layer';
import TxDetailsWithdrawalStatusOptimistic from 'src/features/rollup/optimism/pages/tx/TxDetailsWithdrawalStatusOptimistic';
import TxInfoScrollFees from 'src/features/rollup/scroll/pages/tx/TxInfoScrollFees';
import ZkSyncL2TxnBatchHashesInfo from 'src/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatchHashesInfo';
import { formatZkSyncL2TxnBatchStatus } from 'src/features/rollup/zk-sync/utils/format-txn-batch-status';
import TxDetailsActions from 'src/features/tx-actions/pages/tx/TxDetailsActions';

import config from 'src/config';
import RawInputData from 'src/shared/data/RawInputData';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';
import DetailedInfoSponsoredItem from 'src/shared/detailed-info/DetailedInfoSponsoredItem';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';
import TextSeparator from 'src/shared/texts/TextSeparator';
import GasPriceValue from 'src/shared/values/entity/GasPriceValue';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import Utilization from 'src/shared/values/utilization/Utilization';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Badge } from 'src/toolkit/chakra/badge';
import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import TxDetailsBurntFees from './parts/TxDetailsBurntFees';
import TxDetailsFeePerGas from './parts/TxDetailsFeePerGas';
import TxDetailsGasPrice from './parts/TxDetailsGasPrice';
import TxDetailsGasUsage from './parts/TxDetailsGasUsage';
import TxDetailsOther from './parts/TxDetailsOther';
import TxDetailsSetMaxGasLimit from './parts/TxDetailsSetMaxGasLimit';
import TxDetailsStatus from './parts/TxDetailsStatus';
import TxDetailsTokenTransfers from './parts/TxDetailsTokenTransfers';
import TxDetailsTxFee from './parts/TxDetailsTxFee';
import TxHash from './parts/TxHash';

interface Props {
  data: schemas['TransactionResponse'] | undefined;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
  noTxActions?: boolean;
}

const rollupFeature = config.features.rollup;

// REFACTOR: Put feature related parts under the feature folder
const TxDetails = ({ data, isLoading, socketStatus, noTxActions }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutLinkClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  const showAssociatedL1Tx = React.useCallback(() => {
    setIsExpanded(true);
  }, []);

  if (!data) {
    return null;
  }

  const addressFromTags = [
    ...data.from.private_tags || [],
    ...data.from.public_tags || [],
    ...data.from.watchlist_names || [],
  ].map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>);

  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...toAddress?.private_tags || [],
    ...toAddress?.public_tags || [],
    ...toAddress?.watchlist_names || [],
  ].map((tag) => <Badge key={ tag.label }>{ tag.display_name }</Badge>);

  const executionSuccessBadge = toAddress?.is_contract && data.result === 'success' ? (
    <Tooltip content="Contract execution completed">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <SpriteIcon name="status/success" boxSize={ 4 } color={{ _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' }} cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip content="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <SpriteIcon name="status/error" boxSize={ 4 } color="text.error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled && data.op_interop_messages && data.op_interop_messages.length > 0;

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(215px, auto) minmax(0, 1fr)' }}>

      { config.features.metasuites.isEnabled && (
        <>
          <Box display="none" as="p" id="meta-suites__tx-info-label" data-status={ data.status } data-ready={ !isLoading }/>
          <Box display="none" as="p" id="meta-suites__tx-info-value"/>
          <DetailedInfo.ItemDivider display="none" as="p" id="meta-suites__details-info-item-divider"/>
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      { config.features.tac.isEnabled && <TxDetailsTacOperation isLoading={ isLoading } txHash={ data.hash }/> }

      { data.op_interop_messages ? data.op_interop_messages.map((message) => (
        <TxDetailsInterop key={ message.nonce } data={ message } isLoading={ isLoading }/>
      )) : null }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainMessages hash={ data.hash } isLoading={ isLoading }/> }

      <TxHash hash={ data.hash } isLoading={ isLoading } status={ data.status }/>

      <TxDetailsStatus data={ data } isLoading={ isLoading } onShowDetailsClick={ showAssociatedL1Tx }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.op_withdrawals && data.op_withdrawals.length > 0 &&
      !config.slices.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint="Detailed status progress of the transaction"
          >
            Withdrawal status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Flex flexDir="column" rowGap={ 2 }>
              { data.op_withdrawals.map((withdrawal) => (
                <Box key={ withdrawal.nonce }>
                  <Box mb={ 2 } py={{ base: '5px', lg: 1 }}>
                    <span>Nonce: </span>
                    <chakra.span fontWeight={ 600 }>{ withdrawal.nonce }</chakra.span>
                  </Box>
                  <TxDetailsWithdrawalStatusOptimistic data={ withdrawal } txHash={ data.hash } from={ data.from }/>
                </Box>
              )) }
            </Flex>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.arbitrum?.status && !config.slices.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `Status of the transaction confirmation path to ${ layerLabels.parent }` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps
              currentStep={ arbitrum.VERIFICATION_STEPS_MAP[data.arbitrum.status] }
              currentStepPending={ arbitrum.getVerificationStepStatus(data.arbitrum) === 'pending' }
              steps={ arbitrum.verificationSteps }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.slices.tx.hiddenFields?.L1_status && data.zksync?.status && (
        <>
          <DetailedInfo.ItemLabel
            hint="Status is the short interpretation of the batch lifecycle"
            isLoading={ isLoading }
          >
            { layerLabels.parent } status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps
              steps={ ZKSYNC_L2_TX_BATCH_STATUSES.map(formatZkSyncL2TxnBatchStatus) }
              currentStep={ formatZkSyncL2TxnBatchStatus(data.zksync.status) }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Block number containing the transaction"
        isLoading={ isLoading }
      >
        Block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ Boolean(data.scroll?.l2_block_status) }>
        { data.block_number === null ?
          <Text>Pending</Text> : (
            <BlockEntity
              isLoading={ isLoading }
              number={ data.block_number }
              noIcon
            />
          ) }
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator/>
            <Skeleton loading={ isLoading } color="text.secondary">
              <span>{ data.confirmations } Block confirmations</span>
            </Skeleton>
          </>
        ) }
        { data.scroll?.l2_block_status && (
          <>
            <TextSeparator/>
            <VerificationSteps steps={ SCROLL_L2_BLOCK_STATUSES } currentStep={ data.scroll.l2_block_status } isLoading={ isLoading }/>
          </>
        ) }
      </DetailedInfo.ItemValue>

      { data.zksync && !config.slices.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint="Batch number"
            isLoading={ isLoading }
          >
            Batch
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isLoading }
                number={ data.zksync.batch_number }
              />
            ) : <Skeleton loading={ isLoading }>Pending</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.arbitrum && !config.slices.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint="Index of the batch containing this transaction"
            isLoading={ isLoading }
          >
            Batch
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.arbitrum.batch_number ?
              <BatchEntityL2 isLoading={ isLoading } number={ data.arbitrum.batch_number }/> :
              <Skeleton loading={ isLoading }>Pending</Skeleton> }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint="Date & time of transaction inclusion, including length of time for confirmation"
            isLoading={ isLoading }
          >
            Timestamp
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
            { data.confirmation_duration && (
              <Flex alignItems="center">
                <TextSeparator hideBelow="lg"/>
                <Skeleton loading={ isLoading } color="text.secondary">
                  <span>{ getConfirmationDuration(data.confirmation_duration) }</span>
                </Skeleton>
              </Flex>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.execution_node && (
        <>
          <DetailedInfo.ItemLabel
            hint="Node that carried out the confidential computation"
            isLoading={ isLoading }
          >
            Kettle
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity
              address={ data.execution_node }
              href={ route({ pathname: '/txs/kettle/[hash]', query: { hash: data.execution_node.hash } }) }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.allowed_peekers && data.allowed_peekers.length > 0 && (
        <TxAllowedPeekers items={ data.allowed_peekers }/>
      ) }

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

      <DetailedInfo.ItemDivider/>

      { !noTxActions && <TxDetailsActions hash={ data.hash } isTxDataLoading={ isLoading }/> }

      <DetailedInfo.ItemLabel
        hint="Address (external or contract) sending the transaction"
        isLoading={ isLoading }
      >
        From
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue columnGap={ 3 }>
        <AddressEntity
          address={ data.from }
          isLoading={ isLoading }
        />
        { data.from.name && <Text>{ data.from.name }</Text> }
        { addressFromTags.length > 0 && (
          <Flex columnGap={ 3 }>
            { addressFromTags }
          </Flex>
        ) }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Address (external or contract) receiving the transaction"
        isLoading={ isLoading }
      >
        { data.to?.is_contract ? 'Interacted with contract' : 'To' }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        columnGap={ 3 }
      >
        { toAddress ? (
          <>
            { data.to && data.to.hash ? (
              <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
                <AddressEntity
                  address={ toAddress }
                  isLoading={ isLoading }
                />
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) : (
              <Flex width="100%" whiteSpace="pre" alignItems="center" flexShrink={ 0 }>
                <span>[Contract </span>
                <AddressEntity
                  address={ toAddress }
                  isLoading={ isLoading }
                  noIcon
                />
                <span>created]</span>
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) }
            { addressToTags.length > 0 && (
              <Flex columnGap={ 3 }>
                { addressToTags }
              </Flex>
            ) }
          </>
        ) : (
          <span>[ Contract creation ]</span>
        ) }
      </DetailedInfo.ItemValue>

      { data.token_transfers && (
        <TxDetailsTokenTransfers
          data={ data.token_transfers }
          txHash={ data.hash }
          isOverflow={ Boolean(data.token_transfers_overflow) }/>
      ) }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainTransfers hash={ data.hash } isLoading={ isLoading }/> }

      { hasInterop && data.op_interop_messages?.some(message => message.target_address_hash) && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
            hint="The target address where this cross-chain transaction is executed"
          >
            Interop target
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VStack gap={ 2 } w="100%" overflow="hidden" alignItems="flex-start">
              { data.op_interop_messages
                .map((message) => {
                  if (!message.target_address_hash) {
                    return null;
                  }
                  return message.relay_chain !== undefined ? (
                    <AddressEntityInterop
                      chain={ message.relay_chain }
                      address={{ hash: message.target_address_hash }}
                      isLoading={ isLoading }
                      truncation="dynamic"
                      w="100%"
                    />
                  ) : (
                    <AddressEntity address={{ hash: message.target_address_hash }} isLoading={ isLoading } truncation="dynamic" w="100%"/>
                  );
                }) }
            </VStack>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      { (data.arbitrum?.commitment_transaction?.hash || data.arbitrum?.confirmation_transaction?.hash) &&
      (
        <>
          { data.arbitrum?.commitment_transaction?.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ `${ layerLabels.parent } transaction containing this batch commitment` }
                isLoading={ isLoading }
              >
                Commitment tx
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.commitment_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          { data.arbitrum?.confirmation_transaction?.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint={ `${ layerLabels.parent } transaction containing confirmation of this batch` }
                isLoading={ isLoading }
              >
                Confirmation tx
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction?.status === 'finalized' && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          <DetailedInfo.ItemDivider/>
        </>
      ) }

      { !config.slices.tx.hiddenFields?.value && (
        <>
          <DetailedInfo.ItemLabel
            hint="Value sent in the native token (and USD) if applicable"
            isLoading={ isLoading }
          >
            Value
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.value }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      <TxDetailsTxFee isLoading={ isLoading } data={ data }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.operator_fee && (
        <>
          <DetailedInfo.ItemLabel
            hint="A fee set by the chain operator to cover extra costs of additional services"
          >
            Operator fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.operator_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `Fee paid to the poster for ${ layerLabels.parent } resources` }
            isLoading={ isLoading }
          >
            Poster fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.arbitrum.poster_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />

          <DetailedInfo.ItemLabel
            hint={ `Fee paid to the network for ${ layerLabels.current } resources` }
            isLoading={ isLoading }
          >
            Network fee
          </DetailedInfo.ItemLabel>
          <DetailedInfoNativeCoinValue
            amount={ data.arbitrum.network_fee }
            exchangeRate={ data.exchange_rate }
            historicalExchangeRate={ data.historic_exchange_rate }
            hasExchangeRateToggle
            loading={ isLoading }
          />
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price } gasToken={ data.celo?.gas_token } isLoading={ isLoading }/>

      <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isLoading }/>

      { !config.slices.tx.additionalFields?.set_max_gas_limit && <TxDetailsGasUsage isLoading={ isLoading } data={ data }/> }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && data.gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.current } gas set aside for ${ layerLabels.parent } data charges` }
            isLoading={ isLoading }
          >
            Gas used for { layerLabels.parent }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ BigNumber(data.arbitrum.gas_used_for_l1 || 0).toFormat() }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l1 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel
            hint={ `${ layerLabels.current } gas spent on ${ layerLabels.current } resources` }
            isLoading={ isLoading }
          >
            Gas used for { layerLabels.current }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ BigNumber(data.arbitrum.gas_used_for_l2 || 0).toFormat() }</Skeleton>
            <TextSeparator/>
            <Utilization
              ml={ 4 }
              value={ BigNumber(data.arbitrum.gas_used_for_l2 || 0).dividedBy(BigNumber(data.gas_used)).toNumber() }
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.scroll?.l1_gas_used !== undefined && !config.slices.tx.hiddenFields?.L1_gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `Total gas used on ${ layerLabels.parent }` }
            isLoading={ isLoading }
          >
            { layerLabels.parent } Gas used
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ BigNumber(data.scroll?.l1_gas_used || 0).toFormat() }</Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.slices.tx.hiddenFields?.gas_fees &&
            (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `
            Base Fee refers to the network Base Fee at the time of the block, 
            while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay 
            for their tx & to give to the ${ getChainValidatorTitle() } respectively
          ` }
            isLoading={ isLoading }
          >
            { `Gas fees (${ currencyUnits.gwei })` }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            { data.base_fee_per_gas && (
              <NativeCoinValue
                amount={ data.base_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement="Base: "
                endElement={ (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
              />
            ) }
            { data.max_fee_per_gas && (
              <NativeCoinValue
                amount={ data.max_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement="Max: "
                endElement={ data.max_priority_fee_per_gas && <TextSeparator/> }
              />
            ) }
            { data.max_priority_fee_per_gas && (
              <NativeCoinValue
                amount={ data.max_priority_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                loading={ isLoading }
                startElement="Max priority: "
              />
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && (
        <>
          { data.l1_gas_used && !config.slices.tx.hiddenFields?.L1_gas_used && (
            <>
              <DetailedInfo.ItemLabel
                hint={ `${ layerLabels.parent } gas used by transaction` }
                isLoading={ isLoading }
              >
                { layerLabels.parent } gas used by txn
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }

          { data.l1_gas_price && !config.slices.tx.hiddenFields?.L1_gas_price && (
            <>
              <DetailedInfo.ItemLabel
                hint={ `${ layerLabels.parent } gas price` }
                isLoading={ isLoading }
              >
                { layerLabels.parent } gas price
              </DetailedInfo.ItemLabel>
              <GasPriceValue
                amount={ data.l1_gas_price }
                asset={ rollupFeature.parentChain.currency?.symbol || currencyUnits.ether }
                loading={ isLoading }
              />
            </>
          ) }

          { data.l1_fee && !config.slices.tx.hiddenFields?.L1_fee && (
            <>
              <DetailedInfo.ItemLabel
                // eslint-disable-next-line max-len
                hint={ `${ layerLabels.parent } Data Fee which is used to cover the ${ layerLabels.parent } "security" cost from the batch submission mechanism. In combination with ${ layerLabels.current } execution fee, ${ layerLabels.parent } fee makes the total amount of fees that a transaction pays.` }
                isLoading={ isLoading }
              >
                { layerLabels.parent } fee
              </DetailedInfo.ItemLabel>
              <DetailedInfoNativeCoinValue
                amount={ data.l1_fee }
                asset={ rollupFeature.parentChain.currency?.symbol || currencyUnits.ether }
                decimals={ rollupFeature.parentChain.currency?.decimals ?? config.chain.currency.decimals }
                exchangeRate={ data.exchange_rate }
                historicalExchangeRate={ data.historic_exchange_rate }
                hasExchangeRateToggle
                loading={ isLoading }
              />
            </>
          ) }

          { data.l1_fee_scalar && !config.slices.tx.hiddenFields?.L1_fee_scalar && (
            <>
              <DetailedInfo.ItemLabel
                hint={ `A Dynamic overhead (fee scalar) premium, which serves as a buffer in case ${ layerLabels.parent } prices rapidly increase.` }
                isLoading={ isLoading }
              >
                { layerLabels.parent } fee scalar
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text>{ data.l1_fee_scalar }</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }
        </>
      ) }
      <TxInfoScrollFees data={ data } isLoading={ isLoading }/>

      <CollapsibleDetails loading={ isLoading } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }} isExpanded={ isExpanded } onClick={ handleCutLinkClick }>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <TxDetailsSetMaxGasLimit data={ data }/>

        <TxDetailsWithdrawalStatusArbitrum data={ data }/>

        { (data.blob_gas_used || data.max_fee_per_blob_gas || data.blob_gas_price) && (
          <>
            { data.blob_gas_used && data.blob_gas_price && (
              <>
                <DetailedInfo.ItemLabel
                  hint="Blob fee for this transaction"
                >
                  Blob fee
                </DetailedInfo.ItemLabel>
                <DetailedInfoNativeCoinValue
                  amount={ BigNumber(data.blob_gas_used).multipliedBy(data.blob_gas_price).toString() }
                  noSymbol={ config.slices.tx.hiddenFields?.fee_currency }
                  exchangeRate={ data.exchange_rate }
                  historicalExchangeRate={ data.historic_exchange_rate }
                  hasExchangeRateToggle
                  loading={ isLoading }
                />
              </>
            ) }

            { data.blob_gas_used && (
              <>
                <DetailedInfo.ItemLabel
                  hint="Amount of gas used by the blobs in this transaction"
                >
                  Blob gas usage
                </DetailedInfo.ItemLabel>
                <DetailedInfo.ItemValue>
                  { BigNumber(data.blob_gas_used).toFormat() }
                </DetailedInfo.ItemValue>
              </>
            ) }

            { (data.max_fee_per_blob_gas || data.blob_gas_price) && (
              <>
                <DetailedInfo.ItemLabel
                  hint={ `Amount of ${ currencyUnits.ether } used for blobs in this transaction` }
                >
                  { `Blob gas fees (${ currencyUnits.gwei })` }
                </DetailedInfo.ItemLabel>
                <DetailedInfo.ItemValue>
                  { data.blob_gas_price && (
                    <NativeCoinValue
                      amount={ data.blob_gas_price }
                      units="gwei"
                      unitsTooltip="wei"
                      noSymbol
                      loading={ isLoading }
                      fontWeight="600"
                    />
                  ) }
                  { (data.max_fee_per_blob_gas && data.blob_gas_price) && <TextSeparator/> }
                  { data.max_fee_per_blob_gas && (
                    <NativeCoinValue
                      amount={ data.max_fee_per_blob_gas }
                      units="gwei"
                      unitsTooltip="wei"
                      noSymbol
                      loading={ isLoading }
                      startElement="Max: "
                      fontWeight="600"
                    />
                  ) }
                </DetailedInfo.ItemValue>
              </>
            ) }
            <DetailedInfo.ItemDivider/>
          </>
        ) }

        <TxDetailsOther nonce={ data.nonce } type={ data.type } position={ data.position } queueIndex={ data.scroll?.queue_index }/>

        <DetailedInfo.ItemLabel
          hint="Binary data included with the transaction. See logs tab for additional info"
          mb={{ base: 1, lg: 0 }}
        >
          Raw input
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <RawInputData hex={ data.raw_input } defaultDataType={ data.zilliqa?.is_scilla ? 'UTF-8' : 'Hex' }/>
        </DetailedInfo.ItemValue>

        { data.decoded_input && (
          <>
            <DetailedInfo.ItemLabel
              hint="Decoded input data"
            >
              Decoded input data
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="wrap" mt={{ base: '5px', lg: '4px' }}>
              <LogDecodedInputData data={ data.decoded_input }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.zksync && <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/> }
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default TxDetails;
