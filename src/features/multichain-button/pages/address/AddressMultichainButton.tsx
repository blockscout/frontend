// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import { route } from 'nextjs-routes';
import React from 'react';

import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

const TEMPLATE_ADDRESS = '{address}';

interface Props {
  item: MultichainProviderConfig;
  addressHash: string;
  onClick?: () => void;
};

const AddressMultichainButton = ({ item, addressHash, onClick }: Props) => {

  const isFullView = (item.view ?? 'full') === 'full';

  const buttonIcon = (
    <Image
      src={ item.logo }
      alt={ item.name }
      boxSize={ 5 }
      mr={ isFullView ? { base: 1, lg: 2 } : 0 }
      borderRadius="4px"
      overflow="hidden"
      flexShrink={ 0 }
    />
  );

  const name = upperFirst(item.name.replaceAll('_', ' '));

  const buttonContent = isFullView ? (
    <>
      { buttonIcon }
      { name }
    </>
  ) : (
    <Tooltip content={ name }>{ buttonIcon }</Tooltip>
  );

  try {
    const portfolioUrlString = item.url_template.replace(TEMPLATE_ADDRESS, addressHash);
    const portfolioUrl = new URL(portfolioUrlString);
    portfolioUrl.searchParams.append('utm_source', 'blockscout');
    portfolioUrl.searchParams.append('utm_medium', 'address');
    const dappId = item.dapp_id;
    const isExternal = typeof dappId !== 'string';

    return (
      <Link
        external={ isExternal }
        href={ isExternal ? portfolioUrl.toString() : route({ pathname: '/apps/[id]', query: { id: dappId, url: portfolioUrl.toString() } }) }
        variant="underlaid"
        textStyle="sm"
        fontWeight="medium"
        onClick={ onClick }
        noIcon={ !isFullView }
      >
        { buttonContent }
      </Link>
    );
  } catch (error) {}

  return null;
};

export default AddressMultichainButton;
