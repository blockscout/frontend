import { Link, Td, Tr, Text, Stat, StatHelpText, StatArrow } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import { WEI, ZERO } from 'lib/consts';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';

type Props = AddressCoinBalanceHistoryItem;

const AddressCoinBalanceTableItem = (props: Props) => {
  const blockUrl = link('block', { id: String(props.block_number) });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <Tr>
      <Td>
        <Link href={ blockUrl } fontWeight="700">{ props.block_number }</Link>
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
        <Text variant="secondary">{ dayjs(props.block_timestamp).fromNow() }</Text>
      </Td>
      <Td isNumeric pr={ 1 }>
        <Text>{ BigNumber(props.value).div(WEI).toFormat() }</Text>
      </Td>
      <Td isNumeric display="flex" justifyContent="end">
        <Stat flexGrow="0">
          <StatHelpText display="flex" mb={ 0 } alignItems="center">
            <StatArrow type={ isPositiveDelta ? 'increase' : 'decrease' }/>
            <Text as="span" color={ isPositiveDelta ? 'green.500' : 'red.500' } fontWeight={ 600 }>
              { deltaBn.toFixed(8) }
            </Text>
          </StatHelpText>
        </Stat>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
