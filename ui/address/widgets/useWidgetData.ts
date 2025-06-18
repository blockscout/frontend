import useApiQuery from 'lib/api/useApiQuery';

const RESOURCE_NAME = 'general:address_widget';

const getNestedValue = (obj: Record<string, any>, path: string) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

const formatValue = (value: unknown): string => {
  const num = Number(value);
  if (!isNaN(num)) {
    return num.toString();
  }
  return String(value);
};

export default function useWidgetData(name: string, valuePath: string | undefined, address: string, isConfigLoading: boolean) {
  const query = useApiQuery<typeof RESOURCE_NAME, unknown, string | undefined>(RESOURCE_NAME, {
    pathParams: { name },
    queryParams: { address },
    queryOptions: {
      select: (response) => {
        try {
          const result = getNestedValue(response, valuePath || '');
          if (!result) throw Error;
          return formatValue(result);
        } catch {
          return undefined;
        }
      },
      enabled: !isConfigLoading && Boolean(valuePath),
    },
  });

  return query;
}
