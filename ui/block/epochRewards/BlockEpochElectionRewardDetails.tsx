import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { BlockEpoch } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

function formatRewardType(type: keyof BlockEpoch['aggregated_election_rewards']) {
  return type.replaceAll('_', '-');
}

interface Props {
  type: keyof BlockEpoch['aggregated_election_rewards'];
  token: TokenInfo;
}

const BlockEpochElectionRewardDetails = ({ type, token }: Props) => {
  const router = useRouter();
  const heightOrHash = getQueryParamString(router.query.height_or_hash);

  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const query = useApiQuery('block_election_rewards', {
    pathParams: { height_or_hash: heightOrHash, reward_type: formatRewardType(type) },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  if (query.isPending) {
    return <ContentLoader/>;
  }

  if (query.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Flex flexDir="column" rowGap={ 3 } p={ 4 } bgColor={ bgColor } borderRadius="base" maxH="360px" overflowY="scroll">
      { query.data.items.map((item, index) => {

        const amount = getCurrencyValue({
          value: item.amount,
          decimals: token.decimals,
        });

        return (
          <Flex key={ index } alignItems="center" columnGap={ 2 } fontWeight={ 400 } flexWrap="wrap">
            <AddressEntity address={ item.account } noIcon truncation="constant"/>
            <Box flexShrink={ 0 } color="text_secondary">got</Box>
            <Flex flexShrink={ 0 } columnGap={ 1 } alignItems="center">
              <Box>{ amount.valueStr }</Box>
              <TokenEntity token={ token } noIcon onlySymbol w="auto"/>
            </Flex>
            <Box flexShrink={ 0 } color="text_secondary">on behalf of</Box>
            <AddressEntity address={ item.associated_account } noIcon truncation="constant"/>
          </Flex>
        );
      }) }
    </Flex>
  );
};

export default React.memo(BlockEpochElectionRewardDetails);
