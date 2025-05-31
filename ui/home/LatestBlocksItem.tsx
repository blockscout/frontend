import { Box, Flex, Grid } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  block: Block;
  isLoading?: boolean;
  animation?: string;
};

const LatestBlocksItem = ({ block, isLoading, animation }: Props) => {
  const totalReward = getBlockTotalReward(block);
  return (
    <Box
      animation={ animation }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      p={ 3 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          textStyle="xl"
          fontWeight={ 500 }
          mr="auto"
        />
        { block.celo?.is_epoch_block && (
          <Tooltip content={ `Finalized epoch #${ block.celo.epoch_number }` }>
            <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" ml={ 2 } isLoading={ isLoading } flexShrink={ 0 }/>
          </Tooltip>
        ) }
        <TimeWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
          textStyle="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" textStyle="sm">
        <Skeleton loading={ isLoading }>Txn</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary"><span>{ block.transactions_count }</span></Skeleton>

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <>
            <Skeleton loading={ isLoading }>Reward</Skeleton>
            <Skeleton loading={ isLoading } color="text.secondary"><span>{ totalReward.dp(10).toFixed() }</span></Skeleton>
          </>
        ) }

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <>
            <Skeleton loading={ isLoading } textTransform="capitalize">{ getNetworkValidatorTitle() }</Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
            />
          </>
        ) }
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
