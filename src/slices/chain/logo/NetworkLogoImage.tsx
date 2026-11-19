// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type config from 'src/config';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';

import { INVERT_FILTER } from './consts';

const LogoFallback = () => {
  return (
    <SpriteIcon
      name="networks/logo-placeholder"
      width="120px"
      height="24px"
      color={{ base: 'blue.600', _dark: 'white' }}
      aria-label="Network logo placeholder"
    />
  );
};

interface Props {
  readonly chainConfig: Pick<typeof config.chain, 'name' | 'logo'>;
}

const NetworkLogoImage = ({ chainConfig }: Props) => {
  const logoSrc = useColorModeValue(chainConfig.logo.default, chainConfig.logo.dark || chainConfig.logo.default);

  return (
    <Image
      h="24px"
      skeletonWidth="120px"
      src={ logoSrc }
      alt={ `${ chainConfig.name } network logo` }
      fallback={ <LogoFallback/> }
      filter={{ _dark: !chainConfig.logo.dark ? INVERT_FILTER : undefined }}
      objectFit="contain"
      objectPosition="left"
    />
  );
};

export default React.memo(NetworkLogoImage);
