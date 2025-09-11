import { useRouter } from 'next/router';
import React from 'react';

import getChainValueFromQuery from './getChainValueFromQuery';

interface Props {
  persistedParams?: Array<string>;
  isLoading?: boolean;
  chainIds?: Array<string>;
}

export default function useRoutedChainSelect(props?: Props) {
  const router = useRouter();

  const [ value, setValue ] = React.useState<Array<string> | undefined>(
    props?.isLoading ? undefined : [ getChainValueFromQuery(router.query, props?.chainIds) ].filter(Boolean),
  );

  React.useEffect(() => {
    if (!props?.isLoading) {
      setValue([ getChainValueFromQuery(router.query, props?.chainIds) ].filter(Boolean));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ props?.isLoading, props?.chainIds ]);

  const onValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setValue(value);

    const nextQuery = props?.persistedParams ? props.persistedParams.reduce((acc, param) => ({ ...acc, [param]: router.query[param] }), {}) : router.query;

    router.push({
      pathname: router.pathname,
      query: {
        ...nextQuery,
        'chain-slug': value[0],
      },
    });
  }, [ props?.persistedParams, router ]);

  return React.useMemo(() => ({
    value,
    onValueChange,
  }), [ value, onValueChange ]);
}
