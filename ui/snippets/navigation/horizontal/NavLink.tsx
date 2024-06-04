import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

interface Props {
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ item, noIcon }: Props) => {
  return (
    <chakra.li
      display="flex"
      alignItems="center"
      columnGap={ 3 }
      listStyleType="none"
      px={ 2 }
      py={ 1.5 }
      fontSize="sm"
      lineHeight={ 5 }
      fontWeight={ 500 }
    >
      { !noIcon && <span>Ic</span> }
      { item.text }
    </chakra.li>
  );
};

export default React.memo(NavLink);
