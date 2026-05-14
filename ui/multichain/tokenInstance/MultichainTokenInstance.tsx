// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import getSocketUrl from 'client/api/get-socket-url';
import { SocketProvider } from 'client/api/socket/context';

import TokenInstance from 'client/slices/token/pages/instance/TokenInstance';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';

const MultichainTokenInstance = () => {
  const router = useRouter();
  const chainSlugOrId = getQueryParamString(router.query.chain_slug_or_id);
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

  return (
    <MultichainProvider chainId={ chainData?.id }>
      <SocketProvider url={ getSocketUrl(chainData?.app_config) }>
        <TokenInstance/>
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(MultichainTokenInstance);
