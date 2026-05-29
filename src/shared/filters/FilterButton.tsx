// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Circle } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { ButtonProps } from 'src/toolkit/chakra/button';
import { Button } from 'src/toolkit/chakra/button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props extends ButtonProps {
  isLoading?: boolean;
  appliedFiltersNum?: number;
}

const FilterButton = ({ isLoading, appliedFiltersNum, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  if (isLoading) {
    return <Skeleton loading w={{ base: 9, lg: '78px' }} h={ 8 } borderRadius="base" flexShrink={ 0 }/>;
  }

  const numElement = appliedFiltersNum ? (
    <Circle
      className="AppliedFiltersNum"
      size={ 5 }
      bg="selected.control.text"
      color={{ _light: 'white', _dark: 'black' }}
      _groupHover={{
        bg: 'hover',
      }}
      _groupExpanded={{
        bg: 'hover',
      }}
    >
      { appliedFiltersNum }
    </Circle>
  ) : null;

  return (
    <Button
      ref={ ref }
      size="sm"
      fontWeight="medium"
      gap={ 1 }
      variant="dropdown"
      selected={ Boolean(appliedFiltersNum) }
      flexShrink={ 0 }
      pointerEvents="all"
      px={{ base: 1, lg: 3 }}
      { ...rest }
    >
      <SpriteIcon name="filter" boxSize={ 5 }/>
      <Box display={{ base: 'none', lg: 'block' }}>Filter</Box>
      { numElement }
    </Button>
  );
};

export default React.forwardRef(FilterButton);
