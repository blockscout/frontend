import { get } from 'es-toolkit/compat';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

const RESOURCE_NAME = 'general:address_3rd_party_info';

const formatValue = (value: unknown): string | undefined => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return undefined;
  }

  const num = Number(value);
  if (!isNaN(num)) {
    if (num === -1) {
      return '0';
    }
    return num.toLocaleString();
  }

  return String(value);
};

const formatValueTitle = (valueTitle: unknown): string | undefined => {
  if (typeof valueTitle !== 'string' && typeof valueTitle !== 'number' && typeof valueTitle !== 'boolean') {
    return;
  }

  return String(valueTitle);
};

interface Props {
  name: string;
  valuePath?: string;
  valueTitlePath?: string;
  address: string;
  isLoading: boolean;
}

interface Response {
  value: string | undefined;
  valueTitle: string | undefined;
}

export default function useWidgetData({ name, valuePath, valueTitlePath, address, isLoading }: Props) {
  const query = useApiQuery<typeof RESOURCE_NAME, unknown, Response | undefined>(RESOURCE_NAME, {
    pathParams: { name },
    queryParams: { address, chain_id: config.chain.id },
    queryOptions: {
      select: (response) => {
        try {
          const value = valuePath ? get(response, valuePath) : undefined;
          const valueTitle = valueTitlePath ? get(response, valueTitlePath) : undefined;
          return {
            value: formatValue(value),
            valueTitle: formatValueTitle(valueTitle),
          };
        } catch {
          return undefined;
        }
      },
      enabled: !isLoading && Boolean(valuePath),
      refetchOnMount: false,
    },
  });

  return query;
}
