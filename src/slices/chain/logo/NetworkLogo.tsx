// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import { route } from 'src/shared/router/routes';

import NetworkLogoImage from './NetworkLogoImage';

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {
  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <NetworkLogoImage chainConfig={ config.chain }/>
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
