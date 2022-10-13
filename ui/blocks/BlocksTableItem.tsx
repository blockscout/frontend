import { Tr, Td, Text, Link, Flex, Box, Icon, Tooltip, Spinner, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { blocks } from 'data/blocks';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: ArrayElement<typeof blocks>;
  isPending?: boolean;
}

const BlocksTableItem = ({ data, isPending }: Props) => {
  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Tr>
      <Td fontSize="sm">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm" color="blue.500" emptyColor={ spinnerEmptyColor }/> }
          <Link
            fontWeight={ 600 }
            href={ link('block', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <Text variant="secondary" mt={ 2 } fontWeight={ 400 }>{ dayjs(data.timestamp).fromNow() }</Text>
      </Td>
      <Td fontSize="sm">{ data.size.toLocaleString('en') } bytes</Td>
      <Td fontSize="sm">
        <AddressLink alias={ data.miner?.name } hash={ data.miner.address } truncation="constant"/>
      </Td>
      <Td isNumeric fontSize="sm">{ data.transactionsNum }</Td>
      <Td fontSize="sm">
        <Box>{ data.gas_used.toLocaleString('en') }</Box>
        <Flex mt={ 2 }>
          <Utilization colorScheme="gray" value={ data.gas_used / data.gas_limit }/>
          <GasUsedToTargetRatio ml={ 2 } used={ data.gas_used } target={ data.gas_target }/>
        </Flex>
      </Td>
      <Td fontSize="sm">{ (data.reward.static + data.reward.tx_fee - data.burnt_fees).toLocaleString('en', { maximumFractionDigits: 5 }) }</Td>
      <Td fontSize="sm">
        <Flex alignItems="center" columnGap={ 1 }>
          <Icon as={ flameIcon } boxSize={ 5 } color={ useColorModeValue('gray.500', 'inherit') }/>
          { data.burnt_fees.toLocaleString('en', { maximumFractionDigits: 6 }) }
        </Flex>
        <Tooltip label="Burnt fees / Txn fees * 100%">
          <Box>
            <Utilization mt={ 2 } value={ data.burnt_fees / data.reward.tx_fee }/>
          </Box>
        </Tooltip>
      </Td>
    </Tr>
  );
};

export default React.memo(BlocksTableItem);
