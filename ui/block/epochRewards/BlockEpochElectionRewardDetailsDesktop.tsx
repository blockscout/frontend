import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { BlockEpoch } from 'types/api/block';
import type { TokenInfo } from 'types/api/token';

import getCurrencyValue from 'lib/getCurrencyValue';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useLazyLoadedList from 'ui/shared/pagination/useLazyLoadedList';

import { formatRewardType, getRewardDetailsTableTitles } from './utils';

interface Props {
  type: keyof BlockEpoch['aggregated_election_rewards'];
  token: TokenInfo;
}

const BlockEpochElectionRewardDetailsDesktop = ({ type, token }: Props) => {
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

  const titles = getRewardDetailsTableTitles(type);

  return (
    <Box
      p={ 4 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="base"
      maxH="360px"
      overflowY="scroll"
      fontWeight={ 400 }
      textStyle="sm"
    >
      { query.data && (
        <Grid
          gridTemplateColumns="min-content min-content min-content"
          rowGap={ 5 }
          columnGap={ 5 }
        >
          <GridItem fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap">
            { titles[0] }
          </GridItem>
          <GridItem fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap" textAlign="right">
            Amount { token.symbol }
          </GridItem>
          <GridItem fontWeight={ 600 } mb={ 1 } whiteSpace="nowrap">
            { titles[1] }
          </GridItem>

          { query.data?.pages
            .map((page) => page.items)
            .flat()
            .map((item, index) => {

              const amount = getCurrencyValue({
                value: item.amount,
                decimals: token.decimals,
              });

              return (
                <React.Fragment key={ index }>
                  <GridItem>
                    <AddressEntity address={ item.account } noIcon truncation="constant"/>
                  </GridItem>
                  <GridItem textAlign="right">
                    { amount.valueStr }
                  </GridItem>
                  <GridItem>
                    <AddressEntity address={ item.associated_account } noIcon truncation="constant"/>
                  </GridItem>
                </React.Fragment>
              );
            }) }
        </Grid>
      ) }

      { query.isFetching && <ContentLoader maxW="200px" mt={ 3 }/> }

      { query.isError && <Text color="text.error" mt={ 3 }>Something went wrong. Unable to load next page.</Text> }

      <Box h="0" w="100px" ref={ cutRef }/>
    </Box>
  );
};

export default React.memo(BlockEpochElectionRewardDetailsDesktop);
