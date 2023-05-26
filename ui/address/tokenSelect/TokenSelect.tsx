import { Box, Flex, Icon, IconButton, Skeleton, Tooltip } from '@chakra-ui/react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import _sumBy from 'lodash/sumBy';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address } from 'types/api/address';

import walletIcon from 'icons/wallet.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import useFetchTokens from '../utils/useFetchTokens';
import TokenSelectDesktop from './TokenSelectDesktop';
import TokenSelectMobile from './TokenSelectMobile';

interface Props {
  onClick?: () => void;
}

const TokenSelect = ({ onClick }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [ blockNumber, setBlockNumber ] = React.useState<number>();

  const addressHash = getQueryParamString(router.query.hash);
  const addressResourceKey = getResourceKey('address', { pathParams: { hash: addressHash } });

  const addressQueryData = queryClient.getQueryData<Address>(addressResourceKey);

  const { data, isError, isLoading, refetch } = useFetchTokens({ hash: addressQueryData?.hash });
  const tokensResourceKey = getResourceKey('address_tokens', { pathParams: { hash: addressQueryData?.hash }, queryParams: { type: 'ERC-20' } });
  const tokensIsFetching = useIsFetching({ queryKey: tokensResourceKey });

  const handleTokenBalanceMessage: SocketMessage.AddressTokenBalance['handler'] = React.useCallback((payload) => {
    if (payload.block_number !== blockNumber) {
      refetch();
      setBlockNumber(payload.block_number);
    }
  }, [ blockNumber, refetch ]);
  const handleCoinBalanceMessage: SocketMessage.AddressCoinBalance['handler'] = React.useCallback((payload) => {
    if (payload.coin_balance.block_number !== blockNumber) {
      refetch();
      setBlockNumber(payload.coin_balance.block_number);
    }
  }, [ blockNumber, refetch ]);

  const channel = useSocketChannel({
    topic: `addresses:${ addressQueryData?.hash.toLowerCase() }`,
    isDisabled: !addressQueryData,
  });
  useSocketMessage({
    channel,
    event: 'coin_balance',
    handler: handleCoinBalanceMessage,
  });
  useSocketMessage({
    channel,
    event: 'token_balance',
    handler: handleTokenBalanceMessage,
  });

  if (isLoading) {
    return (
      <Flex columnGap={ 3 }>
        <Skeleton h={ 8 } w="150px" borderRadius="base"/>
        <Skeleton h={ 8 } w={ 9 } borderRadius="base"/>
      </Flex>
    );
  }

  const hasTokens = _sumBy(Object.values(data), ({ items }) => items.length) > 0;
  if (isError || !hasTokens) {
    return <Box py="6px">0</Box>;
  }

  return (
    <Flex columnGap={ 3 } mt={{ base: '6px', lg: 0 }}>
      { isMobile ?
        <TokenSelectMobile data={ data } isLoading={ tokensIsFetching === 1 }/> :
        <TokenSelectDesktop data={ data } isLoading={ tokensIsFetching === 1 }/>
      }
      <Tooltip label="Show all tokens">
        <Box>
          <NextLink href={{ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'tokens' } }} passHref legacyBehavior>
            <IconButton
              aria-label="Show all tokens"
              variant="outline"
              size="sm"
              pl="6px"
              pr="6px"
              icon={ <Icon as={ walletIcon } boxSize={ 5 }/> }
              as="a"
              onClick={ onClick }
            />
          </NextLink>
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default React.memo(TokenSelect);
