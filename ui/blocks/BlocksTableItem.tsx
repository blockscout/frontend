import { Tr, Td, Text, Link, Flex, Box, Stat, StatArrow, Icon, Tooltip, Spinner, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { blocks } from 'data/blocks';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import AddressLink from 'ui/shared/address/AddressLink';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: ArrayElement<typeof blocks>;
  isPending?: boolean;
}

const BlocksTableItem = ({ data, isPending }: Props) => {
  const link = useLink();

  const gasUsedPercentage = (data.gas_used / data.gas_target - 1) * 100;
  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

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
        <Text variant="secondary" mt={ 2 } fontWeight={ 400 }>{ dayjs(data.timestamp).locale('en-short').fromNow() }</Text>
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
          <Stat ml={ 2 }>
            <StatArrow type={ gasUsedPercentage >= 0 ? 'increase' : 'decrease' }/>
            <Text as="span" color={ gasUsedPercentage >= 0 ? 'green.500' : 'red.500' } fontWeight={ 600 }>
              { Math.abs(gasUsedPercentage).toLocaleString('en', { maximumFractionDigits: 2 }) } %
            </Text>
          </Stat>
        </Flex>
      </Td>
      <Td fontSize="sm">{ (data.reward.static + data.reward.tx_fee - data.burnt_fees).toLocaleString('en', { maximumFractionDigits: 5 }) }</Td>
      <Td fontSize="sm">
        <Flex alignItems="center" columnGap={ 1 }>
          <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
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
