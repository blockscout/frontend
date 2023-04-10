import { Text, Stat, StatHelpText, StatArrow, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import appConfig from 'configs/app/config';
import { WEI, ZERO } from 'lib/consts';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height]', query: { height: String(props.block_number) } });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);
  const timeAgo = useTimeAgoIncrement(props.block_timestamp, props.page === 1);

  return (
    <ListItemMobile rowGap={ 2 } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Text fontWeight={ 600 }>{ BigNumber(props.value).div(WEI).dp(8).toFormat() } { appConfig.network.currency.symbol }</Text>
        <Stat flexGrow="0">
          <StatHelpText display="flex" mb={ 0 } alignItems="center">
            <StatArrow type={ isPositiveDelta ? 'increase' : 'decrease' }/>
            <Text as="span" color={ isPositiveDelta ? 'green.500' : 'red.500' } fontWeight={ 600 }>
              { deltaBn.dp(8).toFormat() }
            </Text>
          </StatHelpText>
        </Stat>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Block</Text>
        <LinkInternal href={ blockUrl } fontWeight="700">{ props.block_number }</LinkInternal>
      </Flex>
      { props.transaction_hash && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 } flexShrink={ 0 }>Txs</Text>
          <Address maxW="150px" fontWeight="700">
            <AddressLink hash={ props.transaction_hash } type="transaction"/>
          </Address>
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Age</Text>
        <Text variant="secondary">{ timeAgo }</Text>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
