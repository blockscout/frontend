import { Box, Flex, Icon, IconButton, Skeleton, Tooltip } from '@chakra-ui/react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address } from 'types/api/address';

import walletIcon from 'icons/wallet.svg';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

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

  const addressHash = router.query.id?.toString();
  const addressResourceKey = getResourceKey('address', { pathParams: { id: addressHash } });

  const addressQueryData = queryClient.getQueryData<Address>(addressResourceKey);

  const { data, isError, isLoading, refetch } = useApiQuery('address_token_balances', {
    pathParams: { id: addressQueryData?.hash },
    queryOptions: { enabled: Boolean(addressQueryData) },
  });
  const balancesResourceKey = getResourceKey('address_token_balances', { pathParams: { id: addressQueryData?.hash } });
  const balancesIsFetching = useIsFetching({ queryKey: balancesResourceKey });

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
    return <Skeleton h={ 8 } w="160px"/>;
  }

  if (isError || data.length === 0) {
    return <Box py="6px">0</Box>;
  }

  return (
    <Flex columnGap={ 3 } mt={{ base: '6px', lg: 0 }}>
      { isMobile ?
        <TokenSelectMobile data={ data } isLoading={ balancesIsFetching === 1 }/> :
        <TokenSelectDesktop data={ data } isLoading={ balancesIsFetching === 1 }/>
      }
      <Tooltip label="Show all tokens">
        <Box>
          <NextLink href={ link('address_index', { id: addressHash }, { tab: 'tokens' }) } passHref>
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
