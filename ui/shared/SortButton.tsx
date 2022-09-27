import { Icon, IconButton } from '@chakra-ui/react';
import React from 'react';

import upDownArrow from 'icons/arrows/up-down.svg';

type Props = {
  handleSort: () => void;
  isSortActive: boolean;
}

const SortButton = ({ handleSort, isSortActive }: Props) => {
  return (
    <IconButton
      icon={ <Icon as={ upDownArrow } boxSize={ 5 }/> }
      aria-label="sort"
      size="sm"
      variant="outline"
      colorScheme="gray-dark"
      ml={ 2 }
      minWidth="36px"
      onClick={ handleSort }
      isActive={ isSortActive }
    />
  );
};

export default SortButton;
