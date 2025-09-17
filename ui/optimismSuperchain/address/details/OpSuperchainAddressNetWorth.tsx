import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Link } from 'toolkit/chakra/link';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from 'toolkit/chakra/popover';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { getTokensTotalInfoByChain, type TokensTotalInfo } from 'ui/address/utils/tokenUtils';
import ChainIcon from 'ui/optimismSuperchain/components/ChainIcon';

import useFetchTokens from '../tokens/useFetchTokens';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressNetWorth = ({ data: addressData, isLoading }: Props) => {

  const { data, isError, isPending } = useFetchTokens({ hash: addressData?.hash, enabled: addressData?.has_tokens });

  const { usdBn: nativeUsd } = getCurrencyValue({
    // TODO @tom2drum pass correct data
    // value: addressData?.coin_balance || '0',
    value: '12345',
    accuracy: 8,
    accuracyUsd: 2,
    // exchangeRate: addressData?.exchange_rate,
    exchangeRate: '0.42',
    // decimals: String(config.chain.currency.decimals),
    decimals: '0',
  });

  const resultByChain = React.useMemo(() => {
    return getTokensTotalInfoByChain(data, Object.keys(addressData?.chain_infos || {}));
  }, [ addressData?.chain_infos, data ]);

  const { usd, isOverflow } = Object.values(resultByChain).reduce((result, item) => {
    return {
      usd: result.usd ? result.usd.plus(item.usd) : item.usd,
      num: result.num ? result.num + item.num : item.num,
      isOverflow: result.isOverflow || item.isOverflow,
    };
  }, {} as TokensTotalInfo);

  const prefix = isOverflow ? '>' : '';
  const totalUsd = nativeUsd.plus(usd);

  const chains = multichainConfig()?.chains;

  return (
    <Flex alignItems="center" columnGap={ 3 }>
      <Skeleton
        display="flex"
        alignItems="center"
        loading={ isLoading || (addressData?.has_tokens && isPending) }
      >
        { /* TODO @tom2drum pass correct data */ }
        { /* { (isError || !addressData?.exchange_rate) ? 'N/A' : `${ prefix }$${ totalUsd.toFormat(2) }` } */ }
        { isError ? 'N/A' : `${ prefix }$${ totalUsd.toFormat(2) }` }
      </Skeleton>
      { addressData?.chain_infos && (
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
              { Object.entries(addressData.chain_infos).map(([ chainId ]) => {

                const chain = chains?.find((chain) => chain.config.chain.id === chainId);

                if (!chain) {
                  return null;
                }

                // TODO @tom2drum add native usd value

                return (
                  <VStack key={ chainId } alignItems="flex-start">
                    <HStack>
                      <ChainIcon data={ chain }/>
                      <span>{ chain.config.chain.name }</span>
                    </HStack>
                    <Box color="text.secondary" ml={ 7 }>${ resultByChain[chainId].usd.dp(2).toFormat() }</Box>
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

export default React.memo(OpSuperchainAddressNetWorth);
