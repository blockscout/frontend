import { get } from 'es-toolkit/compat';

import useApiQuery from 'lib/api/useApiQuery';

const RESOURCE_NAME = 'general:address_3rd_party_info';

const formatValue = (value: unknown): string => {
  const num = Number(value);
  if (!isNaN(num)) {
    return Number(num.toFixed(2)).toLocaleString('en-US');
  }
  return String(value);
};

export default function useWidgetData(name: string, valuePath: string | undefined, address: string, isLoading: boolean) {
  const query = useApiQuery<typeof RESOURCE_NAME, unknown, string | undefined>(RESOURCE_NAME, {
    pathParams: { name },
    queryParams: { address },
    queryOptions: {
      select: (response) => {
        try {
          const result = get(response, valuePath || '');
          if (result === undefined || result === null) throw Error;
          return formatValue(result);
        } catch {
          return undefined;
        }
      },
      enabled: !isLoading && Boolean(valuePath),
    },
  });

  return query;
}
