import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { getTokenBalanceTotal, calculateUsdValue } from '../utils/tokenUtils';
import TokenBalancesItem from './TokenBalancesItem';

const TokenBalances = () => {
  const router = useRouter();

  const addressQuery = useApiQuery('address', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: { enabled: Boolean(router.query.id) },
  });

  const balancesQuery = useApiQuery('address_token_balances', {
    pathParams: { id: addressQuery.data?.hash },
    queryOptions: { enabled: Boolean(addressQuery.data) },
  });

  if (addressQuery.isError || balancesQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (addressQuery.isLoading || balancesQuery.isLoading) {
    const item = <Skeleton w={{ base: '100%', lg: '240px' }} h="82px" borderRadius="16px"/>;
    return (
      <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
        { item }
        { item }
        { item }
      </Flex>
    );
  }

  const addressData = addressQuery.data;
  const { valueStr: nativeValue, usd: nativeUsd } = getCurrencyValue({
    value: addressData.coin_balance || '0',
    accuracy: 8,
    accuracyUsd: 2,
    exchangeRate: addressData.exchange_rate,
    decimals: String(appConfig.network.currency.decimals),
  });

  const tokenBalanceBn = getTokenBalanceTotal(balancesQuery.data.map(calculateUsdValue)).toFixed(2);

  const totalUsd = nativeUsd ? BigNumber(nativeUsd).toNumber() + BigNumber(tokenBalanceBn).toNumber() : undefined;

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem name="Net Worth" value={ totalUsd ? `$${ totalUsd } USD` : 'N/A' }/>
      <TokenBalancesItem
        name={ `${ appConfig.network.currency.symbol } Balance` }
        value={ (nativeUsd ? `$${ nativeUsd } USD | ` : '') + `${ nativeValue } ${ appConfig.network.currency.symbol }` }
      />
      <TokenBalancesItem
        name="Tokens"
        value={
          `$${ tokenBalanceBn } USD ` +
          (balancesQuery.data.length ? ` | ${ balancesQuery.data.length } ${ balancesQuery.data.length === 1 ? 'token' : 'tokens' }` : '')
        }
      />
    </Flex>
  );
};

export default React.memo(TokenBalances);
