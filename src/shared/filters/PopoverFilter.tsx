// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import FilterButton from 'src/shared/filters/FilterButton';

import type { PopoverContentProps } from 'src/toolkit/chakra/popover';
import { PopoverBody, PopoverContent, PopoverTrigger, PopoverRoot } from 'src/toolkit/chakra/popover';

interface Props {
  appliedFiltersNum?: number;
  children: React.ReactNode;
  contentProps?: PopoverContentProps;
  isLoading?: boolean;
}

const PopoverFilter = ({ appliedFiltersNum, children, contentProps, isLoading }: Props) => {
  return (
    <PopoverRoot>
      <PopoverTrigger className="group">
        <FilterButton
          appliedFiltersNum={ appliedFiltersNum }
          isLoading={ isLoading }
        />
      </PopoverTrigger>
      <PopoverContent { ...contentProps }>
        <PopoverBody display="flex" flexDir="column" rowGap={ 5 }>
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(PopoverFilter);
