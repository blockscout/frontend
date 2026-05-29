// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import getSocketUrl from 'src/api/get-socket-url';
import useApiQuery from 'src/api/hooks/useApiQuery';
import { SocketProvider } from 'src/api/socket/context';

import { ADDRESS_INFO } from 'src/slices/address/stubs/address';
import Contract from 'src/slices/contract/pages/details/Contract';

import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import useRoutedChainSelect from 'src/features/multichain/hooks/useRoutedChainSelect';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import getAvailableChainIds from './get-available-chain-ids';

const LEFT_SLOT_PROPS = {
  mr: 6,
  flexShrink: 0,
};
const QUERY_PRESERVED_PARAMS = [ 'tab', 'hash' ];

interface Props {
  addressHash: string;
  isLoading: boolean;
  data: multichain.GetAddressResponse | undefined;
}

const MultichainAddressContract = ({ addressHash, isLoading, data }: Props) => {
  const chainIds = React.useMemo(() => getAvailableChainIds(data), [ data ]);
  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS, isLoading, chainIds });
  const isMobile = useIsMobile();

  const chain = React.useMemo(() => {
    return multichainConfig()?.chains.find(({ id }) => id === chainSelect.value?.[0]);
  }, [ chainSelect.value ]);

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && !isLoading,
      placeholderData: ADDRESS_INFO,
    },
    chain,
  });

  const leftSlot = (
    <ChainSelect
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
      loading={ isLoading }
      chainIds={ chainIds }
      mode={ isMobile ? 'compact' : 'default' }
    />
  );

  return (
    <MultichainProvider key={ chainSelect.value?.[0] } chainId={ chainSelect.value?.[0] }>
      <SocketProvider url={ getSocketUrl(chain?.app_config) }>
        <Contract
          addressData={ addressQuery.data }
          isLoading={ isLoading || addressQuery.isPlaceholderData }
          hasMudTab={ false }
          leftSlot={ leftSlot }
          leftSlotProps={ LEFT_SLOT_PROPS }
        />
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(MultichainAddressContract);
