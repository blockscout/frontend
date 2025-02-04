import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import Popover from 'ui/shared/chakra/Popover';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserWalletDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const walletMenu = useDisclosure();

  const web3Wallet = useWeb3Wallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(web3Wallet.isConnected);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending =
    (web3Wallet.isConnected && web3AccountWithDomain.isLoading) ||
    (!web3Wallet.isConnected && web3Wallet.isOpen);

  const handleOpenWalletClick = React.useCallback(() => {
    web3Wallet.openModal();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  const handleDisconnectClick = React.useCallback(() => {
    web3Wallet.disconnect();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  return (
    <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ walletMenu.isOpen } onClose={ walletMenu.onClose }>
      <PopoverTrigger>
        <UserWalletButton
          size={ buttonSize }
          variant={ buttonVariant }
          onClick={ web3Wallet.isConnected ? walletMenu.onOpen : web3Wallet.openModal }
          address={ web3AccountWithDomain.address }
          domain={ web3AccountWithDomain.domain }
          isPending={ isPending }
          isAutoConnectDisabled={ isAutoConnectDisabled }
        />
      </PopoverTrigger>
      { web3AccountWithDomain.address && (
        <PopoverContent w="235px">
          <PopoverBody>
            <UserWalletMenuContent
              address={ web3AccountWithDomain.address }
              domain={ web3AccountWithDomain.domain }
              isAutoConnectDisabled={ isAutoConnectDisabled }
              isReconnecting={ web3Wallet.isReconnecting }
              onOpenWallet={ handleOpenWalletClick }
              onDisconnect={ handleDisconnectClick }
            />
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

export default React.memo(UserWalletDesktop);
