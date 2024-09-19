import { Button, Divider, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import delay from 'lib/delay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

import useWallet from '../walletMenu/useWallet';
import useWeb3AccountWithDomain from './useWeb3AccountWithDomain';

interface Props {
  onClose?: () => void;
}

const ProfileMenuWallet = ({ onClose }: Props) => {
  const wallet = useWallet({ source: 'Header' });

  const web3AccountWithDomain = useWeb3AccountWithDomain(true);

  const handleConnectWalletClick = React.useCallback(async() => {
    wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ wallet, onClose ]);

  const handleOpenWalletClick = React.useCallback(async() => {
    wallet.openModal();
    await delay(300);
    onClose?.();
  }, [ wallet, onClose ]);

  if (wallet.isWalletConnected && web3AccountWithDomain.address) {
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
            isLoading={ wallet.isModalOpening }
            flexShrink={ 0 }
          />
        </Flex>
        <Divider/>
      </>
    );
  }

  const isLoading = wallet.isModalOpening || wallet.isModalOpen;

  return (
    <Button
      size="sm"
      onClick={ handleConnectWalletClick }
      isLoading={ isLoading }
      loadingText="Connect Wallet"
      w="100%"
      my={ 2 }
    >
        Connect Wallet
    </Button>
  );
};

export default React.memo(ProfileMenuWallet);
