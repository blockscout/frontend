import { Button, Divider, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import delay from 'lib/delay';
import useWeb3Wallet from 'lib/web3/useWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

import useWeb3AccountWithDomain from './useWeb3AccountWithDomain';

interface Props {
  onClose?: () => void;
}

const ProfileMenuWallet = ({ onClose }: Props) => {
  const web3Wallet = useWeb3Wallet({ source: 'Header' });

  const web3AccountWithDomain = useWeb3AccountWithDomain(true);

  const handleConnectWalletClick = React.useCallback(async() => {
    web3Wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ web3Wallet, onClose ]);

  const handleOpenWalletClick = React.useCallback(async() => {
    web3Wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ web3Wallet, onClose ]);

  if (web3Wallet.isConnected && web3AccountWithDomain.address) {
    return (
      <>
        <Divider/>
        <Flex alignItems="center" columnGap={ 2 } py="14px">
          <AddressEntity
            address={{ hash: web3AccountWithDomain.address, ens_domain_name: web3AccountWithDomain.domain }}
            isLoading={ web3AccountWithDomain.isLoading }
            isTooltipDisabled
            truncation="dynamic"
            fontSize="sm"
            fontWeight={ 700 }
          />
          <IconButton
            aria-label="Open wallet"
            icon={ <IconSvg name="gear_slim" boxSize={ 5 }/> }
            variant="simple"
            color="icon_info"
            boxSize={ 5 }
            onClick={ handleOpenWalletClick }
            isLoading={ web3Wallet.isOpen }
            flexShrink={ 0 }
          />
        </Flex>
        <Divider/>
      </>
    );
  }

  return (
    <Button
      size="sm"
      onClick={ handleConnectWalletClick }
      isLoading={ web3Wallet.isOpen }
      loadingText="Connect Wallet"
      w="100%"
      my={ 2 }
    >
        Connect Wallet
    </Button>
  );
};

export default React.memo(ProfileMenuWallet);
