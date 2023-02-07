import type { As } from '@chakra-ui/react';
import { Box, Button, Circle, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import filterIcon from 'icons/filter.svg';

const FilterIcon = <Icon as={ filterIcon } boxSize={ 5 } mr={{ base: 0, lg: 2 }}/>;

interface Props {
  isActive?: boolean;
  appliedFiltersNum?: number;
  onClick: () => void;
  as?: As;
}

const FilterButton = ({ isActive, appliedFiltersNum, onClick, as }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const badgeColor = useColorModeValue('white', 'black');
  const badgeBgColor = useColorModeValue('blue.700', 'gray.50');

  return (
    <Button
      ref={ ref }
      rightIcon={ appliedFiltersNum ? <Circle bg={ badgeBgColor } size={ 5 } color={ badgeColor }>{ appliedFiltersNum }</Circle> : undefined }
      size="sm"
      fontWeight="500"
      variant="outline"
      colorScheme="gray-dark"
      onClick={ onClick }
      isActive={ isActive }
      px={ 1.5 }
      flexShrink={ 0 }
      as={ as }
    >
      { FilterIcon }
      <Box display={{ base: 'none', lg: 'block' }}>Filter</Box>
    </Button>
  );
};

export default React.forwardRef(FilterButton);
