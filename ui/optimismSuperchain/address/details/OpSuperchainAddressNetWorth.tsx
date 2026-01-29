import { Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { FormattedData } from 'ui/address/tokenSelect/types';

import multichainConfig from 'configs/multichain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ZERO } from 'toolkit/utils/consts';
import { getTokensTotalInfoByChain, type TokensTotalInfo } from 'ui/address/utils/tokenUtils';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

import OpSuperchainAddressInfoBreakdown from './OpSuperchainAddressInfoBreakdown';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  tokensData: FormattedData;
  isLoading: boolean;
  isError: boolean;
}

const OpSuperchainAddressNetWorth = ({ addressData, isLoading, tokensData, isError }: Props) => {

  const chains = multichainConfig()?.chains;

  const { usdBn: nativeUsd } = calculateUsdValue({
    amount: addressData?.coin_balance || '0',
    exchangeRate: addressData?.exchange_rate,
    decimals: String(chains?.[0]?.app_config.chain.currency.decimals),
  });

  const resultByChain = React.useMemo(() => {
    return getTokensTotalInfoByChain(tokensData, Object.keys(addressData?.chain_infos || {}));
  }, [ addressData?.chain_infos, tokensData ]);

  const { usd, isOverflow } = Object.values(resultByChain).reduce((result, item) => {
    return {
      usd: result.usd ? result.usd.plus(item.usd) : item.usd,
      num: result.num ? result.num + item.num : item.num,
      isOverflow: result.isOverflow || item.isOverflow,
    };
  }, {} as TokensTotalInfo);

  const totalUsd = usd ? nativeUsd.plus(usd) : ZERO;
  const hasUsd = !isError && addressData?.exchange_rate;

  return (
    <Flex alignItems="center" columnGap={ 3 }>
      { hasUsd ? (
        <SimpleValue
          value={ totalUsd }
          prefix="$"
          accuracy={ DEFAULT_ACCURACY_USD }
          overflowed={ isOverflow }
          loading={ isLoading }
        />
      ) : (
        <Skeleton loading={ isLoading }>N/A</Skeleton>
      ) }
      { hasUsd && (
        <OpSuperchainAddressInfoBreakdown data={ addressData.chain_infos } loading={ isLoading }>
          { ([ chain, chainInfo ]) => {
            const { usdBn: chainNativeUsdBn } = calculateUsdValue({
              amount: chainInfo.coin_balance || '0',
              exchangeRate: addressData?.exchange_rate,
              decimals: String(chain.app_config?.chain?.currency.decimals),
            });

            if (!chain.id) {
              return null;
            }

            return (
              <SimpleValue
                value={ resultByChain[chain.id].usd.plus(chainNativeUsdBn) }
                prefix="$"
                accuracy={ DEFAULT_ACCURACY_USD }
              />
            );
          } }
        </OpSuperchainAddressInfoBreakdown>
      ) }
    </Flex>
  );
};

export default React.memo(OpSuperchainAddressNetWorth);
