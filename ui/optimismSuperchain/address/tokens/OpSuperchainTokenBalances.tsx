import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS } from 'stubs/optimismSuperchain';
import { ZERO } from 'toolkit/utils/consts';
import { thinsp } from 'toolkit/utils/htmlEntities';
import TokenBalancesItem from 'ui/address/tokens/TokenBalancesItem';
import type { TokensTotalInfo } from 'ui/address/utils/tokenUtils';
import { getTokensTotalInfoByChain } from 'ui/address/utils/tokenUtils';
import NativeTokenIcon from 'ui/optimismSuperchain/components/NativeTokenIcon';
import IconSvg from 'ui/shared/IconSvg';
import AssetValue from 'ui/shared/value/AssetValue';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

import OpSuperchainAddressInfoBreakdown from '../details/OpSuperchainAddressInfoBreakdown';
import useFetchTokens from './useFetchTokens';

const OpSuperchainTokenBalances = () => {
  const chains = multichainConfig()?.chains;
  const currency = chains?.[0]?.app_config.chain.currency;

  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const addressQuery = useApiQuery('multichainAggregator:address', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: ADDRESS,
      refetchOnMount: false,
    },
  });

  const tokensQuery = useFetchTokens({ hash });

  const isLoading = addressQuery.isPlaceholderData || tokensQuery.isPending;
  const isError = addressQuery.isError || tokensQuery.isError;

  const { valueStr: nativeValue, usdBn: nativeUsd } = calculateUsdValue({
    amount: addressQuery.data?.coin_balance || '0',
    exchangeRate: addressQuery.data?.exchange_rate,
    decimals: currency ? String(currency.decimals) : undefined,
  });

  const resultByChain = React.useMemo(() => {
    return getTokensTotalInfoByChain(tokensQuery.data, Object.keys(addressQuery.data?.chain_infos || {}));
  }, [ addressQuery.data?.chain_infos, tokensQuery.data ]);

  const tokensInfo = Object.values(resultByChain).reduce((result, item) => {
    return {
      usd: result.usd ? result.usd.plus(item.usd) : item.usd,
      num: result.num ? result.num + item.num : item.num,
      isOverflow: result.isOverflow || item.isOverflow,
    };
  }, {} as TokensTotalInfo);

  const prefix = tokensInfo.isOverflow ? `>${ thinsp }` : '';
  const totalUsd = nativeUsd.plus(tokensInfo.usd);
  const tokensNumText = tokensInfo.num > 0 ?
    `${ prefix }${ tokensInfo.num } ${ tokensInfo.num > 1 ? 'tokens' : 'token' }` :
    '0';

  if (isError) {
    return null;
  }

  const totalBreakdown = addressQuery.data?.exchange_rate ? (
    <OpSuperchainAddressInfoBreakdown data={ addressQuery.data?.chain_infos } loading={ isLoading } ml={ 2 }>
      { ([ chain, chainInfo ]) => {

        if (!chain.id) {
          return null;
        }

        const tokensInfo = resultByChain[chain.id];

        const { usdBn: chainNativeUsdBn } = calculateUsdValue({
          amount: chainInfo.coin_balance || '0',
          exchangeRate: addressQuery.data.exchange_rate,
          decimals: String(chain.app_config.chain.currency.decimals),
        });

        return (
          <SimpleValue
            value={ chainNativeUsdBn.plus(tokensInfo.usd) }
            prefix="$"
            accuracy={ DEFAULT_ACCURACY_USD }
            overflowed={ tokensInfo.isOverflow }
          />
        );
      } }
    </OpSuperchainAddressInfoBreakdown>
  ) : null;

  const nativeCoinBreakdown = (
    <OpSuperchainAddressInfoBreakdown data={ addressQuery.data?.chain_infos } loading={ isLoading } ml={ 2 }>
      { ([ chain, chainInfo ]) => {
        return (
          <AssetValue
            amount={ chainInfo.coin_balance }
            asset={ chain.app_config.chain.currency.symbol }
            exchangeRate={ addressQuery.data?.exchange_rate }
            decimals={ chain.app_config.chain.currency.decimals.toString() }
            loading={ isLoading }
          />
        );
      } }
    </OpSuperchainAddressInfoBreakdown>
  );

  const tokensBreakdown = (
    <OpSuperchainAddressInfoBreakdown data={ resultByChain } loading={ isLoading } ml={ 2 }>
      { ([ , chainInfo ]) => {
        const prefix = chainInfo.isOverflow ? '>' : '';
        return (
          <>
            <span>{ prefix }{ chainInfo.num }</span>
            <span> ({ prefix }${ chainInfo.usd.toFormat(2) })</span>
          </>
        );
      } }
    </OpSuperchainAddressInfoBreakdown>
  );

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mb={ 6 } flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem
        name="Net Worth"
        value={ addressQuery.data?.exchange_rate ? `${ prefix }$${ totalUsd.toFormat(2) }` : 'N/A' }
        isLoading={ isLoading }
        icon={ <IconSvg name="wallet" boxSize="20px" flexShrink={ 0 } color="icon.primary"/> }
        contentAfter={ totalBreakdown }
      />
      <TokenBalancesItem
        name={ `${ currency?.symbol } Balance` }
        value={ `${ nativeValue } ${ currency?.symbol }` }
        valueSecondary={ !nativeUsd.eq(ZERO) ? `$${ nativeUsd.toFormat(2) }` : '' }
        isLoading={ isLoading }
        icon={ <NativeTokenIcon isLoading={ isLoading } boxSize="20px"/> }
        contentAfter={ nativeCoinBreakdown }
      />
      <TokenBalancesItem
        name="Tokens"
        value={ tokensNumText }
        valueSecondary={ `${ prefix }$${ tokensInfo.usd.toFormat(2) }` }
        isLoading={ isLoading }
        icon={ <IconSvg name="tokens" boxSize="20px" flexShrink={ 0 } color="icon.primary"/> }
        contentAfter={ tokensBreakdown }
      />
    </Flex>
  );
};

export default React.memo(OpSuperchainTokenBalances);
