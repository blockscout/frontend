import type {
  PopoverContentProps } from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  Box,
  useColorModeValue,
  VStack,
  Flex,
} from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import checkIcon from 'icons/check.svg';
import { useYlide } from 'lib/contexts/ylide';

import Icon from '../chakra/Icon';
import AddressEntity from '../entities/address/AddressEntity';

interface Props {
  children: React.ReactNode;
  marks: Array<string> | null;
  title?: string;
  showUnauthorizedAccounts?: boolean;
  onSelect?: (account: DomainAccount) => void;
  accountsFilter?: (account: DomainAccount) => boolean;
  contentProps?: PopoverContentProps;
}

const PopoverByAccount = ({ marks, title, children, onSelect, accountsFilter, showUnauthorizedAccounts, contentProps }: Props) => {
  const { accounts: { domainAccounts } } = useYlide();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const accounts = useMemo(() => {
    const accs = domainAccounts.filter(a => showUnauthorizedAccounts ? true : Boolean(a.backendAuthKey));
    if (accountsFilter) {
      return accs.filter(accountsFilter);
    }
    return accs;
  }, [ domainAccounts, accountsFilter, showUnauthorizedAccounts ]);

  const hoveredBackgroundColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

  const clickHandlers = useMemo(() => {
    return accounts.reduce((acc, option) => {
      acc[option.account.address] = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onSelect?.(option);
        onClose();
      };
      return acc;
    }, {} as Record<string, (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>);
  }, [ accounts, onSelect, onClose ]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (accounts.length === 1) {
      onSelect?.(accounts[0]);
    } else {
      onToggle();
    }
  }, [ onToggle, accounts, onSelect ]);

  return accounts.length ? (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Box onClick={ handleClick }>{ children }</Box>
      </PopoverTrigger>
      <PopoverContent w="400px" { ...contentProps }>
        <PopoverBody >
          { title ? (
            <Flex fontSize={ 16 } mb={ 2 } fontWeight="medium">
              { title }
            </Flex>
          ) : null }
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
              >
                <Flex grow={ 1 } maxW="320px" align="center" flexDir="row">
                  <AddressEntity address={{ hash: acc.account.address }} maxW="304px" noCopy noLink/>
                </Flex>
                <Flex flexDir="row" align="center" justify="flex-end" flexBasis={ 40 } ml={ 2 }>
                  { marks?.includes(acc.account.address) ? (
                    <Icon boxSize={ 5 } as={ checkIcon } color="green.500"/>
                  ) : null }
                </Flex>
              </Flex>
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : null;
};

export default React.memo(PopoverByAccount);
