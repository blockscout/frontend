import type { As } from '@chakra-ui/react';
import { Box, Button, Circle, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

const FilterIcon = <IconSvg name="filter" boxSize={ 5 } ml={{ base: 0, lg: 2 }}/>;

interface Props {
  isActive?: boolean;
  isLoading?: boolean;
  appliedFiltersNum?: number;
  onClick: () => void;
  as?: As;
}

const FilterButton = ({ isActive, isLoading, appliedFiltersNum, onClick, as }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const badgeColor = useColorModeValue('white', 'black');
  const badgeBgColor = useColorModeValue('blue.700', 'gray.50');

  if (isLoading) {
    return <Skeleton w={{ base: 9, lg: '78px' }} h={ 8 } borderRadius="base" flexShrink={ 0 }/>;
  }

  const num = (
    <Circle
      className="AppliedFiltersNum"
      bg={ isActive ? 'link_hovered' : badgeBgColor }
      size={ 5 }
      color={ badgeColor }
    >
      { appliedFiltersNum }
    </Circle>
  );

  return (
    <Button
      ref={ ref }
      rightIcon={ appliedFiltersNum ? num : undefined }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onClick }
      isActive={ isActive }
      data-selected={ Boolean(appliedFiltersNum) }
      as={ as }
      px="12px"
      py="8px"
      fontWeight={400}
      pointerEvents="all"
      _hover={ isActive ? {
        color: 'white',
        '.AppliedFiltersNum': {
          bg: 'link_hovered',
        },
      } : undefined }
    >
      <Box display={{ base: 'none', lg: 'block' }}>Filter</Box>
      { FilterIcon }
    </Button>
  );
};

export default React.forwardRef(FilterButton);
