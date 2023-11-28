import { Flex, Icon, Popover, PopoverBody, PopoverContent, PopoverTrigger, VStack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import caretDownIcon from 'icons/arrows/caret-down.svg';
import { useYlide } from 'lib/contexts/ylide';
import { walletsMeta } from 'lib/contexts/ylide/constants';
import shortenString from 'lib/shortenString';

import AddressEntity from '../entities/address/AddressEntity';

export interface SelectAccountDropdownProps {
  value: DomainAccount | undefined;
  onChange: (newValue: DomainAccount | undefined) => void;
}

const SelectAccountDropdown = ({ value, onChange }: SelectAccountDropdownProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { accounts: { domainAccounts } } = useYlide();

  const hoveredBackgroundColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const clickHandlers = useMemo(() => {
    return domainAccounts.reduce((acc, option) => {
      acc[option.account.address] = () => {
        onChange(option);
        onClose();
      };
      return acc;
    }, {} as Record<string, () => void>);
  }, [ domainAccounts, onChange, onClose ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Flex onClick={ onToggle } flexDir="row" align="center" cursor="pointer" _hover={{ color: 'link_hovered' }}>
          { value ? (
            <Flex flexDir="row" align="center">
              { shortenString(value.account.address) } ({ walletsMeta[value.wallet.wallet()].title })
            </Flex>
          ) : (
            <>
No account selected
            </>
          ) }  <Icon boxSize={ 3 } ml={ 1 } as={ caretDownIcon }/>
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="400px">
        <PopoverBody >
          <VStack align="stretch" gap={ 0 }>
            { domainAccounts.map((acc) => (
              <Flex
                _hover={{ backgroundColor: hoveredBackgroundColor }}
                paddingY={ 2 }
                key={ acc.account.address }
                borderRadius="5px"
                paddingX={ 2 }
                flexDir="row"
                cursor="pointer"
                onClick={ clickHandlers[acc.account.address] }
                pointerEvents={ value === acc ? 'none' : 'auto' }
                opacity={ value === acc ? 0.5 : 1 }
              >
                <Flex grow={ 1 } maxW="380px" align="center" flexDir="row">
                  <AddressEntity address={{ hash: acc.account.address }} maxW="360px" noCopy/>
                </Flex>
              </Flex>
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SelectAccountDropdown;
