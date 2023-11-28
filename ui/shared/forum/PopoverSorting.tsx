import type { PopoverContentProps } from '@chakra-ui/react';
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import SortButton from '../sort/SortButton';
import SortingList from './SortingList';

interface Props<K extends string, T extends string> {
  isActive: boolean;
  contentProps?: PopoverContentProps;
  items: Array<{ key: K; title: string }>;
  value: T;
  onChange: (newValue: T) => void;
}

const PopoverSorting = <K extends string, T extends string>({ isActive, contentProps, items, value, onChange }: Props<K, T>) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <SortButton onClick={ onToggle } isActive={ isOpen || isActive }/>
      </PopoverTrigger>
      <PopoverContent { ...contentProps }>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <SortingList items={ items } onChange={ onChange } value={ value }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverSorting;
