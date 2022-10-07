import { Grid, GridItem, Text, Icon, Link, Box, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { Block } from 'types/api/block';

import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import dayjs from 'lib/date/dayjs';
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

  const { data, isLoading, isError } = useQuery<unknown, unknown, Block>(
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

  if (isLoading) {
    return <BlockDetailsSkeleton/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
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
        <PrevNext ml={ 6 }/>
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
      <DetailsInfoItem
        title="Block reward"
        hint={
          `For each block, the miner is rewarded with a finite amount of ${ network?.currency || 'native token' } 
          on top of the fees paid for all transactions in the block.`
        }
        columnGap={ 1 }
      >
        <Text>{ utils.formatUnits(totalReward) } { network?.currency }</Text>
        <Text variant="secondary" whiteSpace="break-spaces">(
          <Tooltip label="Static block reward">
            <span>{ utils.formatUnits(staticReward) }</span>
          </Tooltip>
          { space }+{ space }
          <Tooltip label="Txn fees">
            <span>{ utils.formatUnits(txFees) }</span>
          </Tooltip>
          { space }-{ space }
          <Tooltip label="Burnt fees">
            <span>{ utils.formatUnits(burntFees) }</span>
          </Tooltip>
        )</Text>
      </DetailsInfoItem>

      { sectionGap }

      <DetailsInfoItem
        title="Gas used"
        hint="The total gas amount used in the block and its percentage of gas filled in the block."
      >
        <Text>{ utils.commify(data.gas_used) }</Text>
        <Utilization
          ml={ 4 }
          mr={ 5 }
          colorScheme="gray"
          value={ utils.parseUnits(data.gas_used).mul(10_000).div(utils.parseUnits(data.gas_limit)).toNumber() / 10_000 }
        />
        <GasUsedToTargetRatio value={ data.gas_target_percentage || undefined }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas limit"
        hint="Total gas limit provided by all transactions in the block."
      >
        <Text>{ utils.commify(data.gas_limit) }</Text>
      </DetailsInfoItem>
      { data.base_fee_per_gas && (
        <DetailsInfoItem
          title="Base fee per gas"
          hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion."
        >
          <Text>{ utils.formatUnits(utils.parseUnits(String(data.base_fee_per_gas), 'wei')) } { network?.currency } </Text>
          <Text variant="secondary" whiteSpace="pre">
            { space }({ utils.formatUnits(utils.parseUnits(String(data.base_fee_per_gas), 'wei'), 'gwei') } Gwei)
          </Text>
        </DetailsInfoItem>
      ) }
      { data.burnt_fees && (
        <DetailsInfoItem
          title="Burnt fees"
          hint={
            `Amount of ${ network?.currency || 'native token' } burned from transactions included in the block. 
            Equals Block Base Fee per Gas * Gas Used.`
          }
        >
          <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
          <Text ml={ 1 }>{ utils.formatUnits(burntFees) } { network?.currency }</Text>
          { data.tx_fees && (
            <Tooltip label="Burnt fees / Txn fees * 100%">
              <Box>
                <Utilization
                  ml={ 4 }
                  value={ burntFees.mul(10_000).div(txFees).toNumber() / 10_000 }
                />
              </Box>
            </Tooltip>
          ) }
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
            { utils.commify(data.difficulty) }
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Total difficulty"
            hint="Total difficulty of the chain until this block."
          >
            { utils.commify(data.total_difficulty) }
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
          <DetailsInfoItem
            title="Parent hash"
            hint="The hash of the block from which this block was generated."
            flexWrap="nowrap"
          >
            <AddressLink hash={ data.parent_hash } type="block" id={ String(data.height - 1) }/>
            <CopyToClipboard text={ data.parent_hash }/>
          </DetailsInfoItem>
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
          { data.rewards?.map(({ type, reward }) => (
            <DetailsInfoItem
              key={ type }
              title={ type }
              hint="Amount of distributed reward. Miners receive a static block reward + Tx fees + uncle fees."
            >
              { utils.formatUnits(utils.parseUnits(String(reward), 'wei')) } { network?.currency }
            </DetailsInfoItem>
          )) }
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
