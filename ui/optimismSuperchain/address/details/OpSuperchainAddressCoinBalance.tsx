import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import NativeTokenIcon from 'ui/optimismSuperchain/components/NativeTokenIcon';
import CurrencyValue from 'ui/shared/CurrencyValue';

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
      <HStack>
        <NativeTokenIcon boxSize={ 5 } isLoading={ isLoading }/>
        <CurrencyValue
          value={ data?.coin_balance || '0' }
          exchangeRate={ data?.exchange_rate }
          decimals={ currency ? String(currency.decimals) : undefined }
          currency={ currency ? currency.symbol : undefined }
          accuracyUsd={ 2 }
          accuracy={ 8 }
          alignItems="center"
          isLoading={ isLoading }
        />
      </HStack>
      <OpSuperchainAddressInfoBreakdown data={ data?.chain_infos } loading={ isLoading }>
        { ([ chain, chainInfo ]) => {
          return (
            <CurrencyValue
              isLoading={ isLoading }
              value={ chainInfo.coin_balance }
              exchangeRate={ data?.exchange_rate }
              decimals={ chain.app_config.chain.currency.decimals.toString() }
              currency={ chain.app_config.chain.currency.symbol }
              accuracyUsd={ 2 }
              accuracy={ 8 }
              alignItems="center"
            />
          );
        } }
      </OpSuperchainAddressInfoBreakdown>
    </Flex>
  );
};

export default React.memo(OpSuperchainAddressCoinBalance);
