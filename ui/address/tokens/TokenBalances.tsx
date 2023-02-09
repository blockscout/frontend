import { Flex, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import { ZERO } from 'lib/consts';
import getCurrencyValue from 'lib/getCurrencyValue';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';
import TokenBalancesItem from './TokenBalancesItem';

const TokenBalances = () => {
  const router = useRouter();

  const hash = router.query.id?.toString();

  const addressQuery = useApiQuery('address', {
    pathParams: { id: hash },
    queryOptions: { enabled: Boolean(hash) },
  });

  const tokenQuery = useFetchTokens({ hash });

  if (addressQuery.isError || tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (addressQuery.isLoading || tokenQuery.isLoading) {
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
  const { valueStr: nativeValue, usdBn: nativeUsd } = getCurrencyValue({
    value: addressData.coin_balance || '0',
    accuracy: 8,
    accuracyUsd: 2,
    exchangeRate: addressData.exchange_rate,
    decimals: String(appConfig.network.currency.decimals),
  });

  const tokensInfo = getTokensTotalInfo(tokenQuery.data);
  const prefix = tokensInfo.isOverflow ? '>' : '';
  const totalUsd = nativeUsd.plus(tokensInfo.usd);
  const tokensNumText = tokensInfo.num > 0 ?
    ` | ${ prefix }${ tokensInfo.num } ${ tokensInfo.num > 1 ? 'tokens' : 'token' }` :
    '';

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem name="Net Worth" value={ addressData.exchange_rate ? `${ prefix }$${ totalUsd.toFormat(2) } USD` : 'N/A' }/>
      <TokenBalancesItem
        name={ `${ appConfig.network.currency.symbol } Balance` }
        value={ (!nativeUsd.eq(ZERO) ? `$${ nativeUsd.toFormat(2) } USD | ` : '') + `${ nativeValue } ${ appConfig.network.currency.symbol }` }
      />
      <TokenBalancesItem
        name="Tokens"
        value={
          `${ prefix }$${ tokensInfo.usd.toFormat(2) } USD ` +
          tokensNumText
        }
      />
    </Flex>
  );
};

export default React.memo(TokenBalances);
