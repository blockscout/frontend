// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from '../types';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { Link } from 'toolkit/chakra/link';

const UserProfileContentNavLink = ({ href, icon, text, onClick }: NavLink) => {
  return (
    <Link
      href={ href }
      display="flex"
      alignItems="center"
      columnGap={ 3 }
      py="14px"
      onClick={ onClick }
      variant="menu"
    >
      <SpriteIcon name={ icon } boxSize={ 5 } flexShrink={ 0 }/>
      <Box textStyle="sm" fontWeight="500">{ text }</Box>
    </Link>
  );
};

export default React.memo(UserProfileContentNavLink);
