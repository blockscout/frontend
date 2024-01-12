import { MenuItem } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  id: string;
  onClick: (category: string) => void;
}

const ICONS: Record<string, IconName> = {
  [MarketplaceCategory.FAVORITES]: 'star_filled',
};

const MarketplaceCategoriesMenuItem = ({ id, onClick }: Props) => {
  const handleSelection = useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  return (
    <MenuItem
      key={ id }
      onClick={ handleSelection }
      display="flex"
      alignItems="center"
    >
      { id in ICONS && <IconSvg mr={ 3 } name={ ICONS[id] } w={ 4 } h={ 4 } color="blackAlpha.800"/> }
      { id }
    </MenuItem>
  );
};

export default MarketplaceCategoriesMenuItem;
