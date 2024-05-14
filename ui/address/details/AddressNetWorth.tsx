import { Image, Skeleton, Text } from '@chakra-ui/react';
import _capitalize from 'lodash/capitalize';
import React from 'react';

import type { Address } from 'types/api/address';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import * as mixpanel from 'lib/mixpanel/index';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';

import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';

const multichainFeature = config.features.multichainButton;

type Props = {
  addressData?: Address;
  isLoading?: boolean;
}

const AddressNetWorth = ({ addressData, isLoading }: Props) => {
  const { data, isError, isPending } = useFetchTokens({ hash: addressData?.hash });

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

  let multichainItem = null;

  if (multichainFeature.isEnabled) {
    const buttonContent = (
      <>
        { multichainFeature.logoUrl &&
          <Image src={ multichainFeature.logoUrl } alt={ multichainFeature.name } boxSize={ 5 } mr={ 2 } borderRadius="4px" overflow="hidden"/>
        }
        { _capitalize(multichainFeature.name) }</>
    );

    const linkProps = {
      variant: 'subtle' as const,
      display: 'flex',
      alignItems: 'center',
      fontSize: 'sm',
      fontWeight: 500,
      onClick: onMultichainClick,
    };

    multichainItem = (
      <>
        <TextSeparator mx={ 3 } color="gray.500"/>
        <Text mr={ 2 }>Multichain</Text>
        { 'url' in multichainFeature ? (
          <LinkExternal
            href={ multichainFeature.url }
            { ...linkProps }
          >
            { buttonContent }
          </LinkExternal>
        ) : (
          <LinkInternal
            href={ route({ pathname: '/apps/[id]', query: { id: multichainFeature.dappId, utm_source: 'blockscout', utm_medium: 'address-page' } }) }
            { ...linkProps }
          >
            { buttonContent }
          </LinkInternal>
        ) }
      </>
    );
  }

  return (
    <Skeleton display="flex" alignItems="center" isLoaded={ !isLoading && !isPending }>
      <Text>
        { isError ? 'N/A' : `${ prefix }$${ totalUsd.toFormat(2) }` }
      </Text>
      { multichainItem }
    </Skeleton>
  );
};

export default AddressNetWorth;
