import { Flex, Skeleton, Text, Box, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import capitalize from 'lodash/capitalize';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import flameIcon from 'icons/flame.svg';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { WEI } from 'lib/consts';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  data: Block;
  isLoading?: boolean;
  enableTimeIncrement?: boolean;
}

const BlocksListItem = ({ data, isLoading, enableTimeIncrement }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.tx_fees || 0);

  const separatorColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <ListItemMobile rowGap={ 3 } key={ String(data.height) } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          <Skeleton isLoaded={ !isLoading } display="inline-block">
            <LinkInternal
              fontWeight={ 600 }
              href={ route({
                pathname: '/block/[height_or_hash]',
                query: { height_or_hash: data.type === 'reorg' ? String(data.hash) : String(data.height) },
              }) }
            >
              { data.height }
            </LinkInternal>
          </Skeleton>
        </Flex>
        <BlockTimestamp ts={ data.timestamp } isEnabled={ enableTimeIncrement } isLoading={ isLoading }/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
          <span>{ data.size.toLocaleString() } bytes</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>{ capitalize(getNetworkValidatorTitle()) }</Text>
        <AddressLink type="address" alias={ data.miner.name } hash={ data.miner.hash } truncation="constant" isLoading={ isLoading }/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        { data.tx_count > 0 ? (
          <Skeleton isLoaded={ !isLoading } display="inline-block">
            <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.height), tab: 'txs' } }) }>
              { data.tx_count }
            </LinkInternal>
          </Skeleton>
        ) :
          <Text variant="secondary">{ data.tx_count }</Text>
        }
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex mt={ 2 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary" mr={ 4 }>
            <span>{ BigNumber(data.gas_used || 0).toFormat() }</span>
          </Skeleton>
          <Utilization colorScheme="gray" value={ BigNumber(data.gas_used || 0).div(BigNumber(data.gas_limit)).toNumber() } isLoading={ isLoading }/>
          { data.gas_target_percentage && (
            <>
              <TextSeparator color={ separatorColor } mx={ 1 }/>
              <GasUsedToTargetRatio value={ data.gas_target_percentage } isLoading={ isLoading }/>
            </>
          ) }
        </Flex>
      </Box>
      { !appConfig.L2.isL2Network && (
        <Flex columnGap={ 2 }>
          <Text fontWeight={ 500 }>Reward { appConfig.network.currency.symbol }</Text>
          <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary">
            <span>{ totalReward.toFixed() }</span>
          </Skeleton>
        </Flex>
      ) }
      { !appConfig.L2.isL2Network && (
        <Box>
          <Text fontWeight={ 500 }>Burnt fees</Text>
          <Flex columnGap={ 4 } mt={ 2 }>
            <Flex>
              <Icon as={ flameIcon } boxSize={ 5 } color="gray.500" isLoading={ isLoading }/>
              <Skeleton isLoaded={ !isLoading } display="inline-block" color="text_secondary" ml={ 1 }>
                <span>{ burntFees.div(WEI).toFixed() }</span>
              </Skeleton>
            </Flex>
            <Utilization ml={ 4 } value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </Flex>
        </Box>
      ) }
    </ListItemMobile>
  );
};

export default BlocksListItem;
