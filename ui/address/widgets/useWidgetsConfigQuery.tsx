import { useQuery } from '@tanstack/react-query';

import type { Address3rdPartyWidget } from 'types/views/address';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';
import { WIDGET_CONFIG } from 'stubs/addressWidgets';

const feature = config.features.address3rdPartyWidgets;
const configUrl = (feature.isEnabled && feature.configUrl) || '';

export default function useWidgetsConfigQuery(isQueryEnabled = true) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError<unknown>, Record<string, Address3rdPartyWidget>>({
    queryKey: [ 'address-3rd-party-widgets-config' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'address-3rd-party-widgets-config' }),
    placeholderData: { widget: WIDGET_CONFIG },
    staleTime: Infinity,
    enabled: Boolean(configUrl) && isQueryEnabled,
  });
}
