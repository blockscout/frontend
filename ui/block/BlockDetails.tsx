import { Grid, GridItem, Text, Icon, Link, Box, Tooltip, useColorModeValue, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import type { ResourceError } from 'lib/api/resources';
import getBlockReward from 'lib/block/getBlockReward';
import { WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import dayjs from 'lib/date/dayjs';
import { space } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  query: UseQueryResult<Block, ResourceError>;
}

const BlockDetails = ({ query }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height);

  const separatorColor = useColorModeValue('gray.200', 'gray.700');

  const { data, isPlaceholderData, isError, error } = query;

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

    router.push({ pathname: '/block/[height]', query: { height: nextId } }, undefined);
  }, [ data, router ]);

  if (isError) {
    if (error?.status === 404) {
      throw Error('Block not found', { cause: error as unknown as Error });
    }

    if (error?.status === 422) {
      throw Error('Invalid block number', { cause: error as unknown as Error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const sectionGap = (
    <GridItem
      colSpan={{ base: undefined, lg: 2 }}
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="divider"
    />
  );
  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  const validatorTitle = getNetworkValidatorTitle();

  const rewardBreakDown = (() => {
    if (appConfig.L2.isL2Network || totalReward.isEqualTo(ZERO) || txFees.isEqualTo(ZERO) || burntFees.isEqualTo(ZERO)) {
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

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <DetailsInfoItem
        title={ `${ data.type === 'reorg' ? 'Reorg' : 'Block' } height` }
        hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain"
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
        title="Size"
        hint="Size of the block in bytes"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.size.toLocaleString() }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        hint="Date & time at which block was produced."
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData } boxSize={ 5 } borderRadius="full">
          <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
        </Skeleton>
        <Skeleton isLoaded={ !isPlaceholderData } ml={ 1 }>
          { dayjs(data.timestamp).fromNow() }
        </Skeleton>
        <TextSeparator/>
        <Skeleton isLoaded={ !isPlaceholderData } whiteSpace="normal">
          { dayjs(data.timestamp).format('LLLL') }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transactions"
        hint="The number of transactions in the block"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/block/[height]', query: { height: heightOrHash, tab: 'txs' } }) }>
            { data.tx_count } transaction{ data.tx_count === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ appConfig.network.verificationType === 'validation' ? 'Validated by' : 'Mined by' }
        hint="A block producer who successfully included the block onto the blockchain"
        columnGap={ 1 }
        isLoading={ isPlaceholderData }
      >
        <AddressLink type="address" hash={ data.miner.hash } isLoading={ isPlaceholderData }/>
        { data.miner.name && <Text>{ `(${ capitalize(validatorTitle) }: ${ data.miner.name })` }</Text> }
        { /* api doesn't return the block processing time yet */ }
        { /* <Text>{ dayjs.duration(block.minedIn, 'second').humanize(true) }</Text> */ }
      </DetailsInfoItem>
      { !appConfig.L2.isL2Network && !totalReward.isEqualTo(ZERO) && (
        <DetailsInfoItem
          title="Block reward"
          hint={
            `For each block, the ${ validatorTitle } is rewarded with a finite amount of ${ appConfig.network.currency.symbol || 'native token' } 
          on top of the fees paid for all transactions in the block`
          }
          columnGap={ 1 }
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            { totalReward.dividedBy(WEI).toFixed() } { appConfig.network.currency.symbol }
          </Skeleton>
          { rewardBreakDown }
        </DetailsInfoItem>
      ) }
      { data.rewards
        ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
        .map(({ type, reward }) => (
          <DetailsInfoItem
            key={ type }
            title={ type }
            // is this text correct for validators?
            hint={ `Amount of distributed reward. ${ capitalize(validatorTitle) }s receive a static block reward + Tx fees + uncle fees` }
          >
            { BigNumber(reward).dividedBy(WEI).toFixed() } { appConfig.network.currency.symbol }
          </DetailsInfoItem>
        ))
      }

      { sectionGap }

      <DetailsInfoItem
        title="Gas used"
        hint="The total gas amount used in the block and its percentage of gas filled in the block"
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
        title="Gas limit"
        hint="Total gas limit provided by all transactions in the block"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { BigNumber(data.gas_limit).toFormat() }
        </Skeleton>
      </DetailsInfoItem>
      { data.base_fee_per_gas && (
        <DetailsInfoItem
          title="Base fee per gas"
          hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion"
          isLoading={ isPlaceholderData }
        >
          { isPlaceholderData ? (
            <Skeleton isLoaded={ !isPlaceholderData } h="20px" maxW="380px" w="100%"/>
          ) : (
            <>
              <Text>{ BigNumber(data.base_fee_per_gas).dividedBy(WEI).toFixed() } { appConfig.network.currency.symbol } </Text>
              <Text variant="secondary" whiteSpace="pre">
                { space }({ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } Gwei)
              </Text>
            </>
          ) }
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Burnt fees"
        hint={
          `Amount of ${ appConfig.network.currency.symbol || 'native token' } burned from transactions included in the block.

          Equals Block Base Fee per Gas * Gas Used`
        }
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData } boxSize={ 5 }>
          <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
        </Skeleton>
        <Skeleton isLoaded={ !isPlaceholderData } ml={ 1 }>
          { burntFees.dividedBy(WEI).toFixed() } { appConfig.network.currency.symbol }
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
      { data.priority_fee !== null && BigNumber(data.priority_fee).gt(ZERO) && (
        <DetailsInfoItem
          title="Priority fee / Tip"
          hint="User-defined tips sent to validator for transaction priority/inclusion"
          isLoading={ isPlaceholderData }
        >
          <Skeleton isLoaded={ !isPlaceholderData }>
            { BigNumber(data.priority_fee).dividedBy(WEI).toFixed() } { appConfig.network.currency.symbol }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      { /* api doesn't support extra data yet */ }
      { /* <DetailsInfoItem
        title="Extra data"
        hint={ `Any data that can be included by the ${ validatorTitle } in the block` }
      >
        <Text whiteSpace="pre">{ data.extra_data } </Text>
        <Text variant="secondary">(Hex: { data.extra_data })</Text>
      </DetailsInfoItem> */ }

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

      { /* ADDITIONAL INFO */ }
      { isExpanded && !isPlaceholderData && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

          <DetailsInfoItem
            title="Difficulty"
            hint={ `Block difficulty for ${ validatorTitle }, used to calibrate block generation time` }
          >
            <Box whiteSpace="nowrap" overflow="hidden">
              <HashStringShortenDynamic hash={ BigNumber(data.difficulty).toFormat() }/>
            </Box>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Total difficulty"
            hint="Total difficulty of the chain until this block"
          >
            <Box whiteSpace="nowrap" overflow="hidden">
              <HashStringShortenDynamic hash={ BigNumber(data.total_difficulty).toFormat() }/>
            </Box>
          </DetailsInfoItem>

          { sectionGap }

          <DetailsInfoItem
            title="Hash"
            hint="The SHA256 hash of the block"
            flexWrap="nowrap"
          >
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ data.hash }/>
            </Box>
            <CopyToClipboard text={ data.hash }/>
          </DetailsInfoItem>
          { data.height > 0 && (
            <DetailsInfoItem
              title="Parent hash"
              hint="The hash of the block from which this block was generated"
              flexWrap="nowrap"
            >
              <AddressLink hash={ data.parent_hash } type="block" blockHeight={ String(data.height - 1) }/>
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
          <DetailsInfoItem
            title="Nonce"
            hint="Block nonce is a value used during mining to demonstrate proof of work for a block"
          >
            { data.nonce }
          </DetailsInfoItem>
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
