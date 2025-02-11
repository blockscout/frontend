import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import * as mixpanel from 'lib/mixpanel/index';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TextSeparator from 'ui/shared/TextSeparator';

import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';
import AddressMultichainButton from './AddressMultichainButton';

const multichainFeature = config.features.multichainButton;

type Props = {
  addressHash: string;
  addressData?: Address;
  isLoading?: boolean;
};

const AddressNetWorth = ({ addressData, isLoading, addressHash }: Props) => {
  const { data, isError, isPending } = useFetchTokens({ hash: addressData?.hash, enabled: addressData?.has_tokens });

  const { usdBn: nativeUsd } = getCurrencyValue({
    value: addressData?.coin_balance || '0',
    accuracy: 8,
    accuracyUsd: 2,
    exchangeRate: addressData?.exchange_rate,
    decimals: String(config.chain.currency.decimals),
  });

  const { usd, isOverflow } = getTokensTotalInfo(data);
  const prefix = isOverflow ? '>' : '';

  const totalUsd = nativeUsd.plus(usd);

  const onMultichainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  let multichainItems = null;

  if (multichainFeature.isEnabled && !addressData?.is_contract) {
    const { providers } = multichainFeature;
    const hasSingleProvider = providers.length === 1;

    multichainItems = (
      <>
        <TextSeparator mx={ 0 } color="gray.500"/>
        <Flex alignItems="center" gap={ 2 }>
          <Text>Multichain</Text>
          { providers.map((item) => (
            <AddressMultichainButton
              key={ item.name }
              item={ item }
              addressHash={ addressHash }
              onClick={ onMultichainClick }
              hasSingleProvider={ hasSingleProvider }
            />
          ))
          }
        </Flex>
      </>
    );
  }

  return (
    <Skeleton display="flex" alignItems="center" flexWrap="wrap" loading={ isLoading && !(addressData?.has_tokens && isPending) } gap={ 2 }>
      <Text>
        { (isError || !addressData?.exchange_rate) ? 'N/A' : `${ prefix }$${ totalUsd.toFormat(2) }` }
      </Text>
      { multichainItems }
    </Skeleton>
  );
};

export default AddressNetWorth;
