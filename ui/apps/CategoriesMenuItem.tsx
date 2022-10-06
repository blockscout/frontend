import { MenuItem } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { MarketplaceCategoriesIds } from 'types/client/apps';

type Props = {
  id: MarketplaceCategoriesIds;
  name: string;
  onClick: (category: MarketplaceCategoriesIds) => void;
}

const CategoriesMenuItem = ({ id, name, onClick }: Props) => {
  const handleSelection = useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  return (
    <MenuItem
      key={ id }
      onClick={ handleSelection }
    >
      { name }
    </MenuItem>
  );
};

export default CategoriesMenuItem;
