// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import Block from 'src/slices/block/pages/details/Block';

import multichainConfig from 'src/features/multichain/chains-config';
import { MultichainProvider } from 'src/features/multichain/context';

import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

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
