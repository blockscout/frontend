import { useRouter } from 'next/router';
import React from 'react';

import getChainSlugFromId from 'lib/multichain/getChainSlugFromId';
import getQueryParamString from 'lib/router/getQueryParamString';

interface Props {
  chainIds: Array<string>;
}
export default function useChainSelectErc20({ chainIds }: Props) {
  const router = useRouter();
  const chainId = getQueryParamString(router.query.chain_id);
  const chainSlug = chainId && chainIds.includes(chainId) && getChainSlugFromId(chainId);

  return React.useState<Array<string> | undefined>(
    chainSlug ? [ chainSlug ] : [ 'all' ],
  );
}
