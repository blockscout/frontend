import { Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { FormattedData } from 'ui/address/tokenSelect/types';

import multichainConfig from 'configs/multichain';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { ZERO } from 'toolkit/utils/consts';
import { getTokensTotalInfoByChain, type TokensTotalInfo } from 'ui/address/utils/tokenUtils';

import OpSuperchainAddressInfoBreakdown from './OpSuperchainAddressInfoBreakdown';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  tokensData: FormattedData;
  isLoading: boolean;
  isError: boolean;
}

const OpSuperchainAddressNetWorth = ({ addressData, isLoading, tokensData, isError }: Props) => {

  const chains = multichainConfig()?.chains;

  const { usdBn: nativeUsd } = getCurrencyValue({
    value: addressData?.coin_balance || '0',
    accuracy: 8,
    accuracyUsd: 2,
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

  const prefix = isOverflow ? '>' : '';
  const totalUsd = usd ? nativeUsd.plus(usd) : ZERO;
  const hasUsd = !isError && addressData?.exchange_rate;

  return (
    <Flex alignItems="center" columnGap={ 3 }>
      <Skeleton
        display="flex"
        alignItems="center"
        loading={ isLoading }
      >
        { hasUsd ? `${ prefix }$${ totalUsd.dp(2).toFormat() }` : 'N/A' }
      </Skeleton>
      { hasUsd && (
        <OpSuperchainAddressInfoBreakdown data={ addressData.chain_infos } loading={ isLoading }>
          { ([ chain, chainInfo ]) => {
            const { usdBn: chainNativeUsdBn } = getCurrencyValue({
              value: chainInfo.coin_balance || '0',
              accuracy: 8,
              accuracyUsd: 2,
              exchangeRate: addressData?.exchange_rate,
              decimals: String(chain.app_config?.chain?.currency.decimals),
            });

            if (!chain.id) {
              return null;
            }

            return `$${ resultByChain[chain.id].usd.plus(chainNativeUsdBn).dp(2).toFormat() }`;
          } }
        </OpSuperchainAddressInfoBreakdown>
      ) }
    </Flex>
  );
};

export default React.memo(OpSuperchainAddressNetWorth);
