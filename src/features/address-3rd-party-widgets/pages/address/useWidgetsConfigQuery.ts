// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import type { Address3rdPartyWidget } from 'src/features/address-3rd-party-widgets/types/view';

import useApiFetch from 'src/api/hooks/useFetch';
import type { ResourceError } from 'src/api/resources';

import config from 'src/config';

import { WIDGET_CONFIG } from '../../stubs';

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
