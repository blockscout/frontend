import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'client/shared/router/get-query-param-string';
import Block from 'client/slices/block/pages/details/Block';
import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';

const MultichainBlock = () => {
  const router = useRouter();
  const chainSlugOrId = getQueryParamString(router.query.chain_slug_or_id);
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

  return (
    <MultichainProvider chainId={ chainData?.id }>
      <Block/>
    </MultichainProvider>
  );
};

export default React.memo(MultichainBlock);
