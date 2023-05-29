import { Td, Tr, Text, Stat, StatHelpText, StatArrow, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';

import { WEI, ZERO } from 'lib/consts';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import LinkInternal from 'ui/shared/LinkInternal';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(props.block_number) } });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);
  const timeAgo = useTimeAgoIncrement(props.block_timestamp, props.page === 1);

  return (
    <Tr>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } display="inline-block">
          <LinkInternal href={ blockUrl } fontWeight="700">{ props.block_number }</LinkInternal>
        </Skeleton>
      </Td>
      <Td>
        { props.transaction_hash &&
          (
            <Address w="150px" fontWeight="700">
              <AddressLink hash={ props.transaction_hash } type="transaction" isLoading={ props.isLoading }/>
            </Address>
          )
        }
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
      <Td isNumeric pr={ 1 }>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ BigNumber(props.value).div(WEI).dp(8).toFormat() }</span>
        </Skeleton>
      </Td>
      <Td isNumeric display="flex" justifyContent="end">
        <Skeleton isLoaded={ !props.isLoading }>
          <Stat flexGrow="0">
            <StatHelpText display="flex" mb={ 0 } alignItems="center">
              <StatArrow type={ isPositiveDelta ? 'increase' : 'decrease' }/>
              <Text as="span" color={ isPositiveDelta ? 'green.500' : 'red.500' } fontWeight={ 600 }>
                { deltaBn.dp(8).toFormat() }
              </Text>
            </StatHelpText>
          </Stat>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
