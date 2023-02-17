import { Flex, Spinner, Text, Box, Icon } from '@chakra-ui/react';
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
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
  enableTimeIncrement?: boolean;
}

const BlocksListItem = ({ data, isPending, enableTimeIncrement }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.tx_fees || 0);

  return (
    <ListItemMobile rowGap={ 3 } key={ String(data.height) } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm"/> }
          <LinkInternal
            fontWeight={ 600 }
            href={ route({ pathname: '/block/[height]', query: { height: String(data.height) } }) }
          >
            { data.height }
          </LinkInternal>
        </Flex>
        <BlockTimestamp ts={ data.timestamp } isEnabled={ enableTimeIncrement }/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Text variant="secondary">{ data.size.toLocaleString('en') } bytes</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>{ capitalize(getNetworkValidatorTitle()) }</Text>
        <AddressLink type="address" alias={ data.miner.name } hash={ data.miner.hash } truncation="constant"/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        { data.tx_count > 0 ? (
          <LinkInternal href={ route({ pathname: '/block/[height]', query: { height: String(data.height), tab: 'txs' } }) }>
            { data.tx_count }
          </LinkInternal>
        ) :
          <Text variant="secondary">{ data.tx_count }</Text>
        }
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex columnGap={ 4 } mt={ 2 }>
          <Text variant="secondary">{ BigNumber(data.gas_used || 0).toFormat() }</Text>
          <Utilization colorScheme="gray" value={ BigNumber(data.gas_used || 0).div(BigNumber(data.gas_limit)).toNumber() }/>
          <GasUsedToTargetRatio value={ data.gas_target_percentage || undefined }/>
        </Flex>
      </Box>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Reward { appConfig.network.currency.symbol }</Text>
        <Text variant="secondary">{ totalReward.toFixed() }</Text>
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Burnt fees</Text>
        <Flex columnGap={ 4 } mt={ 2 }>
          <Flex>
            <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
            <Text variant="secondary" ml={ 1 }>{ burntFees.div(WEI).toFixed() }</Text>
          </Flex>
          <Utilization ml={ 4 } value={ burntFees.div(txFees).toNumber() }/>
        </Flex>
      </Box>
    </ListItemMobile>
  );
};

export default BlocksListItem;
