import type { Address3rdPartyWidget } from 'types/views/address';

import config from 'configs/app';

import useWidgetsConfigQuery from './useWidgetsConfigQuery';

const feature = config.features.address3rdPartyWidgets;
const widgets = (feature.isEnabled && feature.widgets) || [];

export default function useWidgets(addressType: Address3rdPartyWidget['pages'][number], isLoading = false, isQueryEnabled = true) {
  const configQuery = useWidgetsConfigQuery(isQueryEnabled);

  return {
    isEnabled: feature.isEnabled,
    widgets: configQuery.isPlaceholderData || isLoading ?
      widgets :
      widgets.filter((widget) => configQuery.data?.[widget]?.pages.includes(addressType)),
    configQuery,
  };
}
