import { Box, Flex, IconButton, Skeleton, Tooltip } from '@chakra-ui/react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import _sumBy from 'lodash/sumBy';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import IconSvg from 'ui/shared/IconSvg';

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

  const addressHash = getQueryParamString(router.query.hash);
  const addressResourceKey = getResourceKey('address', { pathParams: { hash: addressHash } });

  const addressQueryData = queryClient.getQueryData<Address>(addressResourceKey);

  const { data, isError, isPending } = useFetchTokens({ hash: addressQueryData?.hash });
  const tokensResourceKey = getResourceKey('address_tokens', { pathParams: { hash: addressQueryData?.hash }, queryParams: { type: 'ERC-20' } });
  const tokensIsFetching = useIsFetching({ queryKey: tokensResourceKey });

  const handleIconButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens show all (icon)' });
    onClick?.();
  }, [ onClick ]);

  if (isPending) {
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
              icon={ <IconSvg name="wallet" boxSize={ 5 }/> }
              as="a"
              onClick={ handleIconButtonClick }
            />
          </NextLink>
        </Box>
      </Tooltip>
    </Flex>
  );
};

export default React.memo(TokenSelect);
