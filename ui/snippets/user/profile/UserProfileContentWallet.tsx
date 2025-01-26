import { chakra, Box, Button, Flex, IconButton, useColorModeValue, Spinner } from '@chakra-ui/react';
import React from 'react';

import delay from 'lib/delay';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Hint from 'ui/shared/Hint';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClose?: () => void;
  className?: string;
}

const UserProfileContentWallet = ({ onClose, className }: Props) => {
  const walletSnippetBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const web3Wallet = useWeb3Wallet({ source: 'Profile dropdown' });

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

  const content = (() => {
    if (web3Wallet.isConnected && web3AccountWithDomain.address) {
      return (
        <Flex alignItems="center" columnGap={ 2 } bgColor={ walletSnippetBgColor } px={ 2 } py="10px" borderRadius="base" justifyContent="space-between">
          <AddressEntity
            address={{ hash: web3AccountWithDomain.address, ens_domain_name: web3AccountWithDomain.domain }}
            isLoading={ web3AccountWithDomain.isLoading }
            isTooltipDisabled
            truncation="dynamic"
            fontSize="sm"
            fontWeight={ 500 }
            noAltHash
          />
          { web3Wallet.isReconnecting ? <Spinner size="sm" m="2px" flexShrink={ 0 }/> : (
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
          ) }
        </Flex>
      );
    }

    return (
      <Button
        size="sm"
        onClick={ handleConnectWalletClick }
        isLoading={ web3Wallet.isOpen }
        loadingText="Connect Wallet"
        w="100%"
      >
        Connect
      </Button>
    );
  })();

  return (
    <Box className={ className }>
      <Flex px={ 1 } mb="2px" fontSize="xs" alignItems="center" lineHeight={ 6 } fontWeight="500">
        <span>Connected wallet</span>
        <Hint
          label={
            web3Wallet.isConnected ?
              'This wallet is currently connected to Blockscout and used for interacting with apps and smart contracts' :
              'This wallet is used for interacting with apps and smart contracts'
          }
          boxSize={ 4 }
          ml={ 1 }
        />
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(chakra(UserProfileContentWallet));
