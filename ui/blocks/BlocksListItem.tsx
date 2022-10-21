import { Flex, Link, Spinner, Text, Box, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import flameIcon from 'icons/flame.svg';
import { WEI, ZERO } from 'lib/consts';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AddressLink from 'ui/shared/address/AddressLink';
import GasUsedToTargetRatio from 'ui/shared/GasUsedToTargetRatio';
import Utilization from 'ui/shared/Utilization';

interface Props {
  data: Block;
  isPending?: boolean;
}

const BlocksListItem = ({ data, isPending }: Props) => {
  const totalReward = data.rewards
    ?.map(({ reward }) => BigNumber(reward))
    .reduce((result, item) => result.plus(item), ZERO) || ZERO;
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.tx_fees || 0);

  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex justifyContent="space-between" w="100%">
        <Flex columnGap={ 2 } alignItems="center">
          { isPending && <Spinner size="sm"/> }
          <Link
            fontWeight={ 600 }
            href={ link('block', { id: String(data.height) }) }
          >
            { data.height }
          </Link>
        </Flex>
        <Text variant="secondary" fontWeight={ 400 }>{ dayjs(data.timestamp).fromNow() }</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>Size</Text>
        <Text variant="secondary">{ data.size.toLocaleString('en') } bytes</Text>
      </Flex>
      <Flex columnGap={ 2 }>
        <Text fontWeight={ 500 }>{ capitalize(getNetworkValidatorTitle()) }</Text>
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
        <Text fontWeight={ 500 }>Reward { appConfig.network.currency.symbol }</Text>
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
