import {
  Flex, Button, Icon, Text, chakra, Popover, PopoverTrigger, PopoverBody,
  PopoverContent, useDisclosure, VStack, useColorModeValue, Box,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import arrowIcon from 'icons/arrows/east-mini.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import logoutIcon from 'icons/logout.svg';
import plusIcon from 'icons/plus.svg';
import { useYlide } from 'lib/contexts/ylide';
import useIsMobile from 'lib/hooks/useIsMobile';
import shortenString from 'lib/shortenString';
import { YlideConnectAccountModal } from 'ui/connectAccountModal';
import { SelectWalletModal } from 'ui/selectWalletModal';

import AddressEntity from '../entities/address/AddressEntity';
import AddressIdenticon from '../entities/address/AddressIdenticon';

interface Props {
  className?: string;
}

const AccountPlate = ({ account }: { account: DomainAccount }) => {
  const router = useRouter();
  const { accounts: { disconnectAccount } } = useYlide();

  const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  const handleBookmarks = useCallback(() => {
    router.push({ pathname: '/forum/bookmarks/[hash]', query: { hash: account.account.address.toLowerCase() } });
  }, [ router, account ]);

  const handleLogout = useCallback(() => {
    disconnectAccount(account);
  }, [ account, disconnectAccount ]);

  return (
    <Flex
      flexDir="column"
      paddingX={ 2 }
      paddingY={ 4 }
      borderBottom="1px solid"
      borderColor={ borderColor }
      _last={{ borderBottom: 'none' }}
    >
      <Flex flexDir="row" fontSize={ 12 } mb={ 1 }>{ account.name }</Flex>
      <Flex flexDir="row" justify="space-between" align="center">
        <Flex flexDir="row" maxW="calc(100% - 95px)" grow={ 1 }>
          <AddressEntity address={{ hash: account.account.address, name: undefined }} noCopy/>
        </Flex>
        <Flex flexDir="row" gap={ 3 }>
          <Icon boxSize={ 5 } as={ bookmarkIcon } cursor="pointer" onClick={ handleBookmarks } _hover={{
            color: 'link_hovered',
          }}/>
          <Icon boxSize={ 5 } as={ logoutIcon } cursor="pointer" onClick={ handleLogout } _hover={{
            color: 'link_hovered',
          }}/>
        </Flex>
      </Flex>
    </Flex>
  );
};

const AccountsPopover = ({ className }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { accounts: { connectAccount, domainAccounts, selectWalletModal, accountModal } } = useYlide();
  const isMobile = useIsMobile();

  const addAccount = useCallback(() => {
    connectAccount();
  }, [ connectAccount ]);

  const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  const modals = (
    <>
      { selectWalletModal.isOpen && <SelectWalletModal { ...selectWalletModal.props }/> }
      { accountModal.isOpen && <YlideConnectAccountModal { ...accountModal.props }/> }
    </>
  );

  const button = (
    <Button
      className={ className }
      size="sm"
      variant="outline"
      onClick={ domainAccounts.length ? onToggle : addAccount }
      aria-label="Accounts popover"
      fontWeight={ 500 }
      px={ 2 }
      isActive={ false }
      borderWidth={ 1 }
      borderColor={ borderColor }
      color="inherit"
      minHeight="32px"
    >
      { domainAccounts.length ? (
        <Box mr={ 2 }>
          <AddressIdenticon
            size={ 20 }
            hash={ domainAccounts[0].account.address }
          />
        </Box>
        // <Icon as={ accountIcon } color="#505050" boxSize={ 5 } mr={ 2 }/>
      ) : null }
      { !domainAccounts.length && isMobile ? (
        <Icon as={ plusIcon } boxSize={ 4 }/>
      ) : null }
      { !isMobile ? (
        <Text as="span" color="inherit">
          { /* `${ domainAccounts.length } account${ domainAccounts.length > 1 ? 's' : '' }` */ }
          { domainAccounts.length ? shortenString(domainAccounts[0].account.address) : 'Connect wallet' }
        </Text>
      ) : null }
      { domainAccounts.length ? (
        <Icon
          as={ arrowIcon }
          transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }
          transitionDuration="faster"
          boxSize={ 5 }
          ml={ 1 }
        />
      ) : null }
    </Button>
  );

  if (domainAccounts.length === 0) {
    return <>{ modals }{ button }</>;
  }

  return (
    <>
      { modals }
      <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
        <PopoverTrigger>
          { button }
        </PopoverTrigger>
        <PopoverContent w="314px">
          <PopoverBody >
            <VStack align="stretch" gap={ 0 }>
              { domainAccounts.map((account) => (
                <AccountPlate key={ account.account.address } account={ account }/>
              )) }
              { domainAccounts.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  mt={ 2 }
                  onClick={ addAccount }
                >
              Add account
                </Button>
              ) }
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default React.memo(chakra(AccountsPopover));
