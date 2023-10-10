import type { PopoverContentProps } from '@chakra-ui/react';
import { Flex, Icon, Text, Popover, PopoverBody, PopoverContent, PopoverTrigger, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east-mini.svg';

import SortingList from './SortingList';

interface Props<K extends string, T extends string> {
  contentProps?: PopoverContentProps;
  items: Array<{ key: K; title: string }>;
  value: T;
  onChange: (newValue: T) => void;
}

const PopoverCompactSorting = <K extends string, T extends string>({ contentProps, items, value, onChange }: Props<K, T>) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const sortingColor = useColorModeValue('black', 'white');

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Flex fontSize={ 14 } color={ textColor } onClick={ onToggle } cursor="pointer">
Sort by <Text ml={ 1 } color={ sortingColor } fontWeight={ 500 }>{ value }</Text>
          <Icon
            as={ arrowIcon }
            transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }
            transitionDuration="faster"
            boxSize={ 5 }
            ml={ 1 }
          />
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="200px" { ...contentProps }>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <SortingList items={ items } onChange={ onChange } value={ value }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverCompactSorting;
