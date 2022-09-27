import { Button, Circle, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import filterIcon from 'icons/filter.svg';

const FilterIcon = <Icon as={ filterIcon } boxSize={ 5 }/>;

interface Props {
  isActive: boolean;
  isCollapsed?: boolean;
  appliedFiltersNum?: number;
  onClick: () => void;
}

const FilterButton = ({ isActive, appliedFiltersNum, onClick, isCollapsed }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const badgeColor = useColorModeValue('white', 'black');
  const badgeBgColor = useColorModeValue('blue.700', 'gray.50');

  return (
    <Button
      ref={ ref }
      leftIcon={ isCollapsed ? undefined : FilterIcon }
      rightIcon={ appliedFiltersNum ? <Circle bg={ badgeBgColor } size={ 5 } color={ badgeColor }>{ appliedFiltersNum }</Circle> : undefined }
      size="sm"
      fontWeight="500"
      variant="outline"
      colorScheme="gray-dark"
      onClick={ onClick }
      isActive={ isActive }
      px={ 1.5 }
      flexShrink={ 0 }
    >
      { isCollapsed ? FilterIcon : 'Filter' }
    </Button>
  );
};

export default React.forwardRef(FilterButton);
