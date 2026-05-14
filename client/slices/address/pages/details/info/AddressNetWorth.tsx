// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'client/slices/address/types/api';

import useFetchTokens from 'client/slices/token/pages/address/useFetchTokens';
import { getTokensTotalInfo } from 'client/slices/token/pages/address/utils';

import AddressMultichainButton from 'client/features/multichain-button/pages/address/AddressMultichainButton';

import * as mixpanel from 'client/shared/analytics/mixpanel';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TextSeparator from 'ui/shared/TextSeparator';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

const multichainFeature = config.features.multichainButton;

type Props = {
  addressHash: string;
  addressData?: Address;
  isLoading?: boolean;
};

const AddressNetWorth = ({ addressData, isLoading, addressHash }: Props) => {
  const { data, isError, isPending } = useFetchTokens({ hash: addressData?.hash, enabled: addressData?.has_tokens });

  const { usdBn: nativeUsd } = calculateUsdValue({
    amount: addressData?.coin_balance || '0',
    exchangeRate: addressData?.exchange_rate,
    decimals: String(config.chain.currency.decimals),
  });

  const { usd, isOverflow } = getTokensTotalInfo(data);

  const totalUsd = nativeUsd.plus(usd);

  const onMultichainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  let multichainItems = null;

  const isEip7702 = addressData?.implementations?.length && addressData?.proxy_type === 'eip7702';

  if (multichainFeature.isEnabled && (!addressData?.is_contract || isEip7702)) {
    const { providers } = multichainFeature;

    multichainItems = (
      <>
        <TextSeparator/>
        <HStack columnGap={ 2 }>
          <Text>Multichain</Text>
          <HStack gap={{ base: 2, lg: 3 }}>
            { providers.map((item, index) => (
              <AddressMultichainButton
                key={ item.name }
                item={ item }
                addressHash={ addressHash }
                onClick={ onMultichainClick }
                isFirst={ index === 0 }
                isLast={ index === providers.length - 1 }
              />
            ))
            }
          </HStack>
        </HStack>
      </>
    );
  }

  return (
    <Skeleton display="flex" alignItems="center" flexWrap="wrap" loading={ isLoading && !(addressData?.has_tokens && isPending) }>
      { (isError || !addressData?.exchange_rate) ?
        <span>N/A</span> :
        <SimpleValue value={ totalUsd } accuracy={ DEFAULT_ACCURACY_USD } prefix="$" overflowed={ isOverflow }/> }
      { multichainItems }
    </Skeleton>
  );
};

export default AddressNetWorth;
