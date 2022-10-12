import { Grid, GridItem, Text, Icon, Link, Box, Tooltip } from '@chakra-ui/react';
import appConfig from 'configs/app/config';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { block } from 'data/block';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import { space } from 'lib/html-entities';
import useLink from 'lib/link/useLink';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
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

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BlockDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  const sectionGap = <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>;

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden">
      <DetailsInfoItem
        title="Block height"
        hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain."
      >
        { block.height }
        <PrevNext ml={ 6 }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Size"
        hint="Size of the block in bytes."
      >
        { block.size.toLocaleString('en') }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        hint="Date & time at which block was produced."
      >
        <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ dayjs(block.timestamp).fromNow() }</Text>
        <TextSeparator/>
        <Text whiteSpace="normal">{ dayjs(block.timestamp).format('LLLL') }</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transactions"
        hint="The number of transactions in the block."
      >
        <Link href={ link('block', { id: router.query.id }, { tab: 'transactions' }) }>
          { block.transactionsNum } transactions
        </Link>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Mined by"
        hint="A block producer who successfully included the block onto the blockchain."
        columnGap={ 1 }
      >
        <AddressLink hash={ block.miner.address }/>
        { block.miner.name && <Text>(Miner: { block.miner.name })</Text> }
        <Text>{ dayjs.duration(block.minedIn, 'second').humanize(true) }</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Block reward"
        hint={
          `For each block, the miner is rewarded with a finite amount of ${ appConfig.network.currency || 'native token' } 
          on top of the fees paid for all transactions in the block.`
        }
        columnGap={ 1 }
      >
        <Text>{ block.reward.static + block.reward.tx_fee - block.burnt_fees }</Text>
        <Text variant="secondary" whiteSpace="break-spaces">(
          <Tooltip label="Static block reward">
            <span>{ block.reward.static }</span>
          </Tooltip>
          { space }+{ space }
          <Tooltip label="Txn fees">
            <span>{ block.reward.tx_fee }</span>
          </Tooltip>
          { space }-{ space }
          <Tooltip label="Burnt fees">
            <span>{ block.burnt_fees }</span>
          </Tooltip>
        )</Text>
      </DetailsInfoItem>

      { sectionGap }

      <DetailsInfoItem
        title="Gas used"
        hint="The total gas amount used in the block and its percentage of gas filled in the block."
      >
        <Text>{ block.gas_used.toLocaleString('en') }</Text>
        <Utilization ml={ 4 } mr={ 5 } colorScheme="gray" value={ block.gas_used / block.gas_limit }/>
        <GasUsedToTargetRatio used={ block.gas_used } target={ block.gas_target }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas limit"
        hint="Total gas limit provided by all transactions in the block."
      >
        <Text>{ block.gas_limit.toLocaleString('en') }</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Base fee per gas"
        hint="Minimum fee required per unit of gas. Fee adjusts based on network congestion."
      >
        <Text>{ (block.base_fee_per_gas / 10 ** 9).toLocaleString('en', { minimumFractionDigits: 18 }) } { appConfig.network.currency } </Text>
        <Text variant="secondary" whiteSpace="pre">{ space }({ block.base_fee_per_gas.toLocaleString('en', { minimumFractionDigits: 9 }) } Gwei)</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Burnt fees"
        hint={ `Amount of ${ appConfig.network.currency || 'native token' } burned from transactions included in the block. 
          Equals Block Base Fee per Gas * Gas Used.` }
      >
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ block.burnt_fees.toLocaleString('en', { minimumFractionDigits: 18 }) } { appConfig.network.currency }</Text>
        <Tooltip label="Burnt fees / Txn fees * 100%">
          <Box>
            <Utilization ml={ 4 } value={ block.burnt_fees / block.reward.tx_fee }/>
          </Box>
        </Tooltip>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Extra data"
        hint="Any data that can be included by the miner in the block."
      >
        <Text whiteSpace="pre">{ block.data.utf } </Text>
        <Text variant="secondary">(Hex: { block.data.hex })</Text>
      </DetailsInfoItem>

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
            { block.difficulty }
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Total difficulty"
            hint="Total difficulty of the chain until this block."
          >
            { block.totalDifficulty }
          </DetailsInfoItem>

          { sectionGap }

          <DetailsInfoItem
            title="Hash"
            hint="The SHA256 hash of the block."
            flexWrap="nowrap"
          >
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ block.hash }/>
            </Box>
            <CopyToClipboard text={ block.hash }/>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Parent hash"
            hint="The hash of the block from which this block was generated."
            flexWrap="nowrap"
          >
            <AddressLink hash={ block.parent_hash } type="block" id={ String(block.parent_height) }/>
            <CopyToClipboard text={ block.hash }/>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="State root"
            hint="The root of the state trie."
          >
            <Text wordBreak="break-all" whiteSpace="break-spaces">{ block.state_root }</Text>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Nonce"
            hint="Block nonce is a value used during mining to demonstrate proof of work for a block."
          >
            { block.nonce }
          </DetailsInfoItem>
        </>
      ) }
    </Grid>
  );
};

export default BlockDetails;
