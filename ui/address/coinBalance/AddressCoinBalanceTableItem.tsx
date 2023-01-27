import { Td, Tr, Text, Stat, StatHelpText, StatArrow } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import { WEI, ZERO } from 'lib/consts';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const blockUrl = link('block', { id: String(props.block_number) });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);
  const timeAgo = useTimeAgoIncrement(props.block_timestamp, props.page === 1);

  return (
    <Tr>
      <Td>
        <LinkInternal href={ blockUrl } fontWeight="700">{ props.block_number }</LinkInternal>
      </Td>
      <Td>
        { props.transaction_hash ?
          (
            <Address maxW="150px" fontWeight="700">
              <AddressLink hash={ props.transaction_hash } type="transaction"/>
            </Address>
          ) :
          <Text fontWeight="700">-</Text>
        }
      </Td>
      <Td>
        <Text variant="secondary">{ timeAgo }</Text>
      </Td>
      <Td isNumeric pr={ 1 }>
        <Text>{ BigNumber(props.value).div(WEI).dp(8).toFormat() }</Text>
      </Td>
      <Td isNumeric display="flex" justifyContent="end">
        <Stat flexGrow="0">
          <StatHelpText display="flex" mb={ 0 } alignItems="center">
            <StatArrow type={ isPositiveDelta ? 'increase' : 'decrease' }/>
            <Text as="span" color={ isPositiveDelta ? 'green.500' : 'red.500' } fontWeight={ 600 }>
              { deltaBn.dp(8).toFormat() }
            </Text>
          </StatHelpText>
        </Stat>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
