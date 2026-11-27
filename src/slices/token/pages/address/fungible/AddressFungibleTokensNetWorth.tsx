// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack, Separator, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { currencyUnits } from 'src/slices/chain/units';
import NativeTokenIcon from 'src/slices/token/components/icon/TokenIconNative';

import config from 'src/config';
import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { thinsp } from 'src/toolkit/utils/htmlEntities';

import AddressPortfolioNetWorth from '../portfolio/AddressPortfolioNetWorth';
import useFetchTokens from '../useFetchTokens';
import { getAddressFungibleTokensSummary } from './utils';

const NATIVE_USD_PROPS = { fontWeight: 'normal' };

interface Props {
  addressHash: string;
}

const AddressFungibleTokensNetWorth = ({ addressHash }: Props) => {
  const addressQuery = useApiQuery('core:address', {
    pathParams: { hash: addressHash },
    queryOptions: { enabled: Boolean(addressHash), refetchOnMount: false },
  });

  const tokensQuery = useFetchTokens({ hash: addressHash });

  const coinBalance = addressQuery.data?.coin_balance;
  const exchangeRate = addressQuery.data?.exchange_rate;

  const summary = React.useMemo(() => {
    const { valueBn, usdBn } = calculateUsdValue({
      amount: coinBalance || '0',
      exchangeRate,
      decimals: String(config.chain.currency.decimals),
    });

    return getAddressFungibleTokensSummary({ symbol: currencyUnits.ether, balance: valueBn, usd: usdBn }, tokensQuery.data);
  }, [ coinBalance, exchangeRate, tokensQuery.data ]);

  if (addressQuery.isError || tokensQuery.isError) {
    return <ApiFetchAlert/>;
  }

  const isLoading = addressQuery.isPending || tokensQuery.isPending;

  return (
    <AddressPortfolioNetWorth
      addressHash={ addressHash }
      netWorth={ exchangeRate ? summary.netWorthUsd.toFixed() : undefined }
      isOverflow={ summary.isOverflow }
      isLoading={ isLoading }
      topTokens={ summary.topTokens }
    >
      <Separator height="16px" orientation="vertical" hideBelow="lg"/>
      <HStack w={{ base: 'full', lg: 'auto' }} minH={{ base: 'auto', lg: '32px' }}>
        <NativeTokenIcon boxSize={ 5 } flexShrink={ 0 }/>
        <Text>{ currencyUnits.ether } balance</Text>
        <NativeCoinValue
          amount={ coinBalance || '0' }
          exchangeRate={ exchangeRate }
          loading={ isLoading }
          fontWeight="semibold"
          usdProps={ NATIVE_USD_PROPS }
          minW={ 0 }
        />
      </HStack>
      <Separator height="16px" orientation="vertical" hideBelow="lg"/>
      <HStack w={{ base: 'full', lg: 'auto' }} minH={{ base: 'auto', lg: '32px' }}>
        <SpriteIcon name="tokens" boxSize={ 5 } flexShrink={ 0 } color="icon.primary"/>
        <Text>Tokens</Text>
        <HStack gap={ 1 } minW={ 0 }>
          <Skeleton loading={ isLoading } fontWeight="semibold">
            <Box as="span">{ summary.isOverflow ? `>${ thinsp }` : '' }{ BigNumber(summary.tokensNum).toFormat() }</Box>
          </Skeleton>
          { !summary.tokensUsd.isZero() && (
            <SimpleValue
              value={ summary.tokensUsd }
              prefix="$"
              accuracy={ DEFAULT_ACCURACY_USD }
              overflowed={ summary.isOverflow }
              startElement={ isLoading ? null : '(' }
              endElement={ isLoading ? null : ')' }
              loading={ isLoading }
              color="text.secondary"
            />
          ) }
        </HStack>
      </HStack>
    </AddressPortfolioNetWorth>
  );
};

export default React.memo(AddressFungibleTokensNetWorth);
