import { Tr, Td, Link, Flex, Box, Icon, Tooltip, Spinner, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import { WEI } from 'lib/consts';
import link from 'lib/link/link';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
  enableTimeIncrement?: boolean;
}

const BlocksTableItem = ({ data, isPending, enableTimeIncrement }: Props) => {
  const { totalReward, burntFees, txFees } = getBlockReward(data);

  return (
    <Tr>
      <Td fontSize="sm">
        <Flex columnGap={ 2 } alignItems="center" mb={ 2 }>
          { isPending && <Spinner size="sm" flexShrink={ 0 }/> }
          <Tooltip isDisabled={ data.type !== 'reorg' } label="Chain reorganizations">
            <Link
              fontWeight={ 600 }
              href={ link('block', { id: String(data.height) }) }
            >
              { data.height }
            </Link>
          </Tooltip>
        </Flex>
        <BlockTimestamp ts={ data.timestamp } isEnabled={ enableTimeIncrement }/>
      </Td>
      <Td fontSize="sm">{ data.size.toLocaleString('en') } bytes</Td>
      <Td fontSize="sm">
        <AddressLink alias={ data.miner.name } hash={ data.miner.hash } truncation="constant" display="inline-flex" maxW="100%"/>
      </Td>
      <Td isNumeric fontSize="sm">{ data.tx_count }</Td>
      <Td fontSize="sm">
        <Box>{ BigNumber(data.gas_used || 0).toFormat() }</Box>
        <Flex mt={ 2 }>
          <Utilization colorScheme="gray" value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() }/>
          <GasUsedToTargetRatio ml={ 2 } value={ data.gas_target_percentage || undefined }/>
        </Flex>
      </Td>
      <Td fontSize="sm">{ totalReward.dividedBy(WEI).toFixed() }</Td>
      <Td fontSize="sm">
        <Flex alignItems="center" columnGap={ 1 }>
          <Icon as={ flameIcon } boxSize={ 5 } color={ useColorModeValue('gray.500', 'inherit') }/>
          { burntFees.dividedBy(WEI).toFixed(8) }
        </Flex>
        <Tooltip label="Burnt fees / Txn fees * 100%">
          <Box w="min-content">
            <Utilization mt={ 2 } value={ burntFees.div(txFees).toNumber() }/>
          </Box>
        </Tooltip>
      </Td>
    </Tr>
  );
};

export default React.memo(BlocksTableItem);
