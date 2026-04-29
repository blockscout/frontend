import { useRouter } from 'next/router';
import React from 'react';

import getSocketUrl from 'client/api/get-socket-url';
import { SocketProvider } from 'client/api/socket/context';
import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import Token from 'ui/pages/Token';

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
