import {
  Grid,
  GridItem,
  Text,
  Link,
  Box,
  Tooltip,
  useColorModeValue,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react';
import { useWindowSize } from '@uidotdev/usehooks';
import BigNumber from 'bignumber.js';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';
import { TbCoins } from 'react-icons/tb';
import { RotatingLines } from 'react-loader-spinner';
import { scroller, Element } from 'react-scroll';

import { ZKSYNC_L2_TX_BATCH_STATUSES } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockReward from 'lib/block/getBlockReward';
import { GWEI, WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import { useArweaveId } from 'lib/hooks/useArweaveId';
import { space } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import { currencyUnits } from 'lib/units';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as EntityBase from 'ui/shared/entities/base/components';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
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
  const size = useWindowSize();
  const { colorMode } = useColorMode();
  const isSmallDevice = size.width && size.width < 768;
  const wvmIconPath =
    colorMode === 'light' ? 'networks/arweave-dark' : 'networks/arweave-light';
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);

  const separatorColor = useColorModeValue('gray.200', 'gray.700');

  const { data, isPlaceholderData } = query;

  const { data: arweaveId, isLoading } = useArweaveId({
    block: data?.height,
  });

  const truncateArweaveId = (address: string) => {
    const start = address.slice(0, 28);
    const end = address.slice(-4);
    return `${ start }...${ end }`;
  };

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const handlePrevNextClick = React.useCallback(
    (direction: 'prev' | 'next') => {
      if (!data) {
        return;
      }

      const increment = direction === 'next' ? +1 : -1;
      const nextId = String(data.height + increment);

      router.push(
        {
          pathname: '/block/[height_or_hash]',
          query: { height_or_hash: nextId },
        },
        undefined,
      );
    },
    [ data, router ],
  );

  if (!data) {
    return null;
  }

  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  const validatorTitle = getNetworkValidatorTitle();

  const rewardBreakDown = (() => {
    if (
      rollupFeature.isEnabled ||
      totalReward.isEqualTo(ZERO) ||
      txFees.isEqualTo(ZERO) ||
      burntFees.isEqualTo(ZERO)
    ) {
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
            <Tooltip label="Network revenue">
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

    return config.chain.verificationType === 'validation' ?
      'Validated by' :
      'Mined by';
  })();

  const txsNum = (() => {
    const blockTxsNum = (
      <LinkInternal
        href={ route({
          pathname: '/block/[height_or_hash]',
          query: { height_or_hash: heightOrHash, tab: 'txs' },
        }) }
      >
        { data.tx_count } txn{ data.tx_count === 1 ? '' : 's' }
      </LinkInternal>
    );

    const blockBlobTxsNum =
      config.features.dataAvailability.isEnabled && data.blob_tx_count ? (
        <>
          <span> including </span>
          <LinkInternal
            href={ route({
              pathname: '/block/[height_or_hash]',
              query: { height_or_hash: heightOrHash, tab: 'blob_txs' },
            }) }
          >
            { data.blob_tx_count } blob txn{ data.blob_tx_count === 1 ? '' : 's' }
          </LinkInternal>
        </>
      ) : null;

    return (
      <>
        { blockTxsNum }
        { blockBlobTxsNum }
        <span> in this block</span>
      </>
    );
  })();

  const blockTypeLabel = (() => {
    switch (data.type) {
      case 'reorg':
        return 'Reorg';
      case 'uncle':
        return 'Uncle';
      default:
        return 'Block';
    }
  })();

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{
        base: 'minmax(0, 1fr)',
        lg: 'minmax(min-content, 200px) minmax(0, 1fr)',
      }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain"
        isLoading={ isPlaceholderData }
      >
        { blockTypeLabel } height
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>{ data.height }</Skeleton>
        { data.height === 0 && <Text whiteSpace="pre"> - Genesis Block</Text> }
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous block"
          nextLabel="View next block"
          isPrevDisabled={ data.height === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Size of the block in bytes"
        isLoading={ isPlaceholderData }
      >
        Size
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.size.toLocaleString() }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Date & time at which block was produced."
        isLoading={ isPlaceholderData }
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <DetailsTimestamp
          timestamp={ data.timestamp }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The number of transactions in the block"
        isLoading={ isPlaceholderData }
      >
        Transactions
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>{ txsNum }</Skeleton>
      </DetailsInfoItem.Value>

      { config.features.beaconChain.isEnabled &&
        Boolean(data.withdrawals_count) && (
        <>
          <DetailsInfoItem.Label
            hint="The number of beacon withdrawals in the block"
            isLoading={ isPlaceholderData }
          >
              Withdrawals
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              <LinkInternal
                href={ route({
                  pathname: '/block/[height_or_hash]',
                  query: { height_or_hash: heightOrHash, tab: 'withdrawals' },
                }) }
              >
                { data.withdrawals_count } withdrawal
                { data.withdrawals_count === 1 ? '' : 's' }
              </LinkInternal>
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { rollupFeature.isEnabled &&
        rollupFeature.type === 'zkSync' &&
        data.zksync &&
        !config.UI.views.block.hiddenFields?.batch && (
        <>
          <DetailsInfoItem.Label
            hint="Batch number"
            isLoading={ isPlaceholderData }
          >
              Batch
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.zksync.batch_number ? (
              <BatchEntityL2
                isLoading={ isPlaceholderData }
                number={ data.zksync.batch_number }
              />
            ) : (
              <Skeleton isLoaded={ !isPlaceholderData }>Pending</Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }
      { rollupFeature.isEnabled &&
        rollupFeature.type === 'zkSync' &&
        data.zksync &&
        !config.UI.views.block.hiddenFields?.L1_status && (
        <>
          <DetailsInfoItem.Label
            hint="Status is the short interpretation of the batch lifecycle"
            isLoading={ isPlaceholderData }
          >
              Status
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <VerificationSteps
              steps={ ZKSYNC_L2_TX_BATCH_STATUSES }
              currentStep={ data.zksync.status }
              isLoading={ isPlaceholderData }
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.miner && (
        <>
          <DetailsInfoItem.Label
            hint="A block producer who successfully included the block onto the blockchain"
            isLoading={ isPlaceholderData }
          >
            { verificationTitle }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <AddressEntity address={ data.miner } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      { !rollupFeature.isEnabled &&
        !totalReward.isEqualTo(ZERO) &&
        !config.UI.views.block.hiddenFields?.total_reward && (
        <>
          <DetailsInfoItem.Label
            hint={ `For each block, the ${ validatorTitle } is rewarded with a finite amount of ${
              config.chain.currency.symbol || 'native token'
            }
          on top of the fees paid for all transactions in the block` }
            isLoading={ isPlaceholderData }
          >
              Block reward
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value columnGap={ 1 }>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { totalReward.dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </Skeleton>
            { rewardBreakDown }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.rewards
        ?.filter(
          ({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward',
        )
        .map(({ type, reward }) => (
          <React.Fragment key={ type }>
            <DetailsInfoItem.Label
              hint={ `Amount of distributed reward. ${ capitalize(
                validatorTitle,
              ) }s receive a static block reward + Tx fees + uncle fees` }
            >
              { type }
            </DetailsInfoItem.Label>
            <DetailsInfoItem.Value>
              { BigNumber(reward).dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </DetailsInfoItem.Value>
          </React.Fragment>
        )) }

      { arweaveId ? (
        <>
          <DetailsInfoItem.Label
            hint="The Arweave TXID of the WeaveVM block's data"
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
                <Text color={ colorMode === 'dark' ? '#1AFFB1' : '#00B774' } marginLeft="5px" marginRight="12px">Pending </Text>

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
                  marginLeft="3px"
                >
                  <EntityBase.Content text={ isSmallDevice ? truncateArweaveId(arweaveId) : arweaveId }/>
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

      <DetailsInfoItem.Label
        hint="The total gas amount used in the block and its percentage of gas filled in the block"
        isLoading={ isPlaceholderData }
      >
        Gas used
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_used || 0).toFormat() }
        </Skeleton>
        <Utilization
          ml={ 4 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used || 0)
            .dividedBy(BigNumber(data.gas_limit))
            .toNumber() }
          isLoading={ isPlaceholderData }
        />
        { data.gas_target_percentage && (
          <>
            <TextSeparator color={ separatorColor } mx={ 1 }/>
            <GasUsedToTargetRatio
              value={ data.gas_target_percentage }
              isLoading={ isPlaceholderData }
            />
          </>
        ) }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Total gas limit provided by all transactions in the block"
        isLoading={ isPlaceholderData }
      >
        Gas limit
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
      </DetailsInfoItem.Value>

      { data.minimum_gas_price && (
        <>
          <DetailsInfoItem.Label
            hint="The minimum gas price a transaction should have in order to be included in this block"
            isLoading={ isPlaceholderData }
          >
            Minimum gas price
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { BigNumber(data.minimum_gas_price).dividedBy(GWEI).toFormat() }{ ' ' }
              { currencyUnits.gwei }
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.base_fee_per_gas && (
        <>
          <DetailsInfoItem.Label
            hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion"
            isLoading={ isPlaceholderData }
          >
            Base fee per gas
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { isPlaceholderData ? (
              <Skeleton
                isLoaded={ !isPlaceholderData }
                h="20px"
                maxW="380px"
                w="100%"
              />
            ) : (
              <>
                <Text>
                  { BigNumber(data.base_fee_per_gas).dividedBy(WEI).toFixed() }{ ' ' }
                  { currencyUnits.ether }{ ' ' }
                </Text>
                <Text variant="secondary" whiteSpace="pre">
                  { space }(
                  { BigNumber(data.base_fee_per_gas)
                    .dividedBy(WEI_IN_GWEI)
                    .toFixed() }{ ' ' }
                  { currencyUnits.gwei })
                </Text>
              </>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { !config.UI.views.block.hiddenFields?.burnt_fees &&
        !burntFees.isEqualTo(ZERO) && (
        <>
          <DetailsInfoItem.Label
            hint={ `Amount of ${
              config.chain.currency.symbol || 'native token'
            } burned from transactions included in the block.
              Equals Block Base Fee per Gas * Gas Used` }
            isLoading={ isPlaceholderData }
          >
              Network revenue
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">
              <TbCoins size={ 20 } color="#718096"/>
            </Skeleton>
            <Skeleton isLoaded={ !isPlaceholderData } ml={ 2 }>
              { burntFees.dividedBy(WEI).toFixed() } { currencyUnits.ether }
            </Skeleton>
            { !txFees.isEqualTo(ZERO) && (
              <Tooltip label="Network revenue / Txn fees * 100%">
                <Box>
                  <Utilization
                    ml={ 4 }
                    value={ burntFees.dividedBy(txFees).toNumber() }
                    isLoading={ isPlaceholderData }
                  />
                </Box>
              </Tooltip>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <>
          <DetailsInfoItem.Label
            hint="User-defined tips sent to validator for transaction priority/inclusion"
            isLoading={ isPlaceholderData }
          >
            Priority fee / Tip
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isPlaceholderData }>
              { BigNumber(data.priority_fee).dividedBy(WEI).toFixed() }{ ' ' }
              { currencyUnits.ether }
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }

      { /* CUT */ }
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

      { isExpanded && !isPlaceholderData && (
        <>
          <GridItem
            colSpan={{ base: undefined, lg: 2 }}
            mt={{ base: 1, lg: 4 }}
          />

          { rollupFeature.isEnabled &&
            rollupFeature.type === 'zkSync' &&
            data.zksync && (
            <ZkSyncL2TxnBatchHashesInfo
              data={ data.zksync }
              isLoading={ isPlaceholderData }
            />
          ) }

          { !isPlaceholderData && <BlockDetailsBlobInfo data={ data }/> }

          { data.bitcoin_merged_mining_header && (
            <>
              <DetailsInfoItem.Label hint="Merged-mining field: Bitcoin header">
                Bitcoin merged mining header
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value flexWrap="nowrap" alignSelf="flex-start">
                <Box whiteSpace="nowrap" overflow="hidden">
                  <HashStringShortenDynamic
                    hash={ data.bitcoin_merged_mining_header }
                  />
                </Box>
                <CopyToClipboard text={ data.bitcoin_merged_mining_header }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.bitcoin_merged_mining_coinbase_transaction && (
            <>
              <DetailsInfoItem.Label hint="Merged-mining field: Coinbase transaction">
                Bitcoin merged mining coinbase transaction
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <RawDataSnippet
                  data={ data.bitcoin_merged_mining_coinbase_transaction }
                  isLoading={ isPlaceholderData }
                  showCopy={ false }
                  textareaMaxHeight="100px"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.bitcoin_merged_mining_merkle_proof && (
            <>
              <DetailsInfoItem.Label hint="Merged-mining field: Merkle proof">
                Bitcoin merged mining Merkle proof
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>
                <RawDataSnippet
                  data={ data.bitcoin_merged_mining_merkle_proof }
                  isLoading={ isPlaceholderData }
                  showCopy={ false }
                  textareaMaxHeight="100px"
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          { data.hash_for_merged_mining && (
            <>
              <DetailsInfoItem.Label hint="Merged-mining field: Rootstock block header hash">
                Hash for merged mining
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value flexWrap="nowrap" alignSelf="flex-start">
                <Box whiteSpace="nowrap" overflow="hidden">
                  <HashStringShortenDynamic
                    hash={ data.hash_for_merged_mining }
                  />
                </Box>
                <CopyToClipboard text={ data.hash_for_merged_mining }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItem.Label
            hint={ `Block difficulty for ${ validatorTitle }, used to calibrate block generation time` }
          >
            Difficulty
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value overflow="hidden">
            <HashStringShortenDynamic
              hash={ BigNumber(data.difficulty).toFormat() }
            />
          </DetailsInfoItem.Value>

          { data.total_difficulty && (
            <>
              <DetailsInfoItem.Label hint="Total difficulty of the chain until this block">
                Total difficulty
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value overflow="hidden">
                <HashStringShortenDynamic
                  hash={ BigNumber(data.total_difficulty).toFormat() }
                />
              </DetailsInfoItem.Value>
            </>
          ) }

          <DetailsInfoItemDivider/>

          <DetailsInfoItem.Label hint="The SHA256 hash of the block">
            Hash
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value flexWrap="nowrap">
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ data.hash }/>
            </Box>
            <CopyToClipboard text={ data.hash }/>
          </DetailsInfoItem.Value>

          { data.height > 0 && (
            <>
              <DetailsInfoItem.Label hint="The hash of the block from which this block was generated">
                Parent hash
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value flexWrap="nowrap">
                <LinkInternal
                  href={ route({
                    pathname: '/block/[height_or_hash]',
                    query: { height_or_hash: String(data.height - 1) },
                  }) }
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  <HashStringShortenDynamic hash={ data.parent_hash }/>
                </LinkInternal>
                <CopyToClipboard text={ data.parent_hash }/>
              </DetailsInfoItem.Value>
            </>
          ) }

          { !config.UI.views.block.hiddenFields?.nonce && (
            <>
              <DetailsInfoItem.Label hint="Block nonce is a value used during mining to demonstrate proof of work for a block">
                Nonce
              </DetailsInfoItem.Label>
              <DetailsInfoItem.Value>{ data.nonce }</DetailsInfoItem.Value>
            </>
          ) }
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
