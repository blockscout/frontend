import React from 'react';

import { MenuItem as MenuItemChakra } from 'toolkit/chakra/menu';

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  value: string;
  isDisabled?: boolean;
}

const MenuItem = ({ className, children, onClick, value, isDisabled }: Props) => {
  return (
    <MenuItemChakra className={ className } onClick={ onClick } disabled={ isDisabled } value={ value }>
      { children }
    </MenuItemChakra>
  );
};

export default MenuItem;
