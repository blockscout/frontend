import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'client/api/get-socket-url';
import { MultichainProvider } from 'lib/contexts/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import { SocketProvider } from 'client/api/socket/context';
import TokenInstance from 'ui/pages/TokenInstance';

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
