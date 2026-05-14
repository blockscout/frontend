// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import type { Address3rdPartyWidget } from 'client/features/address-3rd-party-widgets/types/view';

import useApiFetch from 'client/api/hooks/useFetch';
import type { ResourceError } from 'client/api/resources';

import config from 'configs/app';
import { WIDGET_CONFIG } from 'stubs/address3rdPartyWidgets';

const feature = config.features.address3rdPartyWidgets;
const configUrl = (feature.isEnabled && feature.configUrl) || '';
const widgets = (feature.isEnabled && feature.widgets) || [];

export default function useWidgetsConfigQuery(isQueryEnabled = true) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError<unknown>, Record<string, Address3rdPartyWidget>>({
    queryKey: [ 'address-3rd-party-widgets-config' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'address-3rd-party-widgets-config' }),
    placeholderData: widgets.reduce((acc, widget) => ({ ...acc, [widget]: WIDGET_CONFIG }), {}),
    staleTime: Infinity,
    enabled: Boolean(configUrl) && isQueryEnabled,
  });
}
