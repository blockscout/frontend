import { Box, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { BlockEpoch } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import getCurrencyValue from 'lib/getCurrencyValue';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';

import { formatRewardType } from './utils';

interface Props {
  type: keyof BlockEpoch['aggregated_election_rewards'];
  token: TokenInfo;
}

const BlockEpochElectionRewardDetailsMobile = ({ type, token }: Props) => {
  const rootRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);

  const { cutRef, query } = useLazyLoadedList({
    rootRef,
    resourceName: 'general:block_election_rewards',
    pathParams: { height_or_hash: heightOrHash, reward_type: formatRewardType(type) },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  return (
    <Flex
      flexDir="column"
      rowGap={ 3 }
      p={ 4 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="base"
      maxH="360px"
      overflowY="scroll"
    >

      { query.data?.pages
        .map((page) => page.items)
        .flat()
        .map((item, index) => {

          const amount = getCurrencyValue({
            value: item.amount,
            decimals: token.decimals,
          });

          return (
            <Flex key={ index } flexDir="column" alignItems="flex-start" rowGap={ 1 } fontWeight={ 400 }>
              <AddressEntity address={ item.account } noIcon w="100%"/>
              <Flex columnGap={ 1 } alignItems="center">
                <Box flexShrink={ 0 } color="text.secondary">got</Box>
                <Box>{ amount.valueStr }</Box>
                <TokenEntity token={ token } noIcon onlySymbol w="auto"/>
              </Flex>
              <Flex columnGap={ 1 } alignItems="center" w="100%">
                <Box flexShrink={ 0 } color="text.secondary">on behalf of</Box>
                <AddressEntity address={ item.associated_account } noIcon/>
              </Flex>
            </Flex>
          );
        }) }

      { query.isFetching && <ContentLoader maxW="200px" mt={ 3 }/> }

      { query.isError && <Text color="text.error" mt={ 3 }>Something went wrong. Unable to load next page.</Text> }

      <Box h="0" w="100px" mt="-12px" ref={ cutRef }/>
    </Flex>
  );
};

export default React.memo(BlockEpochElectionRewardDetailsMobile);
