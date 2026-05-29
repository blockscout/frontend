// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import { route } from 'nextjs-routes';
import React from 'react';

import type { MultichainProviderConfigParsed } from 'src/features/multichain-button/types/client';

import TextSeparator from 'src/shared/texts/TextSeparator';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import styles from './AddressMultichainButton.module.css';

const TEMPLATE_ADDRESS = '{address}';

type Props = {
  item: MultichainProviderConfigParsed;
  addressHash: string;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

const AddressMultichainButton = ({ item, addressHash, onClick, isFirst, isLast }: Props) => {

  const isOnlyOne = isFirst && isLast;

  const buttonIcon = (
    <Image
      src={ item.logoUrl }
      alt={ item.name }
      boxSize={ 5 }
      mr={ isOnlyOne ? { base: 1, lg: 2 } : 0 }
      borderRadius="4px"
      overflow="hidden"
    />
  );

  const name = upperFirst(item.name.replaceAll('_', ' '));

  const buttonContent = isOnlyOne ? (
    <>
      { buttonIcon }
      { name }
    </>
  ) : (
    <Tooltip content={ name }>{ buttonIcon }</Tooltip>
  );

  try {
    const portfolioUrlString = item.urlTemplate.replace(TEMPLATE_ADDRESS, addressHash);
    const portfolioUrl = new URL(portfolioUrlString);
    portfolioUrl.searchParams.append('utm_source', 'blockscout');
    portfolioUrl.searchParams.append('utm_medium', 'address');
    const dappId = item.dappId;
    const isExternal = typeof dappId !== 'string';

    return (
      <>
        <Link
          className={ item.promo ? styles.promo : undefined }
          external={ isExternal }
          href={ isExternal ? portfolioUrl.toString() : route({ pathname: '/apps/[id]', query: { id: dappId, url: portfolioUrl.toString() } }) }
          variant={ isOnlyOne ? 'underlaid' : undefined }
          textStyle="sm"
          fontWeight="medium"
          onClick={ onClick }
          noIcon={ !isOnlyOne }
        >
          { buttonContent }
        </Link>
        { item.promo && isFirst && !isLast && <TextSeparator mx={ 0 }/> }
      </>
    );
  } catch (error) {}

  return null;
};

export default AddressMultichainButton;
