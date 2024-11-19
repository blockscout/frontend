import { Image, Tooltip } from '@chakra-ui/react';
import _capitalize from 'lodash/capitalize';
import React from 'react';

import type { MultichainProviderConfigParsed } from 'types/client/multichainProviderConfig';

import { route } from 'nextjs-routes';

import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

const TEMPLATE_ADDRESS = '{address}';

type Props = {
  hasSingleProvider: boolean;
  item: MultichainProviderConfigParsed;
  addressHash: string;
  onClick?: () => void;
};

const AddressMultichainButton = ({ item, addressHash, onClick, hasSingleProvider }: Props) => {

  const buttonIcon = <Image src={ item.logoUrl } alt={ item.name } boxSize={ 5 } mr={ hasSingleProvider ? 2 : 0 } borderRadius="4px" overflow="hidden"/>;

  const buttonContent = hasSingleProvider ? (
    <>
      { buttonIcon }
      { _capitalize(item.name) }
    </>
  ) : (
    <Tooltip label={ _capitalize(item.name) }>{ buttonIcon }</Tooltip>
  );

  const linkProps = {
    variant: hasSingleProvider ? 'subtle' as const : undefined,
    display: 'flex',
    alignItems: 'center',
    fontSize: 'sm',
    lineHeight: 5,
    fontWeight: 500,
    onClick,
  };

  try {
    const portfolioUrlString = item.urlTemplate.replace(TEMPLATE_ADDRESS, addressHash);
    const portfolioUrl = new URL(portfolioUrlString);
    portfolioUrl.searchParams.append('utm_source', 'blockscout');
    portfolioUrl.searchParams.append('utm_medium', 'address');
    const dappId = item.dappId;
    return typeof dappId === 'string' ? (
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
    );
  } catch (error) {}

  return null;
};

export default AddressMultichainButton;
