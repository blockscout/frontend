import { Icon, MenuItem } from '@chakra-ui/react';
import type { FunctionComponent, SVGAttributes } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceCategoriesIds } from 'types/client/apps';

import starFilledIcon from 'icons/star_filled.svg';

type Props = {
  id: MarketplaceCategoriesIds;
  name: string;
  onClick: (category: MarketplaceCategoriesIds) => void;
}

const ICONS = {
  favorites: starFilledIcon,
} as { [key in MarketplaceCategoriesIds]: FunctionComponent<SVGAttributes<SVGElement>> };

const CategoriesMenuItem = ({ id, name, onClick }: Props) => {
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
      { id in ICONS && (
        <Icon mr={ 3 } as={ ICONS[id] } w={ 4 } h={ 4 } color="blackAlpha.800"/>
      ) }

      { name }
    </MenuItem>
  );
};

export default CategoriesMenuItem;
