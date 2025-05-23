import {
  Box,
  GridItem,
  Text,
  Spinner,
  Flex,
  chakra,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';
import { SCROLL_L2_BLOCK_STATUSES } from 'types/api/scrollL2';
import type { Transaction } from 'types/api/transaction';
import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import * as arbitrum from 'lib/rollups/arbitrum';
import getConfirmationDuration from 'lib/tx/getConfirmationDuration';
import { currencyUnits } from 'lib/units';
import { Badge } from 'toolkit/chakra/badge';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { WEI, WEI_IN_GWEI } from 'toolkit/utils/consts';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import StatusTag from 'ui/shared/statusTag/StatusTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import TxDetailsActions from 'ui/tx/details/txDetailsActions/TxDetailsActions';
import TxDetailsBurntFees from 'ui/tx/details/TxDetailsBurntFees';
import TxDetailsFeePerGas from 'ui/tx/details/TxDetailsFeePerGas';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';
import TxDetailsTokenTransfers from 'ui/tx/details/TxDetailsTokenTransfers';
import TxDetailsWithdrawalStatusOptimistic from 'ui/tx/details/TxDetailsWithdrawalStatusOptimistic';
import TxRevertReason from 'ui/tx/details/TxRevertReason';
import TxAllowedPeekers from 'ui/tx/TxAllowedPeekers';
import TxExternalTxs from 'ui/tx/TxExternalTxs';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

import TxDetailsInterop from './TxDetailsInterop';
import TxDetailsTacOperation from './TxDetailsTacOperation';
import TxDetailsWithdrawalStatusArbitrum from './TxDetailsWithdrawalStatusArbitrum';
import TxInfoScrollFees from './TxInfoScrollFees';

interface Props {
  data: Transaction | undefined;
  tacOperations?: Array<tac.OperationDetails>;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
}

const externalTxFeature = config.features.externalTxs;
const rollupFeature = config.features.rollup;

const TxInfo = ({ data, tacOperations, isLoading, socketStatus }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const isMobile = useIsMobile();

  const externalTxsQuery = useApiQuery('general:tx_external_transactions', {
    pathParams: {
      hash: data?.hash,
    },
    queryOptions: {
      enabled: externalTxFeature.isEnabled,
      placeholderData: [ '1', '2', '3' ],
    },
  });

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
        <IconSvg name="status/success" boxSize={ 4 } color={{ _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' }} cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;
  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip content="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <IconSvg name="status/error" boxSize={ 4 } color="text.error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  const hasInterop = rollupFeature.isEnabled && rollupFeature.interopEnabled && data.op_interop;

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>

      { config.features.metasuites.isEnabled && (
        <>
          <Box display="none" id="meta-suites__tx-info-label" data-status={ data.status } data-ready={ !isLoading }/>
          <Box display="none" id="meta-suites__tx-info-value"/>
          <DetailedInfo.ItemDivider display="none" id="meta-suites__details-info-item-divider"/>
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      { tacOperations && tacOperations.length > 0 && <TxDetailsTacOperation tacOperations={ tacOperations } isLoading={ isLoading } txHash={ data.hash }/> }

      <TxDetailsInterop data={ data.op_interop } isLoading={ isLoading }/>

      <DetailedInfo.ItemLabel
        hint="Unique character string (TxID) assigned to every verified transaction"
        isLoading={ isLoading }
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Flex flexWrap="nowrap" alignItems="center" overflow="hidden">
          { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
          <Skeleton loading={ isLoading } overflow="hidden">
            <HashStringShortenDynamic hash={ data.hash }/>
          </Skeleton>
          <CopyToClipboard text={ data.hash } isLoading={ isLoading }/>
          { config.features.metasuites.isEnabled && (
            <>
              <TextSeparator color="gray.500" flexShrink={ 0 } display="none" id="meta-suites__tx-explorer-separator"/>
              <Box display="none" flexShrink={ 0 } id="meta-suites__tx-explorer-link"/>
            </>
          ) }
        </Flex>
        { config.features.externalTxs.isEnabled && externalTxsQuery.data && externalTxsQuery.data.length > 0 && (
          <Skeleton loading={ isLoading || externalTxsQuery.isPlaceholderData } display={{ base: 'block', lg: 'inline-flex' }} alignItems="center">
            { !isMobile && <TextSeparator color="gray.500" flexShrink={ 0 }/> }
            <TxExternalTxs data={ externalTxsQuery.data }/>
          </Skeleton>
        ) }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
        isLoading={ isLoading }
      >
        {
          rollupFeature.isEnabled &&
          (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync' || rollupFeature.type === 'arbitrum' || rollupFeature.type === 'scroll') ?
            'L2 status and method' :
            'Status and method'
        }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxStatus status={ data.status } errorText={ data.status === 'error' ? data.result : undefined } isLoading={ isLoading }/>
        { data.method && (
          <Badge colorPalette={ data.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated ml={ 3 }>
            { data.method }
          </Badge>
        ) }
        { data.arbitrum?.contains_message && (
          <Skeleton loading={ isLoading } onClick={ showAssociatedL1Tx }>
            <Link truncate ml={ 3 }>
              { data.arbitrum?.contains_message === 'incoming' ? 'Incoming message' : 'Outgoing message' }
            </Link>
          </Skeleton>
        ) }
      </DetailedInfo.ItemValue>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && data.op_withdrawals && data.op_withdrawals.length > 0 &&
      !config.UI.views.tx.hiddenFields?.L1_status && (
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
                  <Box mb={ 2 }>
                    <span>Nonce: </span>
                    <chakra.span fontWeight={ 600 }>{ withdrawal.nonce }</chakra.span>
                  </Box>
                  <TxDetailsWithdrawalStatusOptimistic
                    status={ withdrawal.status }
                    l1TxHash={ withdrawal.l1_transaction_hash }
                  />
                </Box>
              )) }
            </Flex>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zkevm_status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint="Status of the transaction confirmation path to L1"
            isLoading={ isLoading }
          >
            Confirmation status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps currentStep={ data.zkevm_status } steps={ ZKEVM_L2_TX_STATUSES } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.arbitrum?.status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint="Status of the transaction confirmation path to L1"
            isLoading={ isLoading }
          >
            L1 status
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

      { data.revert_reason && (
        <>
          <DetailedInfo.ItemLabel
            hint="The revert reason of the transaction"
          >
            Revert reason
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxRevertReason { ...data.revert_reason }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailedInfo.ItemLabel
            hint="Status is the short interpretation of the batch lifecycle"
            isLoading={ isLoading }
          >
            L1 status
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES } currentStep={ data.zksync.status } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Block number containing the transaction"
        isLoading={ isLoading }
      >
        Block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
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
            <TextSeparator color="gray.500"/>
            <Skeleton loading={ isLoading } color="text.secondary">
              <span>{ data.confirmations } Block confirmations</span>
            </Skeleton>
          </>
        ) }
        { data.scroll?.l2_block_status && (
          <>
            <TextSeparator color="gray.500"/>
            <VerificationSteps steps={ SCROLL_L2_BLOCK_STATUSES } currentStep={ data.scroll.l2_block_status } isLoading={ isLoading }/>
          </>
        ) }
      </DetailedInfo.ItemValue>

      { data.zkevm_batch_number && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailedInfo.ItemLabel
            hint="Batch index for this transaction"
            isLoading={ isLoading }
          >
            Txn batch
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <BatchEntityL2
              isLoading={ isLoading }
              number={ data.zkevm_batch_number }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.batch && (
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

      { data.arbitrum && !config.UI.views.tx.hiddenFields?.batch && (
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
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
            { data.confirmation_duration && (
              <>
                <TextSeparator color="gray.500"/>
                <Skeleton loading={ isLoading } color="text.secondary">
                  <span>{ getConfirmationDuration(data.confirmation_duration) }</span>
                </Skeleton>
              </>
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

      <TxDetailsActions hash={ data.hash } actions={ data.actions } isTxDataLoading={ isLoading }/>

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

      { data.token_transfers && <TxDetailsTokenTransfers data={ data.token_transfers } txHash={ data.hash } isOverflow={ data.token_transfers_overflow }/> }

      { hasInterop && data.op_interop?.target && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
            hint="The target address where this cross-chain transaction is executed"
          >
            Interop target
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            { data.op_interop?.relay_chain !== undefined ? (
              <AddressEntityInterop
                chain={ data.op_interop.relay_chain }
                address={{ hash: data.op_interop.target }}
                isLoading={ isLoading }
                truncation="dynamic"
              />
            ) : (
              <AddressEntity address={{ hash: data.op_interop.target }} isLoading={ isLoading } truncation="dynamic"/>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { hasInterop && data.op_interop?.target && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
            hint="The target address where this cross-chain transaction is executed"
          >
            Interop target
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            { data.op_interop?.relay_chain !== undefined ? (
              <AddressEntityInterop
                chain={ data.op_interop.relay_chain }
                address={{ hash: data.op_interop.target }}
                isLoading={ isLoading }
                truncation="dynamic"
              />
            ) : (
              <AddressEntity address={{ hash: data.op_interop.target }} isLoading={ isLoading } truncation="dynamic"/>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      { (data.arbitrum?.commitment_transaction.hash || data.arbitrum?.confirmation_transaction.hash) &&
      (
        <>
          { data.arbitrum?.commitment_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint="L1 transaction containing this batch commitment"
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
          { data.arbitrum?.confirmation_transaction.hash && (
            <>
              <DetailedInfo.ItemLabel
                hint="L1 transaction containing confirmation of this batch"
                isLoading={ isLoading }
              >
                Confirmation tx
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <TxEntityL1 hash={ data.arbitrum?.confirmation_transaction.hash } isLoading={ isLoading }/>
                { data.arbitrum?.commitment_transaction.status === 'finalized' && <StatusTag type="ok" text="Finalized" ml={ 2 }/> }
              </DetailedInfo.ItemValue>
            </>
          ) }
          <DetailedInfo.ItemDivider/>
        </>
      ) }

      { data.zkevm_sequence_hash && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
          >
            Sequence tx hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Skeleton loading={ isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_sequence_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_sequence_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>

      ) }

      { data.zkevm_verify_hash && (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isLoading }
          >
            Verify tx hash
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <Skeleton loading={ isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_verify_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_verify_hash } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { (data.zkevm_batch_number || data.zkevm_verify_hash) && <DetailedInfo.ItemDivider/> }

      { !config.UI.views.tx.hiddenFields?.value && (
        <>
          <DetailedInfo.ItemLabel
            hint="Value sent in the native token (and USD) if applicable"
            isLoading={ isLoading }
          >
            Value
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ data.value }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              isLoading={ isLoading }
              flexWrap="wrap"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <DetailedInfo.ItemLabel
            hint={ data.blob_gas_used ? 'Transaction fee without blob fee' : 'Total transaction fee' }
            isLoading={ isLoading }
          >
            Transaction fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxFee tx={ data } isLoading={ isLoading } withUsd/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && (
        <>
          <DetailedInfo.ItemLabel
            hint="Fee paid to the poster for L1 resources"
            isLoading={ isLoading }
          >
            Poster fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ data.arbitrum.poster_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>

          <DetailedInfo.ItemLabel
            hint="Fee paid to the network for L2 resources"
            isLoading={ isLoading }
          >
            Network fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ data.arbitrum.network_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
              isLoading={ isLoading }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price } gasToken={ data.celo?.gas_token } isLoading={ isLoading }/>

      <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isLoading }/>

      <DetailedInfo.ItemLabel
        hint="Actual gas amount used by the transaction"
        isLoading={ isLoading }
      >
        Gas usage & limit by txn
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>{ BigNumber(data.gas_used || 0).toFormat() }</Skeleton>
        <TextSeparator/>
        <Skeleton loading={ isLoading }>{ BigNumber(data.gas_limit).toFormat() }</Skeleton>
        <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && data.arbitrum && data.gas_used && (
        <>
          <DetailedInfo.ItemLabel
            hint="L2 gas set aside for L1 data charges"
            isLoading={ isLoading }
          >
            Gas used for L1
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
            hint="L2 gas spent on L2 resources"
            isLoading={ isLoading }
          >
            Gas used for L2
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

      { data.scroll?.l1_gas_used !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint="Total gas used on L1"
            isLoading={ isLoading }
          >
            L1 Gas used
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>{ BigNumber(data.scroll?.l1_gas_used || 0).toFormat() }</Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.gas_fees &&
            (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
        <>
          <DetailedInfo.ItemLabel
            hint={ `
            Base Fee refers to the network Base Fee at the time of the block, 
            while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay 
            for their tx & to give to the ${ getNetworkValidatorTitle() } respectively
          ` }
            isLoading={ isLoading }
          >
            { `Gas fees (${ currencyUnits.gwei })` }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.base_fee_per_gas && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_fee_per_gas && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">Max: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { data.max_priority_fee_per_gas && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_priority_fee_per_gas && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">Max priority: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && (
        <>
          { data.l1_gas_used && (
            <>
              <DetailedInfo.ItemLabel
                hint="L1 gas used by transaction"
                isLoading={ isLoading }
              >
                L1 gas used by txn
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }

          { data.l1_gas_price && (
            <>
              <DetailedInfo.ItemLabel
                hint="L1 gas price"
                isLoading={ isLoading }
              >
                L1 gas price
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <Text mr={ 1 }>{ BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
                <Text color="text.secondary">({ BigNumber(data.l1_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
              </DetailedInfo.ItemValue>
            </>
          ) }

          { data.l1_fee && (
            <>
              <DetailedInfo.ItemLabel
                // eslint-disable-next-line max-len
                hint={ `L1 Data Fee which is used to cover the L1 "security" cost from the batch submission mechanism. In combination with L2 execution fee, L1 fee makes the total amount of fees that a transaction pays.` }
                isLoading={ isLoading }
              >
                L1 fee
              </DetailedInfo.ItemLabel>
              <DetailedInfo.ItemValue>
                <CurrencyValue
                  value={ data.l1_fee }
                  currency={ currencyUnits.ether }
                  exchangeRate={ data.exchange_rate }
                  flexWrap="wrap"
                />
              </DetailedInfo.ItemValue>
            </>
          ) }

          { data.l1_fee_scalar && (
            <>
              <DetailedInfo.ItemLabel
                hint="A Dynamic overhead (fee scalar) premium, which serves as a buffer in case L1 prices rapidly increase."
                isLoading={ isLoading }
              >
                L1 fee scalar
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
                <DetailedInfo.ItemValue>
                  <CurrencyValue
                    value={ BigNumber(data.blob_gas_used).multipliedBy(data.blob_gas_price).toString() }
                    currency={ config.UI.views.tx.hiddenFields?.fee_currency ? '' : currencyUnits.ether }
                    exchangeRate={ data.exchange_rate }
                    flexWrap="wrap"
                    isLoading={ isLoading }
                  />
                </DetailedInfo.ItemValue>
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
                    <Text fontWeight="600" as="span">{ BigNumber(data.blob_gas_price).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                  ) }
                  { (data.max_fee_per_blob_gas && data.blob_gas_price) && <TextSeparator/> }
                  { data.max_fee_per_blob_gas && (
                    <>
                      <Text as="span" fontWeight="500" whiteSpace="pre">Max: </Text>
                      <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_blob_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                    </>
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
            <DetailedInfo.ItemValue>
              <LogDecodedInputData data={ data.decoded_input }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.zksync && <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/> }
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default TxInfo;
