import { useRouter } from 'next/router';
import React from 'react';

import { link } from 'lib/link/link';

type LinkBuilderParams = Parameters<typeof link>;

export default function useLink() {
  const router = useRouter();
  const networkType = router.query.network_type;
  const networkSubType = router.query.network_sub_type;

  return React.useCallback((...args: LinkBuilderParams) => {
    if (typeof networkType !== 'string' || typeof networkSubType !== 'string') {
      return '';
    }

    return link(args[0], { network_type: networkType, network_sub_type: networkSubType, ...args[1] }, args[2]);
  }, [ networkType, networkSubType ]);
}
