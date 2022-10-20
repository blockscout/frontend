import { Flex, Link, Spinner, Text, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import { WEI } from 'lib/consts';
import link from 'lib/link/link';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
  enableTimeIncrement?: boolean;
}

const BlocksListItem = ({ data, isPending, enableTimeIncrement }: Props) => {
  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const { totalReward, burntFees, txFees } = getBlockReward(data);

  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm" color="blue.500" emptyColor={ spinnerEmptyColor }/> }
          <Link
            fontWeight={ 600 }
            href={ link('block', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <BlockTimestamp ts={ data.timestamp } isEnabled={ enableTimeIncrement }/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Text variant="secondary">{ data.size.toLocaleString('en') } bytes</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Miner</Text>
        <AddressLink alias={ data.miner.name } hash={ data.miner.hash } truncation="constant"/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        <Text variant="secondary">{ data.tx_count }</Text>
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex columnGap={ 4 }>
          <Text variant="secondary">{ BigNumber(data.gas_used || 0).toFormat() }</Text>
          <Utilization colorScheme="gray" value={ BigNumber(data.gas_used || 0).div(BigNumber(data.gas_limit)).toNumber() }/>
          <GasUsedToTargetRatio value={ data.gas_target_percentage || undefined }/>
        </Flex>
      </Box>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Reward { appConfig.network.currency }</Text>
        <Text variant="secondary">{ totalReward.div(WEI).toFixed() }</Text>
      </Flex>
      <Flex>
        <Text fontWeight={ 500 }>Burnt fees</Text>
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500" ml={ 2 }/>
        <Text variant="secondary" ml={ 1 }>{ burntFees.div(WEI).toFixed() }</Text>
        <Utilization ml={ 4 } value={ burntFees.div(txFees).toNumber() }/>
      </Flex>
    </AccountListItemMobile>
  );
};

export default BlocksListItem;
