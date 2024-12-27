import type { MenuProps } from '@chakra-ui/react';
// eslint-disable-next-line no-restricted-imports
import { Menu as MenuBase } from '@chakra-ui/react';
import React from 'react';

const Menu = (props: MenuProps) => {
  return <MenuBase gutter={ 4 } { ...props }/>;
};

export default React.memo(Menu);
