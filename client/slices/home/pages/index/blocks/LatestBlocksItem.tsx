// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Grid } from '@chakra-ui/react';
import config from 'client/config';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { Block } from 'client/slices/block/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import getBlockTotalReward from 'client/slices/block/utils/get-block-total-reward';
import { currencyUnits } from 'client/slices/chain/units';
import getChainValidatorTitle from 'client/slices/chain/verification-type/utils/get-chain-validator-title';

import TimeWithTooltip from 'client/shared/date-and-time/TimeWithTooltip';
import SimpleValue from 'client/shared/values/entity/SimpleValue';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { thinsp } from 'toolkit/utils/htmlEntities';

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
          textStyle="md"
          fontWeight={ 500 }
          mr="auto"
        />
        { block.celo?.l1_era_finalized_epoch_number && (
          <Tooltip content={ `Finalized epoch #${ block.celo.l1_era_finalized_epoch_number }` }>
            <SpriteIcon name="checkered_flag" boxSize={ 5 } p="1px" ml={ 2 } isLoading={ isLoading } flexShrink={ 0 }/>
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
            <SimpleValue
              value={ totalReward }
              loading={ isLoading }
              color="text.secondary"
              endElement={ `${ thinsp }${ currencyUnits.ether }` }
            />
          </>
        ) }

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <>
            <Skeleton loading={ isLoading }>{ capitalize(getChainValidatorTitle()) }</Skeleton>
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
