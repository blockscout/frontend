import { useQuery } from '@tanstack/react-query';

import type { AddressWidget } from 'types/client/addressWidget';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';
import { WIDGET_CONFIG } from 'stubs/addressWidgets';

const feature = config.features.addressWidgets;
const configUrl = (feature.isEnabled && feature.configUrl) || '';

export default function useWidgetsConfigQuery(isQueryEnabled = true) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError<unknown>, Record<string, AddressWidget>>({
    queryKey: [ 'address-widgets' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'address-widgets' }),
    placeholderData: { widget: WIDGET_CONFIG },
    staleTime: Infinity,
    enabled: Boolean(configUrl) && isQueryEnabled,
  });
}
