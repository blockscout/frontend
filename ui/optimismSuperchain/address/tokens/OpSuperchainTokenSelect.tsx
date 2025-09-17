import { Box, Flex } from '@chakra-ui/react';
import { sumBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import TokenSelectDesktop from 'ui/address/tokenSelect/TokenSelectDesktop';
import TokenSelectMobile from 'ui/address/tokenSelect/TokenSelectMobile';
import IconSvg from 'ui/shared/IconSvg';

import useFetchTokens from './useFetchTokens';

const OpSuperchainTokenSelect = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const isMobile = useIsMobile();

  const { data, isError, isPending } = useFetchTokens({ hash });

  const handleIconButtonClick = React.useCallback(() => {
    // TODO @tom2drum add mixpanel event
    // mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens show all (icon)' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ ]);

  const hasTokens = sumBy(Object.values(data), ({ items }) => items.length) > 0;
  if (isError || (!isPending && !hasTokens)) {
    return <Box>0</Box>;
  }

  return (
    <Flex columnGap={ 3 } mt={{ base: 1, lg: 0 }}>
      { isMobile ?
        <TokenSelectMobile data={ data } isLoading={ isPending }/> :
        <TokenSelectDesktop data={ data } isLoading={ isPending }/>
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
            loadingSkeleton={ isPending }
          >
            <IconSvg name="wallet"/>
          </IconButton>
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default React.memo(OpSuperchainTokenSelect);
