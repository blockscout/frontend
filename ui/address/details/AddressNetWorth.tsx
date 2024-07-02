import { Image, Skeleton, Text, Flex } from '@chakra-ui/react';
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

const TEMPLATE_ADDRESS = '{address}';

const multichainFeature = config.features.multichainButton;

type Props = {
  addressHash: string;
  addressData?: Address;
  isLoading?: boolean;
}

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

  let multichainItem = null;

  if (multichainFeature.isEnabled && !addressData?.is_contract) {
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
      lineHeight: 5,
      fontWeight: 500,
      onClick: onMultichainClick,
    };

    try {
      const portfolioUrlString = multichainFeature.urlTemplate.replace(TEMPLATE_ADDRESS, addressHash);
      const portfolioUrl = new URL(portfolioUrlString);
      portfolioUrl.searchParams.append('utm_source', 'blockscout');
      portfolioUrl.searchParams.append('utm_medium', 'address');
      const dappId = multichainFeature.dappId;
      multichainItem = (
        <>
          <TextSeparator mx={ 0 } color="gray.500"/>
          <Flex alignItems="center" gap={ 2 }>
            <Text>Multichain</Text>
            { typeof dappId === 'string' ? (
              <LinkInternal
                href={ route({ pathname: '/apps/[id]', query: { id: dappId, url: portfolioUrl.toString() } }) }
                { ...linkProps }
              >
                { buttonContent }
              </LinkInternal>
            ) : (
              <LinkExternal
                href={ portfolioUrl.toString() }
                { ...linkProps }
              >
                { buttonContent }
              </LinkExternal>
            ) }
          </Flex>
        </>
      );
    } catch (error) {}

  }

  return (
    <Skeleton display="flex" alignItems="center" flexWrap="wrap" isLoaded={ !isLoading && !(addressData?.has_tokens && isPending) } gap={ 2 }>
      <Text>
        { (isError || !addressData?.exchange_rate) ? 'N/A' : `${ prefix }$${ totalUsd.toFormat(2) }` }
      </Text>
      { multichainItem }
    </Skeleton>
  );
};

export default AddressNetWorth;
