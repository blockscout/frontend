import { Flex, Icon, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import caretDownIcon from 'icons/arrows/caret-down.svg';
import { blockchainMeta } from 'lib/contexts/ylide/constants';

export interface SelectBlockchainDropdownProps {
  options: Array<string>;
  value: string;
  onChange: (newValue: string) => void;
}

const SelectBlockchainDropdown = ({ options, value, onChange }: SelectBlockchainDropdownProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const hoveredBackgroundColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const clickHandlers = useMemo(() => {
    return options.reduce((acc, option) => {
      acc[option] = () => {
        onChange(option);
        onClose();
      };
      return acc;
    }, {} as Record<string, () => void>);
  }, [ options, onChange, onClose ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Flex onClick={ onToggle } flexDir="row" align="center" cursor="pointer" _hover={{ color: 'link_hovered' }}>
          { value ? (
            <>
			Send via <Text as="span" ml={ 1 } fontWeight="700" color="inherit">{ blockchainMeta[value].title }</Text>
            </>
          ) : (
            <>
			No chain selected
            </>
          ) }  <Icon boxSize={ 3 } ml={ 1 } as={ caretDownIcon }/>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="200px">
        <PopoverBody >
          <VStack align="stretch" gap={ 0 }>
            { options.map((option) => (
              <Flex
                _hover={{ backgroundColor: hoveredBackgroundColor }}
                paddingY={ 2 }
                key={ option }
                borderRadius="5px"
                paddingX={ 2 }
                flexDir="row"
                cursor="pointer"
                onClick={ clickHandlers[option] }
                pointerEvents={ value === option ? 'none' : 'auto' }
                opacity={ value === option ? 0.5 : 1 }
              >
                <Flex grow={ 1 } align="center" flexDir="row">
                  <Flex align="center" justify="center" mr={ 3 }>{ blockchainMeta[option].logo(16) }</Flex>
                  { blockchainMeta[option].title }
                </Flex>
              </Flex>
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SelectBlockchainDropdown;
