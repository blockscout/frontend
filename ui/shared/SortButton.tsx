import { Icon, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import upDownArrow from 'icons/arrows/up-down.svg';

type Props = {
  handleSort: () => void;
  isSortActive: boolean;
  className?: string;
}

const SortButton = ({ handleSort, isSortActive, className }: Props) => {
  return (
    <IconButton
      icon={ <Icon as={ upDownArrow } boxSize={ 5 }/> }
      aria-label="sort"
      size="sm"
      variant="outline"
      colorScheme="gray-dark"
      minWidth="36px"
      onClick={ handleSort }
      isActive={ isSortActive }
      className={ className }
    />
  );
};

export default chakra(SortButton);
