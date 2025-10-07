import { pickBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import getChainIdFromSlug from './getChainIdFromSlug';
import getChainValueFromQuery from './getChainValueFromQuery';

interface Props {
  persistedParams?: Array<string>;
  isLoading?: boolean;
  chainIds?: Array<string>;
  withAllOption?: boolean;
  field?: 'chain-slug' | 'chain_id';
}

export default function useRoutedChainSelect(props?: Props) {
  const router = useRouter();

  const [ value, setValue ] = React.useState<Array<string> | undefined>(
    props?.isLoading ? undefined : [ getChainValueFromQuery(router.query, props?.chainIds, props?.withAllOption, props?.field) ].filter(Boolean),
  );

  React.useEffect(() => {
    if (!props?.isLoading) {
      setValue([ getChainValueFromQuery(router.query, props?.chainIds, props?.withAllOption, props?.field) ].filter(Boolean));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ props?.isLoading, props?.chainIds ]);

  const onValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setValue(value);

    const nextQuery = props?.persistedParams ?
      props.persistedParams.reduce((acc, param) => ({ ...acc, [param]: router.query[param] || undefined }), {}) :
      router.query;

    const field = props?.field || 'chain-slug';

    switch (field) {
      case 'chain-slug': {
        router.push({
          pathname: router.pathname,
          query: {
            ...nextQuery,
            'chain-slug': value[0],
          },
        });
        break;
      }
      case 'chain_id': {
        router.push({
          pathname: router.pathname,
          query: pickBy({
            ...nextQuery,
            chain_id: getChainIdFromSlug(value[0]),
          }, (value) => value !== undefined),
        });
        break;
      }
    }

  }, [ props?.field, props?.persistedParams, router ]);

  return React.useMemo(() => ({
    value,
    onValueChange,
  }), [ value, onValueChange ]);
}
