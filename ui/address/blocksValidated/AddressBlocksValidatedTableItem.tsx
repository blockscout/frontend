import { Link, Td, Tr, Text, Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = Block & {
  page: number;
};

const AddressBlocksValidatedTableItem = (props: Props) => {
  const blockUrl = link('block', { id: String(props.height) });
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <Tr>
      <Td>
        <Link href={ blockUrl } fontWeight="700">{ props.height }</Link>
      </Td>
      <Td>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td>
        <Text fontWeight="500">{ props.tx_count }</Text>
      </Td>
      <Td>
        0.00 TH
      </Td>
      <Td>
        <Flex alignItems="center" columnGap={ 2 }>
          <Box flexBasis="80px">{ BigNumber(props.gas_used || 0).toFormat() }</Box>
          <Utilization colorScheme="gray" value={ BigNumber(props.gas_used || 0).dividedBy(BigNumber(props.gas_limit)).toNumber() }/>
        </Flex>
      </Td>
      <Td isNumeric display="flex" justifyContent="end">
        { totalReward }
      </Td>
    </Tr>
  );
};

export default React.memo(AddressBlocksValidatedTableItem);
