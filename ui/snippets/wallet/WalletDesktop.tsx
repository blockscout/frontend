import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import Popover from 'ui/shared/chakra/Popover';
import useWeb3AccountWithDomain from 'ui/snippets/profile/useWeb3AccountWithDomain';
import useWallet from 'ui/snippets/walletMenu/useWallet';

import WalletButton from './WalletButton';
import WalletMenuContent from './WalletMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const WalletDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const walletMenu = useDisclosure();

  const walletUtils = useWallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(walletUtils.isWalletConnected);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending =
    (walletUtils.isWalletConnected && web3AccountWithDomain.isLoading) ||
    (!walletUtils.isWalletConnected && (walletUtils.isModalOpening || walletUtils.isModalOpen));

  const handleOpenWalletClick = React.useCallback(() => {
    walletUtils.openModal();
    walletMenu.onClose();
  }, [ walletUtils, walletMenu ]);

  const handleDisconnectClick = React.useCallback(() => {
    walletUtils.disconnect();
    walletMenu.onClose();
  }, [ walletUtils, walletMenu ]);

  return (
    <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ walletMenu.isOpen } onClose={ walletMenu.onClose }>
      <PopoverTrigger>
        <WalletButton
          size={ buttonSize }
          variant={ buttonVariant }
          onClick={ walletUtils.isWalletConnected ? walletMenu.onOpen : walletUtils.openModal }
          address={ web3AccountWithDomain.address }
          domain={ web3AccountWithDomain.domain }
          isPending={ isPending }
          isAutoConnectDisabled={ isAutoConnectDisabled }
        />
      </PopoverTrigger>
      { web3AccountWithDomain.address && (
        <PopoverContent w="235px">
          <PopoverBody>
            <WalletMenuContent
              address={ web3AccountWithDomain.address }
              domain={ web3AccountWithDomain.domain }
              isAutoConnectDisabled={ isAutoConnectDisabled }
              onOpenWallet={ handleOpenWalletClick }
              onDisconnect={ handleDisconnectClick }
            />
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

export default React.memo(WalletDesktop);
