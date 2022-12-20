import { Link, Text, Stat, StatHelpText, StatArrow, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import appConfig from 'configs/app/config';
import { WEI, ZERO } from 'lib/consts';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const blockUrl = link('block', { id: String(props.block_number) });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);
  const timeAgo = useTimeAgoIncrement(props.block_timestamp, props.page === 1);

  return (
    <AccountListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <Text fontWeight={ 600 }>{ BigNumber(props.value).div(WEI).toFixed(8) } { appConfig.network.currency.symbol }</Text>
        <Stat flexGrow="0">
          <StatHelpText display="flex" mb={ 0 } alignItems="center">
            <StatArrow type={ isPositiveDelta ? 'increase' : 'decrease' }/>
            <Text as="span" color={ isPositiveDelta ? 'green.500' : 'red.500' } fontWeight={ 600 }>
              { deltaBn.toFixed(8) }
            </Text>
          </StatHelpText>
        </Stat>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Block</Text>
        <Link href={ blockUrl } fontWeight="700">{ props.block_number }</Link>
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
    </AccountListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
