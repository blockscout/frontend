import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import TokenSelectDesktop from 'ui/address/tokenSelect/TokenSelectDesktop';
import TokenSelectMobile from 'ui/address/tokenSelect/TokenSelectMobile';
import { calculateUsdValue } from 'ui/address/utils/tokenUtils';
import IconSvg from 'ui/shared/IconSvg';

const OpSuperchainTokenSelect = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const isMobile = useIsMobile();

  const erc20Query = useApiQuery('multichain:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-20' },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const erc721Query = useApiQuery('multichain:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-721' },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const erc1155Query = useApiQuery('multichain:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-1155' },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const erc404Query = useApiQuery('multichain:address_tokens', {
    pathParams: { hash },
    queryParams: { type: 'ERC-404' },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const isPending = erc20Query.isPending || erc721Query.isPending || erc1155Query.isPending || erc404Query.isPending;
  const isError = erc20Query.isError || erc721Query.isError || erc1155Query.isError || erc404Query.isError;
  const hasData = (erc20Query.data?.items.length && erc20Query.data?.items.length > 0) ||
    (erc721Query.data?.items.length && erc721Query.data?.items.length > 0) ||
    (erc1155Query.data?.items.length && erc1155Query.data?.items.length > 0) ||
    (erc404Query.data?.items.length && erc404Query.data?.items.length > 0);

  const handleIconButtonClick = React.useCallback(() => {
    // TODO @tom2drum add mixpanel event
    // mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens show all (icon)' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ ]);

  const formattedData = React.useMemo(() => {
    return {
      'ERC-20': {
        items: erc20Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc20Query.data?.next_page_params),
      },
      'ERC-721': {
        items: erc721Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc721Query.data?.next_page_params),
      },
      'ERC-1155': {
        items: erc1155Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc1155Query.data?.next_page_params),
      },
      'ERC-404': {
        items: erc404Query.data?.items.map(calculateUsdValue) || [],
        isOverflow: Boolean(erc404Query.data?.next_page_params),
      },
    };
  }, [ erc20Query.data, erc721Query.data, erc1155Query.data, erc404Query.data ]);

  if (isPending) {
    return <Box>FOO BAR</Box>;
  }

  if (isError || !hasData) {
    return <Box>0</Box>;
  }

  return (
    <Flex columnGap={ 3 } mt={{ base: 1, lg: 0 }}>
      { isMobile ?
        <TokenSelectMobile data={ formattedData }/> :
        <TokenSelectDesktop data={ formattedData }/>
      }
      <Tooltip content="Show all tokens">
        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'tokens' } }) }
          asChild
          scroll={ false }
        >
          <IconButton
            aria-label="Show all tokens"
            variant="icon_secondary"
            size="md"
            onClick={ handleIconButtonClick }
          >
            <IconSvg name="wallet"/>
          </IconButton>
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default React.memo(OpSuperchainTokenSelect);
