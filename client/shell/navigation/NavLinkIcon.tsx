// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem, NavGroupItem } from './types';

import SpriteIcon from 'client/sprite/SpriteIcon';

interface Props {
  className?: string;
  item: NavItem | NavGroupItem;
}

const NavLinkIcon = ({ item, className }: Props) => {
  if ('icon' in item && item.icon) {
    return <SpriteIcon className={ className } name={ item.icon } boxSize="30px" flexShrink={ 0 } fill="currentColor"/>;
  }
  if ('iconComponent' in item && item.iconComponent) {
    const IconComponent = item.iconComponent;
    return <IconComponent className={ className } size={ 30 }/>;
  }

  return null;
};

export default chakra(NavLinkIcon);
