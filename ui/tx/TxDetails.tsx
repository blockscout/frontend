import {
  Grid,
  GridItem,
  Text,
  Box,
  Icon as ChakraIcon,
  Link,
  Spinner,
  Flex,
  Tooltip,
  chakra,
  useColorModeValue,
  Skeleton,
  Alert,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { ZKEVM_L2_TX_STATUSES } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import errorIcon from 'icons/status/error.svg';
import successIcon from 'icons/status/success.svg';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import dayjs from 'lib/date/dayjs';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getConfirmationDuration from 'lib/tx/getConfirmationDuration';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ZkEvmBatchEntityL2 from 'ui/shared/entities/block/ZkEvmBatchEntityL2';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import TxDetailsActions from 'ui/tx/details/TxDetailsActions';
import TxDetailsFeePerGas from 'ui/tx/details/TxDetailsFeePerGas';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';
import TxDetailsTokenTransfers from 'ui/tx/details/TxDetailsTokenTransfers';
import TxDetailsWithdrawalStatus from 'ui/tx/details/TxDetailsWithdrawalStatus';
import TxRevertReason from 'ui/tx/details/TxRevertReason';
import TxAllowedPeekers from 'ui/tx/TxAllowedPeekers';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxDetails = () => {
  const { data, isPlaceholderData, isError, socketStatus, error } = useFetchTxInfo();

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('TxDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);
  const executionSuccessIconColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  if (isError) {
    if (error?.status === 422) {
      throw Error('Invalid tx hash', { cause: error as unknown as Error });
    }

    if (error?.status === 404) {
      throw Error('Tx not found', { cause: error as unknown as Error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const addressFromTags = [
    ...data.from.private_tags || [],
    ...data.from.public_tags || [],
    ...data.from.watchlist_names || [],
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const toAddress = data.to ? data.to : data.created_contract;
  const addressToTags = [
    ...toAddress?.private_tags || [],
    ...toAddress?.public_tags || [],
    ...toAddress?.watchlist_names || [],
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const actionsExist = data.actions && data.actions.length > 0;

  const executionSuccessBadge = toAddress?.is_contract && data.result === 'success' ? (
    <Tooltip label="Contract execution completed">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <ChakraIcon as={ successIcon } boxSize={ 4 } color={ executionSuccessIconColor } cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;
  const executionFailedBadge = toAddress?.is_contract && Boolean(data.status) && data.result !== 'success' ? (
    <Tooltip label="Error occurred during contract execution">
      <chakra.span display="inline-flex" ml={ 2 } mr={ 1 }>
        <ChakraIcon as={ errorIcon } boxSize={ 4 } color="error" cursor="pointer"/>
      </chakra.span>
    </Tooltip>
  ) : null;

  return (
    <>
      { config.chain.isTestnet && (
        <Skeleton mb={ 6 } isLoaded={ !isPlaceholderData }>
          <Alert status="warning">This is a testnet transaction only</Alert>
        </Skeleton>
      ) }
      <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
        { socketStatus && (
          <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
            <TxSocketAlert status={ socketStatus }/>
          </GridItem>
        ) }
        <DetailsInfoItem
          title="Transaction hash"
          hint="Unique character string (TxID) assigned to every verified transaction"
          flexWrap="nowrap"
          isLoading={ isPlaceholderData }
        >
          { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
          <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
            <HashStringShortenDynamic hash={ data.hash }/>
          </Skeleton>
          <CopyToClipboard text={ data.hash } isLoading={ isPlaceholderData }/>
        </DetailsInfoItem>
        <DetailsInfoItem
          title={ config.features.zkEvmRollup.isEnabled ? 'L2 status and method' : 'Status and method' }
          hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
          isLoading={ isPlaceholderData }
        >
          <TxStatus status={ data.status } errorText={ data.status === 'error' ? data.result : undefined } isLoading={ isPlaceholderData }/>
          { data.method && (
            <Tag colorScheme={ data.method === 'Multicall' ? 'teal' : 'gray' } isLoading={ isPlaceholderData } isTruncated ml={ 3 }>
              { data.method }
            </Tag>
          ) }
        </DetailsInfoItem>
        <TxDetailsWithdrawalStatus
          status={ data.op_withdrawal_status }
          l1TxHash={ data.op_l1_transaction_hash }
        />
        { data.zkevm_status && (
          <DetailsInfoItem
            title="Confirmation status"
            hint="Status of the transaction confirmation path to L1"
            isLoading={ isPlaceholderData }
          >
            <VerificationSteps currentStep={ data.zkevm_status } steps={ ZKEVM_L2_TX_STATUSES } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem>
        ) }
        { data.revert_reason && (
          <DetailsInfoItem
            title="Revert reason"
            hint="The revert reason of the transaction"
          >
            <TxRevertReason { ...data.revert_reason }/>
          </DetailsInfoItem>
        ) }
        <DetailsInfoItem
          title="Block"
          hint="Block number containing the transaction"
          isLoading={ isPlaceholderData }
        >
          { data.block === null ?
            <Text>Pending</Text> : (
              <BlockEntity
                isLoading={ isPlaceholderData }
                number={ data.block }
                noIcon
              />
            ) }
          { Boolean(data.confirmations) && (
            <>
              <TextSeparator color="gray.500"/>
              <Skeleton isLoaded={ !isPlaceholderData } color="text_secondary">
                <span>{ data.confirmations } Block confirmations</span>
              </Skeleton>
            </>
          ) }
        </DetailsInfoItem>
        { data.zkevm_batch_number && (
          <DetailsInfoItem
            title="Tx batch"
            hint="Batch index for this transaction"
            isLoading={ isPlaceholderData }
          >
            <ZkEvmBatchEntityL2
              isLoading={ isPlaceholderData }
              number={ data.zkevm_batch_number }
            />
          </DetailsInfoItem>
        ) }
        { data.timestamp && (
          <DetailsInfoItem
            title="Timestamp"
            hint="Date & time of transaction inclusion, including length of time for confirmation"
            isLoading={ isPlaceholderData }
          >
            <Icon as={ clockIcon } boxSize={ 5 } color="gray.500" isLoading={ isPlaceholderData }/>
            <Skeleton isLoaded={ !isPlaceholderData } ml={ 2 }>{ dayjs(data.timestamp).fromNow() }</Skeleton>
            <TextSeparator/>
            <Skeleton isLoaded={ !isPlaceholderData } whiteSpace="normal">{ dayjs(data.timestamp).format('llll') }</Skeleton>
            <TextSeparator color="gray.500"/>
            <Skeleton isLoaded={ !isPlaceholderData } color="text_secondary">
              <span>{ getConfirmationDuration(data.confirmation_duration) }</span>
            </Skeleton>
          </DetailsInfoItem>
        ) }
        { data.execution_node && (
          <DetailsInfoItem
            title="Kettle"
            hint="Node that carried out the confidential computation"
            isLoading={ isPlaceholderData }
          >
            <AddressEntity
              address={ data.execution_node }
              href={ route({ pathname: '/txs/kettle/[hash]', query: { hash: data.execution_node.hash } }) }
            />
          </DetailsInfoItem>
        ) }
        { data.allowed_peekers && data.allowed_peekers.length > 0 && (
          <TxAllowedPeekers items={ data.allowed_peekers }/>
        ) }
        <DetailsSponsoredItem isLoading={ isPlaceholderData }/>

        <DetailsInfoItemDivider/>

        { actionsExist && (
          <>
            <TxDetailsActions actions={ data.actions }/>
            <DetailsInfoItemDivider/>
          </>
        ) }

        <DetailsInfoItem
          title="From"
          hint="Address (external or contract) sending the transaction"
          isLoading={ isPlaceholderData }
          columnGap={ 3 }
        >
          <AddressEntity
            address={ data.from }
            isLoading={ isPlaceholderData }
          />
          { data.from.name && <Text>{ data.from.name }</Text> }
          { addressFromTags.length > 0 && (
            <Flex columnGap={ 3 }>
              { addressFromTags }
            </Flex>
          ) }
        </DetailsInfoItem>
        <DetailsInfoItem
          title={ data.to?.is_contract ? 'Interacted with contract' : 'To' }
          hint="Address (external or contract) receiving the transaction"
          isLoading={ isPlaceholderData }
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          columnGap={ 3 }
        >
          { toAddress ? (
            <>
              { data.to && data.to.hash ? (
                <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
                  <AddressEntity
                    address={ toAddress }
                    isLoading={ isPlaceholderData }
                  />
                  { executionSuccessBadge }
                  { executionFailedBadge }
                </Flex>
              ) : (
                <Flex width="100%" whiteSpace="pre" alignItems="center" flexShrink={ 0 }>
                  <span>[Contract </span>
                  <AddressEntity
                    address={ toAddress }
                    isLoading={ isPlaceholderData }
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
        </DetailsInfoItem>
        { data.token_transfers && <TxDetailsTokenTransfers data={ data.token_transfers } txHash={ data.hash } isOverflow={ data.token_transfers_overflow }/> }

        <DetailsInfoItemDivider/>

        { data.zkevm_sequence_hash && (
          <DetailsInfoItem
            title="Sequence tx hash"
            flexWrap="nowrap"

            isLoading={ isPlaceholderData }
          >
            <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
              <HashStringShortenDynamic hash={ data.zkevm_sequence_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_sequence_hash } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem>
        ) }
        { data.zkevm_verify_hash && (
          <DetailsInfoItem
            title="Verify tx hash"
            flexWrap="nowrap"
            isLoading={ isPlaceholderData }
          >
            <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">

              <HashStringShortenDynamic hash={ data.zkevm_verify_hash }/>
            </Skeleton>
            <CopyToClipboard text={ data.zkevm_verify_hash } isLoading={ isPlaceholderData }/>

          </DetailsInfoItem>
        ) }

        { (data.zkevm_batch_number || data.zkevm_verify_hash) && <DetailsInfoItemDivider/> }

        { !config.UI.views.tx.hiddenFields?.value && (
          <DetailsInfoItem
            title="Value"
            hint="Value sent in the native token (and USD) if applicable"
            isLoading={ isPlaceholderData }
          >
            <CurrencyValue
              value={ data.value }
              currency={ config.chain.currency.symbol }
              exchangeRate={ data.exchange_rate }
              isLoading={ isPlaceholderData }
              flexWrap="wrap"
            />
          </DetailsInfoItem>
        ) }
        { !config.UI.views.tx.hiddenFields?.tx_fee && (
          <DetailsInfoItem
            title="Transaction fee"
            hint="Total transaction fee"
            isLoading={ isPlaceholderData }
          >
            { data.stability_fee ? (
              <TxFeeStability data={ data.stability_fee } isLoading={ isPlaceholderData }/>
            ) : (
              <CurrencyValue
                value={ data.fee.value }
                currency={ config.UI.views.tx.hiddenFields?.fee_currency ? '' : config.chain.currency.symbol }
                exchangeRate={ data.exchange_rate }
                flexWrap="wrap"
                isLoading={ isPlaceholderData }
              />
            ) }
          </DetailsInfoItem>
        ) }

        <TxDetailsGasPrice gasPrice={ data.gas_price } isLoading={ isPlaceholderData }/>

        <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isPlaceholderData }/>

        <DetailsInfoItem
          title="Gas usage & limit by txn"
          hint="Actual gas amount used by the transaction"
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>{ BigNumber(data.gas_used || 0).toFormat() }</Skeleton>
          <TextSeparator/>
          <Skeleton isLoaded={ !isPlaceholderData }>{ BigNumber(data.gas_limit).toFormat() }</Skeleton>
          <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() } isLoading={ isPlaceholderData }/>
        </DetailsInfoItem>
        { !config.UI.views.tx.hiddenFields?.gas_fees &&
          (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
          <DetailsInfoItem
            title="Gas fees (Gwei)"
            // eslint-disable-next-line max-len
            hint={ `
              Base Fee refers to the network Base Fee at the time of the block, 
              while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay 
              for their tx & to give to the ${ getNetworkValidatorTitle() } respectively
            ` }
            isLoading={ isPlaceholderData }
          >
            { data.base_fee_per_gas && (
              <Skeleton isLoaded={ !isPlaceholderData }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { (data.max_fee_per_gas || data.max_priority_fee_per_gas) && <TextSeparator/> }
              </Skeleton>
            ) }
            { data.max_fee_per_gas && (
              <Box>
                <Text as="span" fontWeight="500">Max: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
                { data.max_priority_fee_per_gas && <TextSeparator/> }
              </Box>
            ) }
            { data.max_priority_fee_per_gas && (
              <Box>
                <Text as="span" fontWeight="500">Max priority: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Box>
            ) }
          </DetailsInfoItem>
        ) }
        { data.tx_burnt_fee && !config.UI.views.tx.hiddenFields?.burnt_fees && !config.features.optimisticRollup.isEnabled && (
          <DetailsInfoItem
            title="Burnt fees"
            hint={ `Amount of ${ config.chain.currency.symbol } burned for this transaction. Equals Block Base Fee per Gas * Gas Used` }
          >
            <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
            <CurrencyValue
              value={ String(data.tx_burnt_fee) }
              currency={ config.chain.currency.symbol }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
              ml={ 2 }
            />
          </DetailsInfoItem>
        ) }
        { config.features.optimisticRollup.isEnabled && (
          <>
            { data.l1_gas_used && (
              <DetailsInfoItem
                title="L1 gas used by txn"
                hint="L1 gas used by transaction"
                isLoading={ isPlaceholderData }
              >
                <Text>{ BigNumber(data.l1_gas_used).toFormat() }</Text>
              </DetailsInfoItem>
            ) }
            { data.l1_gas_price && (
              <DetailsInfoItem
                title="L1 gas price"
                hint="L1 gas price"
                isLoading={ isPlaceholderData }
              >
                <Text mr={ 1 }>{ BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() } { config.chain.currency.symbol }</Text>
                <Text variant="secondary">({ BigNumber(data.l1_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } Gwei)</Text>
              </DetailsInfoItem>
            ) }
            { data.l1_fee && (
              <DetailsInfoItem
                title="L1 fee"
                // eslint-disable-next-line max-len
                hint={ `L1 Data Fee which is used to cover the L1 "security" cost from the batch submission mechanism. In combination with L2 execution fee, L1 fee makes the total amount of fees that a transaction pays.` }
                isLoading={ isPlaceholderData }
              >
                <CurrencyValue
                  value={ data.l1_fee }
                  currency={ config.chain.currency.symbol }
                  exchangeRate={ data.exchange_rate }
                  flexWrap="wrap"
                />
              </DetailsInfoItem>
            ) }
            { data.l1_fee_scalar && (
              <DetailsInfoItem
                title="L1 fee scalar"
                hint="A Dynamic overhead (fee scalar) premium, which serves as a buffer in case L1 prices rapidly increase."
                isLoading={ isPlaceholderData }
              >
                <Text>{ data.l1_fee_scalar }</Text>
              </DetailsInfoItem>
            ) }
          </>
        ) }
        <GridItem colSpan={{ base: undefined, lg: 2 }}>
          <Element name="TxDetails__cutLink">
            <Skeleton isLoaded={ !isPlaceholderData } mt={ 6 } display="inline-block">
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
            <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>
            <TxDetailsOther nonce={ data.nonce } type={ data.type } position={ data.position }/>
            <DetailsInfoItem
              title="Raw input"
              hint="Binary data included with the transaction. See logs tab for additional info"
            >
              <RawInputData hex={ data.raw_input }/>
            </DetailsInfoItem>
            { data.decoded_input && (
              <DetailsInfoItem
                title="Decoded input data"
                hint="Decoded input data"
              >
                <LogDecodedInputData data={ data.decoded_input }/>
              </DetailsInfoItem>
            ) }
          </>
        ) }
      </Grid>
    </>
  );
};

export default TxDetails;
