import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
// import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import { useTranslation } from 'next-i18next';
type Props = {
  block: Block;
  isLoading?: boolean;
};

const LatestBlocksItem = ({ block, isLoading }: Props) => {
  const totalReward = getBlockTotalReward(block);
  const { t } = useTranslation('common');

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ display: 'none' }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      borderRadius="md"
      border="1px solid"
      borderColor="divider"
      p={6}
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={3}>
        <BlockEntity
          isLoading={isLoading}
          number={block.height}
          tailLength={2}
          fontSize="xl"
          lineHeight={7}
          fontWeight={500}
          mr="auto"
        />
        <BlockTimestamp
          ts={block.timestamp}
          isEnabled={!isLoading}
          isLoading={isLoading}
          fontSize="sm"
          flexShrink={0}
          ml={2}
        />
      </Flex>
      <Grid gridGap={2} templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <Skeleton isLoaded={!isLoading}>{t('txn')}</Skeleton>
        <Skeleton isLoaded={!isLoading} color="text_secondary">
          <span>{block.tx_count}</span>
        </Skeleton>

        {!config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <>
            <Skeleton isLoaded={!isLoading}>{t('reward')}</Skeleton>
            <Skeleton isLoaded={!isLoading} color="text_secondary">
              <span>{totalReward.dp(10).toFixed()}</span>
            </Skeleton>
          </>
        )}

        {!config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <>
            <Skeleton isLoaded={!isLoading} textTransform="capitalize">
              {config.chain.verificationType === 'validation' ? t('validator') : t('miner')}
            </Skeleton>
            <AddressEntity address={block.miner} isLoading={isLoading} noIcon noCopy truncation="constant" />
          </>
        )}
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
