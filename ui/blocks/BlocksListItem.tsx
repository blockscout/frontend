import { Flex, Text, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { WEI } from 'lib/consts';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import Utilization from 'ui/shared/Utilization/Utilization';

import { getBaseFeeValue } from './utils';

interface Props {
  data: Block;
  isLoading?: boolean;
  enableTimeIncrement?: boolean;
  animation?: string;
}

const isRollup = config.features.rollup.isEnabled;

const BlocksListItem = ({ data, isLoading, enableTimeIncrement, animation }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.transaction_fees || 0);
  const baseFeeValue = getBaseFeeValue(data.base_fee_per_gas);

  return (
    <ListItemMobile rowGap={ 3 } key={ String(data.height) } animation={ animation }>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          <BlockEntity
            isLoading={ isLoading }
            number={ data.height }
            hash={ data.type !== 'block' ? data.hash : undefined }
            noIcon
            fontWeight={ 600 }
          />
          { data.celo?.is_epoch_block && (
            <Tooltip content={ `Finalized epoch #${ data.celo.epoch_number }` } disabled={ isLoading }>
              <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" isLoading={ isLoading } flexShrink={ 0 }/>
            </Tooltip>
          ) }
        </Flex>
        <TimeAgoWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight={ 400 }
          display="inline-block"
        />
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">
          <span>{ data.size.toLocaleString() } bytes</span>
        </Skeleton>
      </Flex>
      { !config.UI.views.block.hiddenFields?.miner && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 }>{ capitalize(getNetworkValidatorTitle()) }</Text>
          <AddressEntity
            address={ data.miner }
            isLoading={ isLoading }
            truncation="constant"
          />
        </Flex>
      ) }
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        { data.transaction_count > 0 ? (
          <Skeleton loading={ isLoading } display="inline-block">
            <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height), tab: 'txs' } }) }>
              { data.transaction_count }
            </Link>
          </Skeleton>
        ) :
          <Text color="text.secondary">{ data.transaction_count }</Text>
        }
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex mt={ 2 }>
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary" mr={ 4 }>
            <span>{ BigNumber(data.gas_used || 0).toFormat() }</span>
          </Skeleton>
          <BlockGasUsed
            gasUsed={ data.gas_used || undefined }
            gasLimit={ data.gas_limit }
            isLoading={ isLoading }
            gasTarget={ data.gas_target_percentage || undefined }
          />
        </Flex>
      </Box>
      { !isRollup && !config.UI.views.block.hiddenFields?.total_reward && (
        <Flex columnGap={ 2 }>
          <Text fontWeight={ 500 }>Reward { currencyUnits.ether }</Text>
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">
            <span>{ totalReward.toFixed() }</span>
          </Skeleton>
        </Flex>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees && (
        <Box>
          <Text fontWeight={ 500 }>Burnt fees</Text>
          <Flex columnGap={ 4 } mt={ 2 }>
            <Flex>
              <IconSvg name="flame" boxSize={ 5 } color="gray.500" isLoading={ isLoading }/>
              <Skeleton loading={ isLoading } display="inline-block" color="text.secondary" ml={ 2 }>
                <span>{ burntFees.div(WEI).toFixed() }</span>
              </Skeleton>
            </Flex>
            <Utilization ml={ 4 } value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </Flex>
        </Box>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.base_fee && baseFeeValue && (
        <Flex columnGap={ 2 }>
          <Text fontWeight={ 500 }>Base fee</Text>
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary">
            <span>{ baseFeeValue }</span>
          </Skeleton>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default BlocksListItem;
