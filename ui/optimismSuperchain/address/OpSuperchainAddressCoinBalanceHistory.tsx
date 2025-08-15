import React from 'react';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { SocketProvider } from 'lib/socket/context';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import ChainSelect from 'ui/shared/multichain/ChainSelect';

const QUERY_PRESERVED_PARAMS = [ 'tab', 'hash' ];

const OpSuperchainAddressCoinBalanceHistory = () => {
  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS });
  const chainConfig = multichainConfig()?.chains.find(({ slug }) => slug === chainSelect.value?.[0]);

  return (
    <>
      <ChainSelect
        value={ chainSelect.value }
        onValueChange={ chainSelect.onValueChange }
        mb={ 3 }
      />
      <MultichainProvider chainSlug={ chainSelect.value?.[0] }>
        <SocketProvider url={ getSocketUrl(chainConfig?.config) }>
          <AddressCoinBalance key={ chainSelect.value?.[0] }/>
        </SocketProvider>
      </MultichainProvider>
    </>
  );
};

export default React.memo(OpSuperchainAddressCoinBalanceHistory);
