// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import getSocketUrl from 'src/api/get-socket-url';
import { SocketProvider } from 'src/api/socket/context';

import Token from 'src/slices/token/pages/details/Token';

import multichainConfig from 'src/features/multichain/chains-config';
import { MultichainProvider } from 'src/features/multichain/context';

import getQueryParamString from 'src/shared/router/get-query-param-string';

const MultichainToken = () => {
  const router = useRouter();
  const chainSlugOrId = getQueryParamString(router.query.chain_slug_or_id);
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

  return (
    <MultichainProvider chainId={ chainData?.id }>
      <SocketProvider url={ getSocketUrl(chainData?.app_config) }>
        <Token/>
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(MultichainToken);
