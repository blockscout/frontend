import type { PopoverContentProps } from '@chakra-ui/react';
import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import FilterButton from 'ui/shared/filters/FilterButton';

interface Props {
  appliedFiltersNum?: number;
  children: React.ReactNode;
  contentProps?: PopoverContentProps;
  isLoading?: boolean;
}

const PopoverFilter = ({ appliedFiltersNum, children, contentProps, isLoading }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <FilterButton
          isActive={ isOpen }
          onClick={ onToggle }
          appliedFiltersNum={ appliedFiltersNum }
          isLoading={ isLoading }
        />
      </PopoverTrigger>
      <PopoverContent { ...contentProps }>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          { children }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(PopoverFilter);
