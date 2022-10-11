import { Grid, GridItem, Text, Icon, Link, Box, Tooltip, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { Block } from 'types/api/block';

import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import { WEI, WEI_IN_GWEI, ZERO } from 'lib/consts';
import dayjs from 'lib/date/dayjs';
import type { ErrorType } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';
import useNetwork from 'lib/hooks/useNetwork';
import { space } from 'lib/html-entities';
import useLink from 'lib/link/useLink';
import BlockDetailsSkeleton from 'ui/block/details/BlockDetailsSkeleton';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PrevNext from 'ui/shared/PrevNext';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization';

const BlockDetails = () => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);
  const link = useLink();
  const router = useRouter();
  const network = useNetwork();
  const fetch = useFetch();

  const { data, isLoading, isError, error } = useQuery<unknown, ErrorType<{ status: number }>, Block>(
    [ 'block', router.query.id ],
    async() => await fetch(`/api/blocks/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(Number(router.query.id) + increment);

    const url = link('block_index', { id: nextId });
    router.push(url, undefined);
  }, [ link, router ]);

  if (isLoading) {
    return <BlockDetailsSkeleton/>;
  }

  if (isError) {
    const is404 = error?.error?.status === 404;
    return is404 ? <Alert>This block has not been processed yet.</Alert> : <DataFetchAlert/>;
  }

  const sectionGap = <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>;
  const { totalReward, staticReward, burntFees, txFees } = getBlockReward(data);

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <DetailsInfoItem
        title="Block height"
        hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain."
      >
        { data.height }
        { data.height === 0 && <Text whiteSpace="pre"> - Genesis Block</Text> }
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous block"
          nextLabel="View next block"
          isPrevDisabled={ data.height === 0 }
        />
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Size"
        hint="Size of the block in bytes."
      >
        { data.size.toLocaleString('en') }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        hint="Date & time at which block was produced."
      >
        <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ dayjs(data.timestamp).fromNow() }</Text>
        <TextSeparator/>
        <Text whiteSpace="normal">{ dayjs(data.timestamp).format('LLLL') }</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transactions"
        hint="The number of transactions in the block."
      >
        <Link href={ link('block_txs', { id: router.query.id }) }>
          { data.tx_count } transactions
        </Link>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Mined by"
        hint="A block producer who successfully included the block onto the blockchain."
        columnGap={ 1 }
      >
        <AddressLink hash={ data.miner.hash }/>
        { data.miner.name && <Text>(Miner: { data.miner.name })</Text> }
        { /* api doesn't return the block processing time yet */ }
        { /* <Text>{ dayjs.duration(block.minedIn, 'second').humanize(true) }</Text> */ }
      </DetailsInfoItem>
      { !totalReward.isEqualTo(ZERO) && (
        <DetailsInfoItem
          title="Block reward"
          hint={
            `For each block, the miner is rewarded with a finite amount of ${ network?.currency || 'native token' } 
          on top of the fees paid for all transactions in the block.`
          }
          columnGap={ 1 }
        >
          <Text>{ totalReward.dividedBy(WEI).toFixed() } { network?.currency }</Text>
          { (!txFees.isEqualTo(ZERO) || !burntFees.isEqualTo(ZERO)) && (
            <Text variant="secondary" whiteSpace="break-spaces">(
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
        )</Text>
          ) }
        </DetailsInfoItem>
      ) }

      { sectionGap }

      <DetailsInfoItem
        title="Gas used"
        hint="The total gas amount used in the block and its percentage of gas filled in the block."
      >
        <Text>{ BigNumber(data.gas_used).toFormat() }</Text>
        <Utilization
          ml={ 4 }
          mr={ 5 }
          colorScheme="gray"
          value={ BigNumber(data.gas_used).dividedBy(BigNumber(data.gas_limit)).toNumber() }
        />
        <GasUsedToTargetRatio value={ data.gas_target_percentage || undefined }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas limit"
        hint="Total gas limit provided by all transactions in the block."
      >
        <Text>{ BigNumber(data.gas_limit).toFormat() }</Text>
      </DetailsInfoItem>
      { data.base_fee_per_gas && (
        <DetailsInfoItem
          title="Base fee per gas"
          hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion."
        >
          <Text>{ BigNumber(data.base_fee_per_gas).dividedBy(WEI).toFixed() } { network?.currency } </Text>
          <Text variant="secondary" whiteSpace="pre">
            { space }({ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() } Gwei)
          </Text>
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Burnt fees"
        hint={
          `Amount of ${ network?.currency || 'native token' } burned from transactions included in the block. 
            Equals Block Base Fee per Gas * Gas Used.`
        }
      >
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ burntFees.dividedBy(WEI).toFixed() } { network?.currency }</Text>
        { !txFees.isEqualTo(ZERO) && (
          <Tooltip label="Burnt fees / Txn fees * 100%">
            <Box>
              <Utilization
                ml={ 4 }
                value={ burntFees.dividedBy(txFees).toNumber() }
              />
            </Box>
          </Tooltip>
        ) }
      </DetailsInfoItem>
      { data.priority_fee && (
        <DetailsInfoItem
          title="Priority fee / Tip"
          hint="User-defined tips sent to validator for transaction priority/inclusion."
        >
          { BigNumber(data.priority_fee).dividedBy(WEI).toFixed() } { network?.currency }
        </DetailsInfoItem>
      ) }
      { /* api doesn't support extra data yet */ }
      { /* <DetailsInfoItem
        title="Extra data"
        hint="Any data that can be included by the miner in the block."
      >
        <Text whiteSpace="pre">{ data.extra_data } </Text>
        <Text variant="secondary">(Hex: { data.extra_data })</Text>
      </DetailsInfoItem> */ }

      { /* CUT */ }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="BlockDetails__cutLink">
          <Link
            mt={ 6 }
            display="inline-block"
            fontSize="sm"
            textDecorationLine="underline"
            textDecorationStyle="dashed"
            onClick={ handleCutClick }
          >
            { isExpanded ? 'Hide details' : 'View details' }
          </Link>
        </Element>
      </GridItem>

      { /* ADDITIONAL INFO */ }
      { isExpanded && (
        <>
          { sectionGap }

          <DetailsInfoItem
            title="Difficulty"
            hint="Block difficulty for miner, used to calibrate block generation time."
          >
            { BigNumber(data.difficulty).toFormat() }
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Total difficulty"
            hint="Total difficulty of the chain until this block."
          >
            { BigNumber(data.total_difficulty).toFormat() }
          </DetailsInfoItem>

          { sectionGap }

          <DetailsInfoItem
            title="Hash"
            hint="The SHA256 hash of the block."
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
              hint="The hash of the block from which this block was generated."
              flexWrap="nowrap"
            >
              <AddressLink hash={ data.parent_hash } type="block" id={ String(data.height - 1) }/>
              <CopyToClipboard text={ data.parent_hash }/>
            </DetailsInfoItem>
          ) }
          { /* api doesn't support state root yet */ }
          { /* <DetailsInfoItem
            title="State root"
            hint="The root of the state trie."
          >
            <Text wordBreak="break-all" whiteSpace="break-spaces">{ data.state_root }</Text>
          </DetailsInfoItem> */ }
          <DetailsInfoItem
            title="Nonce"
            hint="Block nonce is a value used during mining to demonstrate proof of work for a block."
          >
            { data.nonce }
          </DetailsInfoItem>
          { data.rewards
            ?.filter(({ type }) => type !== 'Validator Reward' && type !== 'Miner Reward')
            .map(({ type, reward }) => (
              <DetailsInfoItem
                key={ type }
                title={ type }
                hint="Amount of distributed reward. Miners receive a static block reward + Tx fees + uncle fees."
              >
                { BigNumber(reward).dividedBy(WEI).toFixed() } { network?.currency }
              </DetailsInfoItem>
            )) }
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
