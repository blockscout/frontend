import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';

export default function useSubchainSelect() {
  const router = useRouter();

  const [ value, setValue ] = React.useState<Array<string>>([ multichainConfig.chains[0].id ]);

  const onChange = React.useCallback(({ value }: { value: Array<string> }) => {
    const nextValue = value[0];
    setValue(value);

    const nextPageQuery = {
      ...router.query,
      'subchain-id': nextValue,
    };

    router.push({ pathname: router.pathname, query: nextPageQuery }, undefined, { shallow: true });
  }, [ router ]);

  return React.useMemo(() => ({ value, onChange }), [ value, onChange ]);
}
