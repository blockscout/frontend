import { Text, Stat, StatHelpText, StatArrow, Flex, Skeleton } from '@chakra-ui/react';
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
  isLoading: boolean;
};

const AddressCoinBalanceListItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(props.block_number) } });
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);
  const timeAgo = useTimeAgoIncrement(props.block_timestamp, props.page === 1);

  return (
    <ListItemMobile rowGap={ 2 } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 600 }>
          { BigNumber(props.value).div(WEI).dp(8).toFormat() } { appConfig.network.currency.symbol }
        </Skeleton>
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
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Block</Skeleton>
        <Skeleton isLoaded={ !props.isLoading }>
          <LinkInternal href={ blockUrl } fontWeight="700">{ props.block_number }</LinkInternal>
        </Skeleton>
      </Flex>
      { props.transaction_hash && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txs</Skeleton>
          <Address maxW="150px" fontWeight="700">
            <AddressLink hash={ props.transaction_hash } type="transaction" isLoading={ props.isLoading }/>
          </Address>
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Age</Skeleton>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary">{ timeAgo }</Skeleton>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressCoinBalanceListItem);
