import { Flex, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from 'toolkit/chakra/popover';
import ChainIcon from 'ui/optimismSuperchain/components/ChainIcon';
import CurrencyValue from 'ui/shared/CurrencyValue';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressCoinBalance = ({ data, isLoading }: Props) => {

  const chains = multichainConfig()?.chains;
  const currency = chains?.[0]?.config.chain.currency;

  return (
    <Flex alignItems="center" columnGap={ 3 }>
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
      { data?.chain_infos && Object.keys(data.chain_infos).length > 1 && (
        <PopoverRoot>
          <PopoverTrigger>
            <Link
              variant="secondary"
              textStyle="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              loading={ isLoading }
            >
              By chain
            </Link>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody display="flex" flexDirection="column" rowGap={ 3 }>
              { Object.entries(data.chain_infos).map(([ chainId, chainInfo ]) => {

                const chain = chains?.find((chain) => chain.config.chain.id === chainId);

                if (!chain) {
                  return null;
                }

                return (
                  <VStack key={ chainId } alignItems="flex-start">
                    <HStack>
                      <ChainIcon data={ chain }/>
                      <span>{ chain.config.chain.name }</span>
                    </HStack>
                    <CurrencyValue
                      isLoading={ isLoading }
                      value={ chainInfo.coin_balance }
                      // TODO @tom2drum pass correct data
                      exchangeRate={ undefined }
                      decimals={ chain.config.chain.currency.decimals.toString() }
                      currency={ currencyUnits.ether }
                      accuracyUsd={ 2 }
                      accuracy={ 8 }
                      alignItems="center"
                      color="text.secondary"
                      ml={ 7 }
                    />
                  </VStack>
                );
              }) }
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      ) }
    </Flex>
  );
};

export default React.memo(OpSuperchainAddressCoinBalance);
