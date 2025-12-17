import { Flex } from '@chakra-ui/react';
import { sumBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { FormattedData } from 'ui/address/tokenSelect/types';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import TokenSelectDesktop from 'ui/address/tokenSelect/TokenSelectDesktop';
import TokenSelectMobile from 'ui/address/tokenSelect/TokenSelectMobile';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isLoading: boolean;
  isError: boolean;
  data: FormattedData;
}

const OpSuperchainTokenSelect = ({ isLoading, isError, data }: Props) => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const isMobile = useIsMobile();

  const handleIconButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens show all (icon)' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ ]);

  const hasTokens = sumBy(Object.values(data), ({ items }) => items.length) > 0;
  if (isError || (!isLoading && !hasTokens)) {
    return <Skeleton loading={ isLoading }>0</Skeleton>;
  }

  return (
    <Flex columnGap={ 3 } mt={{ base: 1, lg: 0 }}>
      { isMobile ?
        <TokenSelectMobile data={ data } isLoading={ isLoading }/> :
        <TokenSelectDesktop data={ data } isLoading={ isLoading }/>
      }
      <Tooltip content="Show all tokens">
        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'tokens' } }) }
          asChild
          scroll={ false }
          loading={ isLoading }
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
