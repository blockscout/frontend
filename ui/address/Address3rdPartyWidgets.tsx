import { Grid, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import type { Address3rdPartyWidget } from 'types/views/address';

import { route } from 'nextjs-routes';

import useClientRect from 'lib/hooks/useClientRect';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Link } from 'toolkit/chakra/link';

import Address3rdPartyWidgetCard from './address3rdPartyWidgets/Address3rdPartyWidgetCard';
import useAddress3rdPartyWidgets from './address3rdPartyWidgets/useAddress3rdPartyWidgets';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  addressType: Address3rdPartyWidget['pages'][number];
  showAll?: boolean;
  isLoading?: boolean;
};

const Address3rdPartyWidgets = ({ shouldRender = true, isQueryEnabled = true, addressType, isLoading = false, showAll }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const [ rect, gridRef ] = useClientRect<HTMLDivElement>();

  const addressHash = getQueryParamString(router.query.hash);

  const { items: widgets, configQuery } = useAddress3rdPartyWidgets(addressType, isLoading, isQueryEnabled);

  const minWidgetWidth = 238;
  const maxWidgetWidth = 360;
  const gapWidth = 12;

  const columnsPerRow = useMemo(() => {
    if (!rect?.width) return 0;

    const maxColumns = 4;
    const possibleColumns = Math.floor((rect.width + gapWidth) / (minWidgetWidth + gapWidth));
    const possibleColumnsMax = Math.ceil((rect.width + gapWidth) / (maxWidgetWidth + gapWidth));

    return Math.min(Math.max(1, possibleColumns), Math.max(maxColumns, possibleColumnsMax));
  }, [ rect?.width ]);

  const displayedWidgets = useMemo(() => {
    return showAll ? widgets : widgets.slice(0, Math.max(4, columnsPerRow * 2));
  }, [ widgets, showAll, columnsPerRow ]);

  const shouldShowViewAllLink = !showAll && !isLoading && !configQuery.isPlaceholderData && widgets.length > displayedWidgets.length;

  if (!isMounted || !shouldRender) {
    return null;
  }

  return (
    <Flex w="full" direction="column" alignItems="flex-start" gap={ 3 }>
      <Grid
        ref={ gridRef }
        gap={ 3 }
        templateColumns={ `repeat(${ columnsPerRow || 'auto-fit' }, 1fr)` }
        w="full"
        maxW={{
          sm: widgets.length < 4 ?
            `${ (maxWidgetWidth * widgets.length) + (gapWidth * (widgets.length - 1)) }px` :
            'full',
        }}
      >
        { displayedWidgets.map((name) => (
          <Address3rdPartyWidgetCard
            key={ name }
            name={ name }
            config={ configQuery.data?.[name] }
            address={ addressHash }
            isLoading={ configQuery.isPlaceholderData || isLoading }
          />
        )) }
      </Grid>
      { shouldShowViewAllLink && (
        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'widgets' } }) }
          textStyle="sm"
          ml={ 0.5 }
        >
          View all
        </Link>
      ) }
    </Flex>
  );
};

export default Address3rdPartyWidgets;
