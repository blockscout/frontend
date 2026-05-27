// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import Block from 'client/slices/block/pages/details/Block';

import multichainConfig from 'client/features/multichain/chains-config';
import { MultichainProvider } from 'client/features/multichain/context';

import getQueryParamString from 'client/shared/router/get-query-param-string';

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
