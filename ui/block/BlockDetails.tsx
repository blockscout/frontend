import { Grid, GridItem, Text, Link, Box, Tooltip, useColorModeValue, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockReward from 'lib/block/getBlockReward';
import { GWEI, WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import { space } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { currencyUnits } from 'lib/units';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';
import ZkSyncL2TxnBatchHashesInfo from 'ui/txnBatches/zkSyncL2/ZkSyncL2TxnBatchHashesInfo';

import BlockDetailsBlobInfo from './details/BlockDetailsBlobInfo';
import type { BlockQuery } from './useBlockQuery';

interface Props {
  query: BlockQuery;
}

const rollupFeature = config.features.rollup;

const BlockDetails = ({ query }: Props) => {
  const { t } = useTranslation('common');

  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);

  const separatorColor = useColorModeValue('gray.200', 'gray.700');

  const { data, isPlaceholderData } = query;

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.height + increment);

    router.push({ pathname: '/block/[height_or_hash]', query: { height_or_hash: nextId } }, undefined);
  }, [ data, router ]);

  if (!data) {
    return null;
  }

  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  const rewardBreakDown = (() => {
    if (rollupFeature.isEnabled || totalReward.isEqualTo(ZERO) || txFees.isEqualTo(ZERO) || burntFees.isEqualTo(ZERO)) {
      return null;
    }

    if (isPlaceholderData) {
      return <Skeleton w="525px" h="20px"/>;
    }

    return (
      <Text variant="secondary" whiteSpace="break-spaces">
        <Tooltip label="Static block reward">
          <span>{ staticReward.dividedBy(WEI).toFixed() }</span>
        </Tooltip>
        { !txFees.isEqualTo(ZERO) && (
          <>
            { space }+{ space }
            <Tooltip label="Txn fees">
              <span>{ txFees.dividedBy(WEI).toFixed() }</span>
            </Tooltip>
          </>
        ) }
        { !burntFees.isEqualTo(ZERO) && (
          <>
            { space }-{ space }
            <Tooltip label="Burnt fees">
              <span>{ burntFees.dividedBy(WEI).toFixed() }</span>
            </Tooltip>
          </>
        ) }
      </Text>
    );
  })();

  const verificationTitle = (() => {
    if (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm') {
      return 'Sequenced by';
    }

    return config.chain.verificationType === 'validation' ? t('block_related.Validated_by') : t('block_related.Mined_by');
  })();

  const txsNum = (() => {
    const blockTxsNum = (
      <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'txs' } }) }>
        { data.tx_count } txn{ data.tx_count === 1 ? '' : 's' }
      </LinkInternal>
    );

    const blockBlobTxsNum = data.blob_tx_count ? (
      <>
        <span> and </span>
        <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'blob_txs' } }) }>
          { data.blob_tx_count } blob txn{ data.blob_tx_count === 1 ? '' : 's' }
        </LinkInternal>
      </>
    ) : null;

    return (
      <>
        { blockTxsNum }
        { blockBlobTxsNum }
        <span> { t('block_related.in_this_block') }</span>
      </>
    );
  })();

  const blockTypeLabel = (() => {
    switch (data.type) {
      case 'reorg':
        return t('block_related.Reorg');
      case 'uncle':
        return t('block_related.Uncle');
      default:
        return t('Block');
    }
  })();

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem
        title={ `${ blockTypeLabel } ${ t('height') }` }
        hint={ t('block_related.The_block_height_of_a_particular_block_is_defined_as_the_number_of_blocks_preceding_it_in_the_blockchain') }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.height }
        </Skeleton>
        { data.height === 0 && <Text whiteSpace="pre"> - Genesis Block</Text> }
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous block"
          nextLabel="View next block"
          isPrevDisabled={ data.height === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ t('block_related.Size') }
        hint={ t('block_related.Size_of_the_block_in_bytes') }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.size.toLocaleString() }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ t('block_related.Timestamp') }
        hint={ t('block_related.Date_time_at_which_block_was_produced') }
        isLoading={ isPlaceholderData }
      >
        <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ t('block_related.Transactions') }
        hint={ t('block_related.The_number_of_transactions_in_the_block') }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { txsNum }
        </Skeleton>
      </DetailsInfoItem>
      { config.features.beaconChain.isEnabled && Boolean(data.withdrawals_count) && (
        <DetailsInfoItem
          title="Withdrawals"
          hint="The number of beacon withdrawals in the block"
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'withdrawals' } }) }>
              { data.withdrawals_count } withdrawal{ data.withdrawals_count === 1 ? '' : 's' }
            </LinkInternal>
          </Skeleton>
        </DetailsInfoItem>
      ) }

      { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync && (
        <>
          <DetailsInfoItem
            title="Batch"
            hint="Batch number"
            isLoading={ isPlaceholderData }
          >
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isPlaceholderData }
                number={ data.zksync.batch_number }
              />
            ) : <Skeleton isLoaded={ !isPlaceholderData }>Pending</Skeleton> }
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Status"
            hint="Status is the short interpretation of the batch lifecycle"
            isLoading={ isPlaceholderData }
          >
            <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES } currentStep={ data.zksync.status } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.miner && (
        <DetailsInfoItem
          title={ verificationTitle }
          hint={ t('block_related.A_block_producer_who_successfully_included_the_block_onto_the_blockchain') }
          columnGap={ 1 }
          isLoading={ isPlaceholderData }
        >
          <AddressEntity
            address={ data.miner }
            isLoading={ isPlaceholderData }
          />
          { /* api doesn't return the block processing time yet */ }
          { /* <Text>{ dayjs.duration(block.minedIn, 'second').humanize(true) }</Text> */ }
        </DetailsInfoItem>
      ) }
      { !rollupFeature.isEnabled && !totalReward.isEqualTo(ZERO) && !config.UI.views.block.hiddenFields?.total_reward && (
        <DetailsInfoItem
          title={ t('block_related.Block_reward') }
          hint={
            t('block_related.For_each_block_the_validator_is_rewarded_with_a_finite_amount_of_ZCX_on_top_of_the_fees_paid_for_all_transactions_in_the_block')
          }
          columnGap={ 1 }
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            { totalReward.dividedBy(WEI).toFixed() } { currencyUnits.ether }
          </Skeleton>
          { rewardBreakDown }
        </DetailsInfoItem>
      ) }
      { data.rewards
        ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
        .map(({ type, reward }) => (
          <DetailsInfoItem
            key={ type }
            title={ t('block_related.Validator_Reward') }
            // is this text correct for validators?
            hint={ t('block_related.Amount_of_distributed_reward_validators_receive_a_static_block_reward_Tx_fees_uncle_fees') }
          >
            { BigNumber(reward).dividedBy(WEI).toFixed() } { currencyUnits.ether }
          </DetailsInfoItem>
        ))
      }

      <DetailsInfoItemDivider/>

      <DetailsInfoItem
        title={ t('block_related.Gas_used') }
        hint={ t('block_related.The_total_gas_amount_used_in_the_block_and_its_percentage_of_gas_filled_in_the_block') }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_used || 0).toFormat() }
        </Skeleton>
        <Utilization
          ml={ 4 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() }
          isLoading={ isPlaceholderData }
        />
        { data.gas_target_percentage && (
          <>
            <TextSeparator color={ separatorColor } mx={ 1 }/>
            <GasUsedToTargetRatio value={ data.gas_target_percentage } isLoading={ isPlaceholderData }/>
          </>
        ) }
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ t('block_related.Gas_limit') }
        hint={ t('block_related.Total_gas_limit_provided_by_all_transactions_in_the_block') }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
      </DetailsInfoItem>
      { data.minimum_gas_price && (
        <DetailsInfoItem
          title={ t('block_related.Minimum_gas_price') }
          hint={ t('block_related.The_minimum_gas_price_a_transaction_should_have_in_order_to_be_included_in_this_block') }
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            { BigNumber(data.minimum_gas_price).dividedBy(GWEI).toFormat() } { currencyUnits.gwei }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { data.base_fee_per_gas && (
        <DetailsInfoItem
          title={ t('block_related.Base_fee_per_gas') }
          hint={ t('block_related.Minimum_fee_required_per_unit_of_gas_Fee_adjusts_based_on_network_congestion') }
          isLoading={ isPlaceholderData }
        >
          { isPlaceholderData ? (
            <Skeleton isLoaded={ !isPlaceholderData } h="20px" maxW="380px" w="100%"/>
          ) : (
            <>
              <Text>{ BigNumber(data.base_fee_per_gas).dividedBy(WEI).toFixed() } { currencyUnits.ether } </Text>
              <Text variant="secondary" whiteSpace="pre">
                { space }({ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })
              </Text>
            </>
          ) }
        </DetailsInfoItem>
      ) }
      { !config.UI.views.block.hiddenFields?.burnt_fees && !burntFees.isEqualTo(ZERO) && (
        <DetailsInfoItem
          title="Burnt fees"
          hint={
            `Amount of ${ config.chain.currency.symbol || 'native token' } burned from transactions included in the block.

          Equals Block Base Fee per Gas * Gas Used`
          }
          isLoading={ isPlaceholderData }
        >
          <IconSvg name="flame" boxSize={ 5 } color="gray.500" isLoading={ isPlaceholderData }/>
          <Skeleton isLoaded={ !isPlaceholderData } ml={ 2 }>
            { burntFees.dividedBy(WEI).toFixed() } { currencyUnits.ether }
          </Skeleton>
          { !txFees.isEqualTo(ZERO) && (
            <Tooltip label="Burnt fees / Txn fees * 100%">
              <Box>
                <Utilization
                  ml={ 4 }
                  value={ burntFees.dividedBy(txFees).toNumber() }
                  isLoading={ isPlaceholderData }
                />
              </Box>
            </Tooltip>
          ) }
        </DetailsInfoItem>
      ) }
      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <DetailsInfoItem
          title={ t('block_related.Priority_fee_Tip') }
          hint={ t('block_related.User_defined_tips_sent_to_validator_for_transaction_priority_inclusion') }
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            { BigNumber(data.priority_fee).dividedBy(WEI).toFixed() } { currencyUnits.ether }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="BlockDetails__cutLink">
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

          { rollupFeature.isEnabled && rollupFeature.type === 'zkSync' && data.zksync &&
            <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isPlaceholderData }/> }

          { !isPlaceholderData && <BlockDetailsBlobInfo data={ data }/> }

          { data.bitcoin_merged_mining_header && (
            <DetailsInfoItem
              title="Bitcoin merged mining header"
              hint="Merged-mining field: Bitcoin header"
              flexWrap="nowrap"
              alignSelf="flex-start"
            >
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.bitcoin_merged_mining_header }/>
              </Box>
              <CopyToClipboard text={ data.bitcoin_merged_mining_header }/>
            </DetailsInfoItem>
          ) }
          { data.bitcoin_merged_mining_coinbase_transaction && (
            <DetailsInfoItem
              title="Bitcoin merged mining coinbase transaction"
              hint="Merged-mining field: Coinbase transaction"
            >
              <RawDataSnippet
                data={ data.bitcoin_merged_mining_coinbase_transaction }
                isLoading={ isPlaceholderData }
                showCopy={ false }
                textareaMaxHeight="100px"
              />
            </DetailsInfoItem>
          ) }
          { data.bitcoin_merged_mining_merkle_proof && (
            <DetailsInfoItem
              title="Bitcoin merged mining Merkle proof"
              hint="Merged-mining field: Merkle proof"
            >
              <RawDataSnippet
                data={ data.bitcoin_merged_mining_merkle_proof }
                isLoading={ isPlaceholderData }
                showCopy={ false }
                textareaMaxHeight="100px"
              />
            </DetailsInfoItem>
          ) }
          { data.hash_for_merged_mining && (
            <DetailsInfoItem
              title="Hash for merged mining"
              hint="Merged-mining field: Rootstock block header hash"
              flexWrap="nowrap"
              alignSelf="flex-start"
            >
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.hash_for_merged_mining }/>
              </Box>
              <CopyToClipboard text={ data.hash_for_merged_mining }/>
            </DetailsInfoItem>
          ) }

          <DetailsInfoItem
            title={ t('block_related.Difficulty') }
            hint={ t('block_related.Block_difficulty_for_validator_used_to_calibrate_block_generation_time') }
          >
            <Box whiteSpace="nowrap" overflow="hidden">
              <HashStringShortenDynamic hash={ BigNumber(data.difficulty).toFormat() }/>
            </Box>
          </DetailsInfoItem>
          { data.total_difficulty && (
            <DetailsInfoItem
              title={ t('block_related.Total_difficulty') }
              hint={ t('block_related.Total_difficulty_of_the_chain_until_this_block') }
            >
              <Box whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ BigNumber(data.total_difficulty).toFormat() }/>
              </Box>
            </DetailsInfoItem>
          ) }

          <DetailsInfoItemDivider/>

          <DetailsInfoItem
            title={ t('block_related.Hash') }
            hint={ t('block_related.The_SHA256_hash_of_the_block') }
            flexWrap="nowrap"
          >
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ data.hash }/>
            </Box>
            <CopyToClipboard text={ data.hash }/>
          </DetailsInfoItem>
          { data.height > 0 && (
            <DetailsInfoItem
              title={ t('block_related.Parent_hash') }
              hint={ t('block_related.The_hash_of_the_block_from_which_this_block_was_generated') }
              flexWrap="nowrap"
            >
              <LinkInternal
                href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height - 1) } }) }
                overflow="hidden"
                whiteSpace="nowrap"
              >
                <HashStringShortenDynamic
                  hash={ data.parent_hash }
                />
              </LinkInternal>
              <CopyToClipboard text={ data.parent_hash }/>
            </DetailsInfoItem>
          ) }
          { /* api doesn't support state root yet */ }
          { /* <DetailsInfoItem
            title="State root"
            hint="The root of the state trie"
          >
            <Text wordBreak="break-all" whiteSpace="break-spaces">{ data.state_root }</Text>
          </DetailsInfoItem> */ }
          { !config.UI.views.block.hiddenFields?.nonce && (
            <DetailsInfoItem
              title={ t('block_related.Nonce') }
              hint={ t('block_related.Block_nonce_is_a_value_used_during_mining_to_demonstrate_proof_of_work_for_a_block') }
            >
              { data.nonce }
            </DetailsInfoItem>
          ) }
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
