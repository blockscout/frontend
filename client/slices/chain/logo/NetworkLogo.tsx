// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import { route } from 'nextjs-routes';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';

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

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {

  const logoSrc = useColorModeValue(config.chain.logo.default, config.chain.logo.dark || config.chain.logo.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <Image
        h="24px"
        skeletonWidth="120px"
        src={ logoSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback/> }
        filter={{ _dark: !config.chain.logo.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
