// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'client/config';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';

import { INVERT_FILTER } from './consts';

const IconFallback = () => {
  return (
    <SpriteIcon
      name="networks/icon-placeholder"
      w="30px"
      h="30px"
      color={{ base: 'blue.600', _dark: 'white' }}
      aria-label="Network icon placeholder"
    />
  );
};

type Props = {
  className?: string;
};

const NetworkIcon = ({ className }: Props) => {

  const iconSrc = useColorModeValue(config.chain.icon['default'], config.chain.icon.dark || config.chain.icon['default']);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <Image
        w="30px"
        h="30px"
        src={ iconSrc }
        alt={ `${ config.chain.name } network icon` }
        fallback={ <IconFallback/> }
        filter={{ _dark: !config.chain.icon.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkIcon));
