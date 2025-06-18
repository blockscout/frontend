import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import type { AddressWidget } from 'types/client/addressWidget';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';
import { WIDGET_CONFIG } from 'stubs/addressWidgets';

import AddressWidgetCard from './AddressWidgetCard';

const feature = config.features.addressWidgets;
const widgets = (feature.isEnabled && feature.widgets) || [];
const configUrl = (feature.isEnabled && feature.configUrl) || '';

const AddressWidgets = ({ address }: { address: string }) => {
  const apiFetch = useApiFetch();

  const { data, isPlaceholderData } = useQuery<unknown, ResourceError<unknown>, Record<string, AddressWidget>>({
    queryKey: [ 'address-widgets' ],
    queryFn: async() => apiFetch(configUrl, undefined, { resource: 'address-widgets' }),
    placeholderData: { widget: WIDGET_CONFIG },
    staleTime: Infinity,
    enabled: Boolean(configUrl),
  });

  return (
    <Grid
      gap={ 3 }
      templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
      w="full"
    >
      { widgets.map((name) => (
        <AddressWidgetCard
          key={ name }
          name={ name }
          config={ isPlaceholderData ? WIDGET_CONFIG : data?.[name] }
          address={ address }
          isConfigLoading={ isPlaceholderData }
        />
      )) }
    </Grid>
  );
};

export default AddressWidgets;
