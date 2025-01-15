import { Box } from '@chakra-ui/react';
import React from 'react';

import type { NavLink } from './types';

import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';

const UserProfileContentNavLink = ({ href, icon, text, onClick }: NavLink) => {

  return (
    <LinkInternal
      href={ href }
      display="flex"
      alignItems="center"
      columnGap={ 3 }
      py="14px"
      color="inherit"
      _hover={{ textDecoration: 'none', color: 'link.primary.hover' }}
      onClick={ onClick }
    >
      <IconSvg name={ icon } boxSize={ 5 } flexShrink={ 0 }/>
      <Box textStyle="sm" fontWeight="500">{ text }</Box>
    </LinkInternal>
  );
};

export default React.memo(UserProfileContentNavLink);
