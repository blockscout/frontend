import { Grid, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import type { AddressWidget } from 'types/client/addressWidget';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useClientRect from 'lib/hooks/useClientRect';
import useApiFetch from 'lib/hooks/useFetch';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { WIDGET_CONFIG } from 'stubs/addressWidgets';
import { Link } from 'toolkit/chakra/link';

import AddressWidgetCard from './widgets/AddressWidgetCard';

const feature = config.features.addressWidgets;
const widgets = (feature.isEnabled && feature.widgets) || [];
const configUrl = (feature.isEnabled && feature.configUrl) || '';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
  showAll?: boolean;
};

const AddressWidgets = ({ shouldRender = true, isQueryEnabled = true, showAll }: Props) => {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const isMounted = useIsMounted();
  const [ rect, gridRef ] = useClientRect<HTMLDivElement>();

  const addressHash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData } = useQuery<unknown, ResourceError<unknown>, Record<string, AddressWidget>>({
    queryKey: [ 'address-widgets' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'address-widgets' }),
    placeholderData: { widget: WIDGET_CONFIG },
    staleTime: Infinity,
    enabled: Boolean(configUrl) && isQueryEnabled,
  });

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
  }, [ showAll, columnsPerRow ]);

  const shouldShowViewAllLink = !showAll && widgets.length > displayedWidgets.length;

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
          sm: widgets.length < 4 ? `${ (maxWidgetWidth * widgets.length) + (gapWidth * (widgets.length - 1)) }px` : 'full',
        }}
      >
        { displayedWidgets.map((name) => (
          <AddressWidgetCard
            key={ name }
            name={ name }
            config={ isPlaceholderData ? WIDGET_CONFIG : data?.[name] }
            address={ addressHash }
            isConfigLoading={ isPlaceholderData }
          />
        )) }
      </Grid>
      { shouldShowViewAllLink && (
        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'widgets' } }) }
          textStyle="sm"
          lineHeight="20px"
          borderRadius="none"
          borderBottom="1px dashed"
        >
          View all
        </Link>
      ) }
    </Flex>
  );
};

export default AddressWidgets;
