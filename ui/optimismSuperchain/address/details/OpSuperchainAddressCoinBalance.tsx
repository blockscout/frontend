import { Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import NativeTokenIcon from 'ui/optimismSuperchain/components/NativeTokenIcon';
import AssetValue from 'ui/shared/value/AssetValue';

import OpSuperchainAddressInfoBreakdown from './OpSuperchainAddressInfoBreakdown';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressCoinBalance = ({ data, isLoading }: Props) => {

  const chains = multichainConfig()?.chains;
  const currency = chains?.[0]?.app_config.chain.currency;

  return (
    <Flex alignItems="center" columnGap={ 3 }>
      <AssetValue
        amount={ data?.coin_balance || '0' }
        asset={ currency ? currency.symbol : undefined }
        exchangeRate={ data?.exchange_rate }
        decimals={ currency ? String(currency.decimals) : undefined }
        startElement={ <NativeTokenIcon boxSize={ 5 } isLoading={ isLoading } mr={ 2 }/> }
        loading={ isLoading }
      />
      <OpSuperchainAddressInfoBreakdown data={ data?.chain_infos } loading={ isLoading }>
        { ([ chain, chainInfo ]) => {
          return (
            <AssetValue
              amount={ chainInfo.coin_balance }
              asset={ chain.app_config.chain.currency.symbol }
              decimals={ chain.app_config.chain.currency.decimals.toString() }
              exchangeRate={ data?.exchange_rate }
              loading={ isLoading }
            />
          );
        } }
      </OpSuperchainAddressInfoBreakdown>
    </Flex>
  );
};

export default React.memo(OpSuperchainAddressCoinBalance);
