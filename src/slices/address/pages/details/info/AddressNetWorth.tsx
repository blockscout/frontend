// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useFetchTokens from 'src/slices/token/pages/address/useFetchTokens';
import { getTokensTotalInfo } from 'src/slices/token/pages/address/utils';

import AddressMultichainButtons from 'src/features/multichain-button/pages/address/AddressMultichainButtons';

import config from 'src/config';
import TextSeparator from 'src/shared/texts/TextSeparator';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

type Props = {
  addressHash: string;
  addressData?: schemas['AddressResponse'];
  isLoading?: boolean;
  hasMultichainButtons: boolean;
};

const AddressNetWorth = ({ addressData, isLoading, addressHash, hasMultichainButtons }: Props) => {
  const { data, isError, isPending } = useFetchTokens({ hash: addressData?.hash, enabled: addressData?.has_tokens });

  const { usdBn: nativeUsd } = calculateUsdValue({
    amount: addressData?.coin_balance || '0',
    exchangeRate: addressData?.exchange_rate,
    decimals: String(config.chain.currency.decimals),
  });

  const { usd, isOverflow } = getTokensTotalInfo(data);

  const totalUsd = nativeUsd.plus(usd);

  return (
    <Skeleton display="flex" alignItems="center" flexWrap="wrap" loading={ isLoading && !(addressData?.has_tokens && isPending) }>
      { (isError || !addressData?.exchange_rate) ?
        <span>N/A</span> :
        <SimpleValue value={ totalUsd } accuracy={ DEFAULT_ACCURACY_USD } prefix="$" overflowed={ isOverflow }/> }
      { hasMultichainButtons && (
        <>
          <TextSeparator/>
          <HStack columnGap={ 2 } alignItems="flex-start">
            <Text lineHeight="32px">Multichain</Text>
            <AddressMultichainButtons addressHash={ addressHash }/>
          </HStack>
        </>
      ) }
    </Skeleton>
  );
};

export default AddressNetWorth;
