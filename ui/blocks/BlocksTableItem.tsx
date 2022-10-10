import { Tr, Td, Text, Link, Flex, Box, Icon, Tooltip, Spinner, useColorModeValue } from '@chakra-ui/react';
import { utils } from 'ethers';
import React from 'react';

import type { Block } from 'types/api/block';

import flameIcon from 'icons/flame.svg';
import getBlockReward from 'lib/block/getBlockReward';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
}

const BlocksTableItem = ({ data, isPending }: Props) => {
  const link = useLink();

  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const { totalReward, burntFees, txFees } = getBlockReward(data);

  return (
    <Tr>
      <Td fontSize="sm">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm" color="blue.500" emptyColor={ spinnerEmptyColor }/> }
          <Link
            fontWeight={ 600 }
            href={ link('block_index', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <Text variant="secondary" mt={ 2 } fontWeight={ 400 }>{ dayjs(data.timestamp).fromNow() }</Text>
      </Td>
      <Td fontSize="sm">{ data.size.toLocaleString('en') } bytes</Td>
      <Td fontSize="sm">
        <AddressLink alias={ data.miner.name } hash={ data.miner.hash } truncation="constant"/>
      </Td>
      <Td isNumeric fontSize="sm">{ data.tx_count }</Td>
      <Td fontSize="sm">
        <Box>{ utils.commify(data.gas_used) }</Box>
        <Flex mt={ 2 }>
          <Utilization
            colorScheme="gray"
            value={ utils.parseUnits(data.gas_used).mul(10_000).div(utils.parseUnits(data.gas_limit)).toNumber() / 10_000 }
          />
          <GasUsedToTargetRatio ml={ 2 } value={ data.gas_target_percentage || undefined }/>
        </Flex>
      </Td>
      <Td fontSize="sm">{ utils.formatUnits(totalReward) }</Td>
      <Td fontSize="sm">
        <Flex alignItems="center" columnGap={ 1 }>
          <Icon as={ flameIcon } boxSize={ 5 } color={ useColorModeValue('gray.500', 'inherit') }/>
          { utils.formatUnits(burntFees) }
        </Flex>
        <Tooltip label="Burnt fees / Txn fees * 100%">
          <Box>
            <Utilization mt={ 2 } value={ burntFees.mul(10_000).div(txFees).toNumber() / 10_000 }/>
          </Box>
        </Tooltip>
      </Td>
    </Tr>
  );
};

export default React.memo(BlocksTableItem);
