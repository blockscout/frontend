import { Icon, MenuItem } from '@chakra-ui/react';
import type { FunctionComponent, SVGAttributes } from 'react';
import React, { useCallback } from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import starFilledIcon from 'icons/star_filled.svg';

type Props = {
  id: string;
  onClick: (category: string) => void;
}

const ICONS: Record<string, FunctionComponent<SVGAttributes<SVGElement>>> = {
  [MarketplaceCategory.FAVORITES]: starFilledIcon,
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
      { id in ICONS && <Icon mr={ 3 } as={ ICONS[id] } w={ 4 } h={ 4 } color="blackAlpha.800"/> }
      { id }
    </MenuItem>
  );
};

export default MarketplaceCategoriesMenuItem;
