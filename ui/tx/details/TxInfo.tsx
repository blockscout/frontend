import {
  Box,
  Grid,
  GridItem,
  Text,
  Link,
  Spinner,
  Flex,
  Tooltip,
  chakra,
  useColorModeValue,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react';
import { useWindowSize } from '@uidotdev/usehooks';
import BigNumber from 'bignumber.js';
import React from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { scroller, Element } from 'react-scroll';

import type { Transaction } from 'types/api/transaction';
import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';
import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import { useArweaveId } from 'lib/hooks/useArweaveId';
import { useBlobScan } from 'lib/hooks/useBlobScan';
import { useWvmArchiver } from 'lib/hooks/useWvmArchiver';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getConfirmationDuration from 'lib/tx/getConfirmationDuration';
import { currencyUnits } from 'lib/units';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
// import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import BlobScanTag from 'ui/shared/statusTag/BlobScanTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import WvmArchiverTag from 'ui/shared/statusTag/WvmArchiverTag';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import TxDetailsActions from 'ui/tx/details/txDetailsActions/TxDetailsActions';
import TxDetailsBurntFees from 'ui/tx/details/TxDetailsBurntFees';
import TxDetailsFeePerGas from 'ui/tx/details/TxDetailsFeePerGas';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';
import TxDetailsTokenTransfers from 'ui/tx/details/TxDetailsTokenTransfers';
import TxDetailsWithdrawalStatus from 'ui/tx/details/TxDetailsWithdrawalStatus';
import TxRevertReason from 'ui/tx/details/TxRevertReason';
// import TxAllowedPeekers from 'ui/tx/TxAllowedPeekers';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

const rollupFeature = config.features.rollup;

interface Props {
  data: Transaction | undefined;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
}

const TxInfo = ({ data, isLoading, socketStatus }: Props) => {
  const size = useWindowSize();
  const { colorMode } = useColorMode();
  const isBlobScan = useBlobScan({ address: data?.from.hash });
  const isWvmArchiver = useWvmArchiver({ address: data?.from.hash });
  const isSmallDevice = size.width && size.width < 768;
  const wvmIconPath =
    colorMode === 'light' ? 'networks/arweave-dark' : 'networks/arweave-light';
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const { data: arweaveId } = useArweaveId({
    block: data?.block,
  });

  const truncateArweaveId = (address: string) => {
    const start = address.slice(0, 28);
    const end = address.slice(-4);
    return `${ start }...${ end }`;
  };

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('TxInfo__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);
  const executionSuccessIconColor = useColorModeValue(
    'blackAlpha.800',
    'whiteAlpha.800',
  );

  if (!data) {
    return null;
  }

  const addressFromTags = [
    ...(data.from.private_tags || []),
    ...(data.from.public_tags || []),
    ...(data.from.watchlist_names || []),
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...(toAddress?.private_tags || []),
    ...(toAddress?.public_tags || []),
    ...(toAddress?.watchlist_names || []),
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const executionSuccessBadge =
    toAddress?.is_contract && data.result === 'success' ? (
      <Tooltip label="Contract execution completed">
        <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
          <IconSvg
            name="status/success"
            boxSize={ 4 }
            color={ executionSuccessIconColor }
            cursor="pointer"
          />
        </chakra.span>
      </Tooltip>
    ) : null;
  const executionFailedBadge =
    toAddress?.is_contract &&
    Boolean(data.status) &&
    data.result !== 'success' ? (
        <Tooltip label="Error occurred during contract execution">
          <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
            <IconSvg
              name="status/error"
              boxSize={ 4 }
              color="error"
              cursor="pointer"
            />
          </chakra.span>
        </Tooltip>
      ) : null;

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{
        base: 'minmax(0, 1fr)',
        lg: 'max-content minmax(728px, auto)',
      }}
    >
      { config.features.metasuites.isEnabled && (
        <>
          <Box
            display="none"
            id="meta-suites__tx-info-label"
            data-status={ data.status }
            data-ready={ !isLoading }
          />
          <Box display="none" id="meta-suites__tx-info-value"/>
          <DetailsInfoItemDivider
            display="none"
            id="meta-suites__details-info-item-divider"
          />
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      <DetailsInfoItem.Label
        hint="Unique character string (TxID) assigned to every verified transaction"
        isLoading={ isLoading }
      >
        Transaction hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
        <Skeleton isLoaded={ !isLoading } overflow="hidden">
          <HashStringShortenDynamic hash={ data.hash }/>
        </Skeleton>
        <CopyToClipboard text={ data.hash } isLoading={ isLoading }/>

        { config.features.metasuites.isEnabled && (
          <>
            <TextSeparator
              color="gray.500"
              flexShrink={ 0 }
              display="none"
              id="meta-suites__tx-explorer-separator"
            />
            <Box
              display="none"
              flexShrink={ 0 }
              id="meta-suites__tx-explorer-link"
            />
          </>
        ) }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
        isLoading={ isLoading }
      >
        { rollupFeature.isEnabled &&
        (rollupFeature.type === 'zkEvm' || rollupFeature.type === 'zkSync') ?
          'L2 status and method' :
          'Status and method' }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TxStatus
          status={ data.status }
          errorText={ data.status === 'error' ? data.result : undefined }
          isLoading={ isLoading }
        />
        { data.method && (
          <Tag
            colorScheme={ data.method === 'Multicall' ? 'teal' : 'gray' }
            isLoading={ isLoading }
            isTruncated
            ml={ 3 }
          >
            { data.method }
          </Tag>
        ) }
      </DetailsInfoItem.Value>

      { rollupFeature.isEnabled &&
        rollupFeature.type === 'optimistic' &&
        data.op_withdrawals &&
        data.op_withdrawals.length > 0 &&
        !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label hint="Detailed status progress of the transaction">
              Withdrawal status
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexDir="column" rowGap={ 2 }>
              { data.op_withdrawals.map((withdrawal) => (
                <Box key={ withdrawal.nonce }>
                  <Box mb={ 2 }>
                    <span>Nonce: </span>
                    <chakra.span fontWeight={ 600 }>
                      { withdrawal.nonce }
                    </chakra.span>
                  </Box>
                  <TxDetailsWithdrawalStatus
                    status={ withdrawal.status }
                    l1TxHash={ withdrawal.l1_transaction_hash }
                  />
                </Box>
              )) }
            </Flex>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zkevm_status && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint="Status of the transaction confirmation path to L1"
            isLoading={ isLoading }
          >
            Confirmation status
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps
              currentStep={ data.zkevm_status }
              steps={ ZKEVM_L2_TX_STATUSES }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.revert_reason && (
        <>
          <DetailsInfoItem.Label hint="The revert reason of the transaction">
            Revert reason
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TxRevertReason { ...data.revert_reason }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint="Status is the short interpretation of the batch lifecycle"
            isLoading={ isLoading }
          >
            L1 status
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps
              steps={ ZKSYNC_L2_TX_BATCH_STATUSES }
              currentStep={ data.zksync.status }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { isWvmArchiver && (
        <>
          <DetailsInfoItem.Label
            hint="The external application source that generated this transaction"
            isLoading={ isLoading }
          >
            Application
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <WvmArchiverTag/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { isBlobScan && (
        <>
          <DetailsInfoItem.Label
            hint="The external application source that generated this transaction"
            isLoading={ isLoading }
          >
            Application
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <BlobScanTag/>
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label
        hint="Block number containing the transaction"
        isLoading={ isLoading }
      >
        Block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.block === null ? (
          <Text>Pending</Text>
        ) : (
          <BlockEntity isLoading={ isLoading } number={ data.block } noIcon/>
        ) }
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator color="gray.500"/>
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
              <span>{ data.confirmations } Block confirmations</span>
            </Skeleton>
          </>
        ) }
      </DetailsInfoItem.Value>

      { data.zkevm_batch_number && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint="Batch index for this transaction"
            isLoading={ isLoading }
          >
            Tx batch
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <BatchEntityL2
              isLoading={ isLoading }
              number={ data.zkevm_batch_number }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zksync && !config.UI.views.tx.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label hint="Batch number" isLoading={ isLoading }>
            Batch
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isLoading }
                number={ data.zksync.batch_number }
              />
            ) : (
              <Skeleton isLoaded={ !isLoading }>Pending</Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailsInfoItem.Label
            hint="Date & time of transaction inclusion, including length of time for confirmation"
            isLoading={ isLoading }
          >
            Timestamp
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <DetailsTimestamp
              timestamp={ data.timestamp }
              isLoading={ isLoading }
            />
            { data.confirmation_duration && (
              <>
                <TextSeparator color="gray.500"/>
                <Skeleton isLoaded={ !isLoading } color="text_secondary">
                  <span>
                    { getConfirmationDuration(data.confirmation_duration) }
                  </span>
                </Skeleton>
              </>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.execution_node && (
        <>
          <DetailsInfoItem.Label
            hint="Node that carried out the confidential computation"
            isLoading={ isLoading }
          >
            Kettle
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <AddressEntity
              address={ data.execution_node }
              href={ route({
                pathname: '/txs/kettle/[hash]',
                query: { hash: data.execution_node.hash },
              }) }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { arweaveId ? (
        <>
          <DetailsInfoItem.Label
            hint="The Arweave TXID of the WeaveVM block"
            isLoading={ isLoading }
          >
            Block archive proof
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <IconSvg
              name={ wvmIconPath }
              width="20px"
              height="20px"
              display="block"
              marginRight="5px"
              borderRadius="full"
            />
            { arweaveId === 'block_not_archived_or_backfilled' ? (
              <>
                <Text
                  color={ colorMode === 'dark' ? '#1AFFB1' : '#00B774' }
                  marginLeft="5px"
                  marginRight="12px"
                >
                  Pending{ ' ' }
                </Text>

                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="18"
                  visible={ true }
                />
              </>
            ) : (
              <>
                <Link
                  isExternal
                  href={ `https://arweave.net/${ arweaveId }` }
                  rel="noopener noreferrer"
                  color={ colorMode === 'dark' ? '#1AFFB1' : '#00B774' }
                  marginLeft="5px"
                >
                  <EntityBase.Content
                    text={
                      isSmallDevice ? truncateArweaveId(arweaveId) : arweaveId
                    }
                  />
                </Link>

                <CopyToClipboard text={ arweaveId }/>
              </>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) : (
        <Skeleton>loading...</Skeleton>
      ) }

      <DetailsInfoItemDivider/>

      <TxDetailsActions
        hash={ data.hash }
        actions={ data.actions }
        isTxDataLoading={ isLoading }
      />

      <DetailsInfoItem.Label
        hint="Address (external or contract) sending the transaction"
        isLoading={ isLoading }
      >
        From
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value columnGap={ 3 }>
        <AddressEntity address={ data.from } isLoading={ isLoading }/>
        { data.from.name && <Text>{ data.from.name }</Text> }
        { addressFromTags.length > 0 && (
          <Flex columnGap={ 3 }>{ addressFromTags }</Flex>
        ) }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Address (external or contract) receiving the transaction"
        isLoading={ isLoading }
      >
        { data.to?.is_contract ? 'Interacted with contract' : 'To' }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        columnGap={ 3 }
      >
        { toAddress ? (
          <>
            { data.to && data.to.hash ? (
              <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
                <AddressEntity address={ toAddress } isLoading={ isLoading }/>
                { executionSuccessBadge }
                { executionFailedBadge }
              </Flex>
            ) : (
              <Flex
                width="100%"
                whiteSpace="pre"
                alignItems="center"
                flexShrink={ 0 }
              >
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
              <Flex columnGap={ 3 }>{ addressToTags }</Flex>
            ) }
          </>
        ) : (
          <span>[ Contract creation ]</span>
        ) }
      </DetailsInfoItem.Value>

      { data.token_transfers && (
        <TxDetailsTokenTransfers
          data={ data.token_transfers }
          txHash={ data.hash }
          isOverflow={ data.token_transfers_overflow }
        />
      ) }

      <DetailsInfoItemDivider/>

      { data.zkevm_sequence_hash && (
        <>
          <DetailsInfoItem.Label isLoading={ isLoading }>
            Sequence tx hash
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Skeleton isLoaded={ !isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_sequence_hash }/>
            </Skeleton>
            <CopyToClipboard
              text={ data.zkevm_sequence_hash }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.zkevm_verify_hash && (
        <>
          <DetailsInfoItem.Label isLoading={ isLoading }>
            Verify tx hash
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Skeleton isLoaded={ !isLoading } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_verify_hash }/>
            </Skeleton>
            <CopyToClipboard
              text={ data.zkevm_verify_hash }
              isLoading={ isLoading }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { (data.zkevm_batch_number || data.zkevm_verify_hash) && (
        <DetailsInfoItemDivider/>
      ) }

      { !config.UI.views.tx.hiddenFields?.value && (
        <>
          <DetailsInfoItem.Label
            hint="Value sent in the native token (and USD) if applicable"
            isLoading={ isLoading }
          >
            Value
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.value }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              isLoading={ isLoading }
              flexWrap="wrap"
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <DetailsInfoItem.Label
            hint={
              data.blob_gas_used ?
                'Transaction fee without blob fee' :
                'Total transaction fee'
            }
            isLoading={ isLoading }
          >
            Transaction fee
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.stability_fee ? (
              <TxFeeStability data={ data.stability_fee } isLoading={ isLoading }/>
            ) : (
              <CurrencyValue
                value={ data.fee.value }
                currency={
                  config.UI.views.tx.hiddenFields?.fee_currency ?
                    '' :
                    currencyUnits.ether
                }
                exchangeRate={ data.exchange_rate }
                flexWrap="wrap"
                isLoading={ isLoading }
              />
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price } isLoading={ isLoading }/>

      <TxDetailsFeePerGas
        txFee={ data.fee.value }
        gasUsed={ data.gas_used }
        isLoading={ isLoading }
      />

      <DetailsInfoItem.Label
        hint="Actual gas amount used by the transaction"
        isLoading={ isLoading }
      >
        Gas usage & limit by txn
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isLoading }>
          { BigNumber(data.gas_used || 0).toFormat() }
        </Skeleton>
        <TextSeparator/>
        <Skeleton isLoaded={ !isLoading }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
        <Utilization
          ml={ 4 }
          value={ BigNumber(data.gas_used || 0)
            .dividedBy(BigNumber(data.gas_limit))
            .toNumber() }
          isLoading={ isLoading }
        />
      </DetailsInfoItem.Value>

      { !config.UI.views.tx.hiddenFields?.gas_fees &&
        (data.base_fee_per_gas ||
          data.max_fee_per_gas ||
          data.max_priority_fee_per_gas) && (
        <>
          <DetailsInfoItem.Label
            // eslint-disable-next-line max-len
            hint={ `
            Base Fee refers to the network Base Fee at the time of the block, 
            while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay 
            for their tx & to give to the ${ getNetworkValidatorTitle() } respectively
          ` }
            isLoading={ isLoading }
          >
            { `Gas fees (${ currencyUnits.gwei })` }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.base_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">
                    Base:{ ' ' }
                </Text>
                <Text fontWeight="600" as="span">
                  { BigNumber(data.base_fee_per_gas)
                    .dividedBy(WEI_IN_GWEI)
                    .toFixed() }
                </Text>
                { (data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
                  <TextSeparator/>
                ) }
              </Skeleton>
            ) }
            { data.max_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">
                    Max:{ ' ' }
                </Text>
                <Text fontWeight="600" as="span">
                  { BigNumber(data.max_fee_per_gas)
                    .dividedBy(WEI_IN_GWEI)
                    .toFixed() }
                </Text>
                { data.max_priority_fee_per_gas && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_priority_fee_per_gas && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">
                    Max priority:{ ' ' }
                </Text>
                <Text fontWeight="600" as="span">
                  { BigNumber(data.max_priority_fee_per_gas)
                    .dividedBy(WEI_IN_GWEI)
                    .toFixed() }
                </Text>
              </Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      { rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && (
        <>
          { data.l1_gas_used && (
            <>
              <DetailsInfoItem.Label
                hint="L1 gas used by transaction"
                isLoading={ isLoading }
              >
                L1 gas used by txn
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_gas_price && (
            <>
              <DetailsInfoItem.Label hint="L1 gas price" isLoading={ isLoading }>
                L1 gas price
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text mr={ 1 }>
                  { BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() }{ ' ' }
                  { currencyUnits.ether }
                </Text>
                <Text variant="secondary">
                  (
                  { BigNumber(data.l1_gas_price)
                    .dividedBy(WEI_IN_GWEI)
                    .toFixed() }{ ' ' }
                  { currencyUnits.gwei })
                </Text>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_fee && (
            <>
              <DetailsInfoItem.Label
                // eslint-disable-next-line max-len
                hint={ `L1 Data Fee which is used to cover the L1 "security" cost from the batch submission mechanism. In combination with L2 execution fee, L1 fee makes the total amount of fees that a transaction pays.` }
                isLoading={ isLoading }
              >
                L1 fee
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <CurrencyValue
                  value={ data.l1_fee }
                  currency={ currencyUnits.ether }
                  exchangeRate={ data.exchange_rate }
                  flexWrap="wrap"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.l1_fee_scalar && (
            <>
              <DetailsInfoItem.Label
                hint="A Dynamic overhead (fee scalar) premium, which serves as a buffer in case L1 prices rapidly increase."
                isLoading={ isLoading }
              >
                L1 fee scalar
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <Text>{ data.l1_fee_scalar }</Text>
              </DetailsInfoItem.Value>
            </>
          ) }
        </>
      ) }

      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="TxInfo__cutLink">
          <Skeleton isLoaded={ !isLoading } mt={ 6 } display="inline-block">
            <Link
              display="inline-block"
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

      { isExpanded && (
        <>
          <GridItem
            colSpan={{ base: undefined, lg: 2 }}
            mt={{ base: 1, lg: 4 }}
          />
          { (data.blob_gas_used ||
            data.max_fee_per_blob_gas ||
            data.blob_gas_price) && (
            <>
              { data.blob_gas_used && data.blob_gas_price && (
                <>
                  <DetailsInfoItem.Label hint="Blob fee for this transaction">
                    Blob fee
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    <CurrencyValue
                      value={ BigNumber(data.blob_gas_used)
                        .multipliedBy(data.blob_gas_price)
                        .toString() }
                      currency={
                        config.UI.views.tx.hiddenFields?.fee_currency ?
                          '' :
                          currencyUnits.ether
                      }
                      exchangeRate={ data.exchange_rate }
                      flexWrap="wrap"
                      isLoading={ isLoading }
                    />
                  </DetailsInfoItem.Value>
                </>
              ) }

              { data.blob_gas_used && (
                <>
                  <DetailsInfoItem.Label hint="Amount of gas used by the blobs in this transaction">
                    Blob gas usage
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    { BigNumber(data.blob_gas_used).toFormat() }
                  </DetailsInfoItem.Value>
                </>
              ) }

              { (data.max_fee_per_blob_gas || data.blob_gas_price) && (
                <>
                  <DetailsInfoItem.Label
                    hint={ `Amount of ${ currencyUnits.ether } used for blobs in this transaction` }
                  >
                    { `Blob gas fees (${ currencyUnits.gwei })` }
                  </DetailsInfoItem.Label>
                  <DetailsInfoItem.Value>
                    { data.blob_gas_price && (
                      <Text fontWeight="600" as="span">
                        { BigNumber(data.blob_gas_price)
                          .dividedBy(WEI_IN_GWEI)
                          .toFixed() }
                      </Text>
                    ) }
                    { data.max_fee_per_blob_gas && data.blob_gas_price && (
                      <TextSeparator/>
                    ) }
                    { data.max_fee_per_blob_gas && (
                      <>
                        <Text as="span" fontWeight="500" whiteSpace="pre">
                          Max:{ ' ' }
                        </Text>
                        <Text fontWeight="600" as="span">
                          { BigNumber(data.max_fee_per_blob_gas)
                            .dividedBy(WEI_IN_GWEI)
                            .toFixed() }
                        </Text>
                      </>
                    ) }
                  </DetailsInfoItem.Value>
                </>
              ) }
              <DetailsInfoItemDivider/>
            </>
          ) }

          <TxDetailsOther
            nonce={ data.nonce }
            type={ data.type }
            position={ data.position }
          />

          <DetailsInfoItem.Label hint="Binary data included with the transaction. See logs tab for additional info">
            Raw input
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <RawInputData hex={ data.raw_input }/>
          </DetailsInfoItem.Value>

          { data.decoded_input && (
            <>
              <DetailsInfoItem.Label hint="Decoded input data">
                Decoded input data
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <LogDecodedInputData data={ data.decoded_input }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.zksync && (
            <ZkSyncL2TxnBatchHashesInfo
              data={ data.zksync }
              isLoading={ isLoading }
            />
          ) }
        </>
      ) }
    </Grid>
  );
};

export default TxInfo;
