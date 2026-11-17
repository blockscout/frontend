// SPDX-License-Identifier: LicenseRef-Blockscout

import { GridItem, Text, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { capitalize } from 'es-toolkit';
import React from 'react';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import type { BlockQuery } from 'src/slices/block/hooks/useBlockQuery';
import getBlockReward from 'src/slices/block/utils/get-block-reward';
import getChainValidatorTitle from 'src/slices/chain/verification-type/utils/get-chain-validator-title';
import GasUsed from 'src/slices/gas/components/GasUsed';

import BlockDetailsBaseFeeCelo from 'src/features/chain-variants/celo/pages/block/BlockDetailsBaseFeeCelo';
import BlockDetailsMergedMiningRootstock from 'src/features/chain-variants/rootstock/pages/block/BlockDetailsMergedMiningRootstock';
import BlockDetailsZilliqaQuorumCertificates from 'src/features/chain-variants/zilliqa/pages/block/BlockDetailsZilliqaQuorumCertificates';
import BlockDetailsZilliqaView from 'src/features/chain-variants/zilliqa/pages/block/BlockDetailsZilliqaView';
import BlockDetailsBlobInfo from 'src/features/data-availability/pages/block/BlockDetailsBlobInfo';
import { useMultichainContext } from 'src/features/multichain/context';
import BlockDetailsArbitrumBatch from 'src/features/rollup/arbitrum/pages/block/BlockDetailsArbitrumBatch';
import BlockDetailsArbitrumL1Txs from 'src/features/rollup/arbitrum/pages/block/BlockDetailsArbitrumL1Txs';
import BlockDetailsArbitrumSendInfo from 'src/features/rollup/arbitrum/pages/block/BlockDetailsArbitrumSendInfo';
import BlockDetailsArbitrumStatus from 'src/features/rollup/arbitrum/pages/block/BlockDetailsArbitrumStatus';
import BlockDetailsOptimismBatch from 'src/features/rollup/optimism/pages/block/BlockDetailsOptimismBatch';
import BlockDetailsZkSyncBatch from 'src/features/rollup/zk-sync/pages/block/BlockDetailsZkSyncBatch';
import BlockDetailsZkSyncBatchHashes from 'src/features/rollup/zk-sync/pages/block/BlockDetailsZkSyncBatchHashes';
import BlockDetailsZkSyncStatus from 'src/features/rollup/zk-sync/pages/block/BlockDetailsZkSyncStatus';

import config from 'src/config';
import PrevNext from 'src/shared/buttons/PrevNext';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { route, routeParams } from 'src/shared/router/routes';
import { useRouter } from 'src/shared/router/useRouter';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import GasPriceValue from 'src/shared/values/entity/GasPriceValue';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import Utilization from 'src/shared/values/utilization/Utilization';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';
import { ZERO } from 'src/toolkit/utils/consts';

import BlockDetailsReward from './BlockDetailsReward';

interface Props {
  query: BlockQuery;
}

const BlockDetails = ({ query }: Props) => {
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);
  const multichainContext = useMultichainContext();

  const { data, isPlaceholderData } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.height + increment);

    router.push(routeParams({ pathname: '/block/[height_or_hash]', query: { height_or_hash: nextId } }, { chain: multichainContext?.chain }));
  }, [ data, multichainContext, router ]);

  if (!data) {
    return null;
  }

  const reward = getBlockReward(data);
  const { burntFees, txFees } = reward;

  const validatorTitle = getChainValidatorTitle();

  const txsNum = (() => {
    const blockTxsNum = (
      <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'txs' } }, multichainContext) }>
        { data.transactions_count } txn{ data.transactions_count === 1 ? '' : 's' }
      </Link>
    );

    const blockBlobTxsNum = (config.features.dataAvailability.isEnabled && data.blob_transactions_count) ? (
      <>
        <span> including </span>
        <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'blob_txs' } }, multichainContext) }>
          { data.blob_transactions_count } blob txn{ data.blob_transactions_count === 1 ? '' : 's' }
        </Link>
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
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }} >
      <DetailedInfo.ItemLabel
        hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain"
        isLoading={ isPlaceholderData }
      >
        { blockTypeLabel } height
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
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
      </DetailedInfo.ItemValue>

      <BlockDetailsArbitrumBatch data={ data } isLoading={ isPlaceholderData }/>
      <BlockDetailsOptimismBatch data={ data } isLoading={ isPlaceholderData }/>

      { typeof data.size === 'number' && (
        <>
          <DetailedInfo.ItemLabel
            hint="Size of the block in bytes"
            isLoading={ isPlaceholderData }
          >
            Size
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isPlaceholderData }>
              { data.size.toLocaleString() }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Date & time at which block was produced."
        isLoading={ isPlaceholderData }
      >
        Timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="The number of transactions in the block"
        isLoading={ isPlaceholderData }
      >
        Transactions
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { txsNum }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { config.features.beaconChain.isEnabled && Boolean(data.withdrawals_count) && (
        <>
          <DetailedInfo.ItemLabel
            hint="The number of beacon withdrawals in the block"
            isLoading={ isPlaceholderData }
          >
            Withdrawals
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isPlaceholderData }>
              <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'withdrawals' } }, multichainContext) }>
                { data.withdrawals_count } withdrawal{ data.withdrawals_count === 1 ? '' : 's' }
              </Link>
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <BlockDetailsZkSyncBatch data={ data } isLoading={ isPlaceholderData }/>
      <BlockDetailsZkSyncStatus data={ data } isLoading={ isPlaceholderData }/>
      <BlockDetailsArbitrumStatus data={ data } isLoading={ isPlaceholderData }/>

      { !config.slices.block.hiddenFields?.miner && (
        <>
          <DetailedInfo.ItemLabel
            hint="A block producer who successfully included the block onto the blockchain"
            isLoading={ isPlaceholderData }
          >
            { capitalize(validatorTitle) }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity
              address={ data.miner }
              isLoading={ isPlaceholderData }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      <BlockDetailsArbitrumL1Txs data={ data } isLoading={ isPlaceholderData }/>

      <BlockDetailsReward reward={ reward } validatorTitle={ validatorTitle } isLoading={ isPlaceholderData }/>

      { data.rewards
        ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
        .map(({ type, reward }) => (
          <React.Fragment key={ type }>
            <DetailedInfo.ItemLabel
              hint={ `Amount of distributed reward. ${ capitalize(validatorTitle) }s receive a static block reward + Tx fees + uncle fees` }
              isLoading={ isPlaceholderData }
            >
              { type }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <NativeCoinValue amount={ reward.toString() } accuracy={ 0 } loading={ isPlaceholderData }/>
            </DetailedInfo.ItemValue>
          </React.Fragment>
        ))
      }

      <BlockDetailsZilliqaView data={ data } isLoading={ isPlaceholderData }/>

      <DetailedInfo.ItemDivider/>

      { data.celo?.base_fee && <BlockDetailsBaseFeeCelo data={ data.celo.base_fee }/> }

      <DetailedInfo.ItemLabel
        hint="The total gas amount used in the block and its percentage of gas filled in the block"
        isLoading={ isPlaceholderData }
      >
        Gas used
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { BigNumber(data.gas_used || 0).toFormat() }
        </Skeleton>
        <GasUsed
          gasUsed={ data.gas_used || undefined }
          gasLimit={ data.gas_limit }
          isLoading={ isPlaceholderData }
          ml={ 4 }
          gasTarget={ data.gas_target_percentage || undefined }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Total gas limit provided by all transactions in the block"
        isLoading={ isPlaceholderData }
      >
        Gas limit
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
      </DetailedInfo.ItemValue>

      { data.minimum_gas_price && (
        <>
          <DetailedInfo.ItemLabel
            hint="The minimum gas price a transaction should have in order to be included in this block"
            isLoading={ isPlaceholderData }
          >
            Minimum gas price
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ data.minimum_gas_price } units="gwei" loading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.base_fee_per_gas && (
        <>
          <DetailedInfo.ItemLabel
            hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion"
            isLoading={ isPlaceholderData }
          >
            Base fee per gas
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <GasPriceValue
              amount={ data.base_fee_per_gas }
              loading={ isPlaceholderData }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { !config.slices.block.hiddenFields?.burnt_fees && !burntFees.isEqualTo(ZERO) && (
        <>
          <DetailedInfo.ItemLabel
            hint={
              `Amount of ${ config.chain.currency.symbol || 'native token' } burned from transactions included in the block.
              Equals Block Base Fee per Gas * Gas Used`
            }
            isLoading={ isPlaceholderData }
          >
            Burnt fees
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue multiRow>
            <NativeCoinValue
              amount={ burntFees.toString() }
              accuracy={ 0 }
              loading={ isPlaceholderData }
              startElement={ <SpriteIcon name="flame" boxSize={ 5 } mr={{ base: 1, lg: 2 }} color="icon.primary" isLoading={ isPlaceholderData }/> }
              mr={ 4 }
            />
            { !txFees.isEqualTo(ZERO) && (
              <Tooltip content="Burnt fees / Txn fees * 100%">
                <Utilization
                  value={ burntFees.dividedBy(txFees).toNumber() }
                  isLoading={ isPlaceholderData }
                />
              </Tooltip>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <>
          <DetailedInfo.ItemLabel
            hint="User-defined tips sent to validator for transaction priority/inclusion"
            isLoading={ isPlaceholderData }
          >
            Priority fee / Tip
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <NativeCoinValue amount={ data.priority_fee.toString() } accuracy={ 0 } loading={ isPlaceholderData }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { /* ADDITIONAL INFO */ }
      <CollapsibleDetails loading={ isPlaceholderData } mt={ 6 } gridColumn={{ base: undefined, lg: '1 / 3' }}>
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <BlockDetailsZkSyncBatchHashes data={ data } isLoading={ isPlaceholderData }/>

        { !isPlaceholderData && <BlockDetailsBlobInfo data={ data }/> }

        <BlockDetailsMergedMiningRootstock data={ data } isLoading={ isPlaceholderData }/>

        { data.difficulty && (
          <>
            <DetailedInfo.ItemLabel
              hint={ `Block difficulty for ${ validatorTitle }, used to calibrate block generation time` }
            >
              Difficulty
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Box overflow="hidden">
                <Truncate value={ BigNumber(data.difficulty).toFormat() }/>
              </Box>
            </DetailedInfo.ItemValue>
          </>
        ) }
        { data.total_difficulty && (
          <>
            <DetailedInfo.ItemLabel
              hint="Total difficulty of the chain until this block"
            >
              Total difficulty
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <Box overflow="hidden">
                <Truncate value={ BigNumber(data.total_difficulty).toFormat() }/>
              </Box>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <DetailedInfo.ItemDivider/>

        <DetailedInfo.ItemLabel
          hint="The SHA256 hash of the block"
        >
          Hash
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue flexWrap="nowrap">
          <Box overflow="hidden" >
            <Truncate value={ data.hash }/>
          </Box>
          <CopyToClipboard text={ data.hash }/>
        </DetailedInfo.ItemValue>

        { data.height > 0 && (
          <>
            <DetailedInfo.ItemLabel
              hint="The hash of the block from which this block was generated"
            >
              Parent hash
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="nowrap">
              <Link
                href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height - 1) } }, multichainContext) }
                overflow="hidden"
                whiteSpace="nowrap"
              >
                <Truncate value={ data.parent_hash }/>
              </Link>
              <CopyToClipboard text={ data.parent_hash }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        <BlockDetailsArbitrumSendInfo data={ data } isLoading={ isPlaceholderData }/>

        { !config.slices.block.hiddenFields?.nonce && (
          <>
            <DetailedInfo.ItemLabel
              hint="Block nonce is a value used during mining to demonstrate proof of work for a block"
            >
              Nonce
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              { data.nonce }
            </DetailedInfo.ItemValue>
          </>
        ) }

        <BlockDetailsZilliqaQuorumCertificates data={ data }/>
      </CollapsibleDetails>

    </DetailedInfo.Container>
  );
};

export default BlockDetails;
