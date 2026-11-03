// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { SocketProvider } from 'src/api/socket/context';
import getSocketUrl from 'src/api/socket/get-socket-url';

import Token from 'src/slices/token/pages/details/Token';

import multichainConfig from 'src/features/multichain/chains-config';
import { MultichainProvider } from 'src/features/multichain/context';

import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

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
