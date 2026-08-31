// SPDX-License-Identifier: LicenseRef-Blockscout

import { useMemo } from 'react';

import type { Address3rdPartyWidget } from 'src/features/address-3rd-party-widgets/types/view';

import config from 'src/config';

import useWidgetsConfigQuery from './useWidgetsConfigQuery';

const feature = config.features.address3rdPartyWidgets;
const widgets = (feature.isEnabled && feature.widgets) || [];

export default function useAddress3rdPartyWidgets(
  addressType: Address3rdPartyWidget['pages'][number],
  isLoading = false,
  isQueryEnabled = true,
) {
  const configQuery = useWidgetsConfigQuery(isQueryEnabled);

  const items = useMemo(() => {
    if (configQuery.isPlaceholderData || isLoading) {
      return widgets;
    }
    return widgets.filter((widget) => configQuery.data?.[widget]?.pages.includes(addressType));
  }, [ configQuery, isLoading, addressType ]);

  return {
    isEnabled: feature.isEnabled,
    items,
    configQuery,
  };
}
