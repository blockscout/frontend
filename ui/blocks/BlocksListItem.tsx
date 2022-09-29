import { Flex, Link, Spinner, Text, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { blocks } from 'data/blocks';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import useNetwork from 'lib/hooks/useNetwork';
import useLink from 'lib/link/useLink';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: ArrayElement<typeof blocks>;
  isPending?: boolean;
}

const BlocksListItem = ({ data, isPending }: Props) => {
  const spinnerEmptyColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const link = useLink();
  const network = useNetwork();

  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm" color="blue.500" emptyColor={ spinnerEmptyColor }/> }
          <Link
            fontWeight={ 600 }
            href={ link('block_index', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <Text variant="secondary"fontWeight={ 400 }>{ dayjs(data.timestamp).locale('en-short').fromNow() }</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Text variant="secondary">{ data.size.toLocaleString('en') } bytes</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Miner</Text>
        <AddressLink alias={ data.miner?.name } hash={ data.miner.address } truncation="constant"/>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Txn</Text>
        <Text variant="secondary">{ data.transactionsNum }</Text>
      </Flex>
      <Box>
        <Text fontWeight={ 500 }>Gas used</Text>
        <Flex columnGap={ 4 }>
          <Text variant="secondary">{ data.gas_used.toLocaleString('en') }</Text>
          <Utilization colorScheme="gray" value={ data.gas_used / data.gas_limit }/>
          <GasUsedToTargetRatio used={ data.gas_used } target={ data.gas_target }/>
        </Flex>
      </Box>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Reward { network?.currency }</Text>
        <Text variant="secondary">{ (data.reward.static + data.reward.tx_fee - data.burnt_fees).toLocaleString('en', { maximumFractionDigits: 5 }) }</Text>
      </Flex>
      <Flex>
        <Text fontWeight={ 500 }>Burnt fees</Text>
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500" ml={ 2 }/>
        <Text variant="secondary" ml={ 1 }>{ data.burnt_fees.toLocaleString('en', { maximumFractionDigits: 6 }) }</Text>
        <Utilization ml={ 4 } value={ data.burnt_fees / data.reward.tx_fee }/>
      </Flex>
    </AccountListItemMobile>
  );
};

export default BlocksListItem;
