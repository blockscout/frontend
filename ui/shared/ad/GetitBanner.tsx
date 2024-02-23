import { Flex, chakra } from '@chakra-ui/react';
import { GetitAdPlugin } from 'getit-sdk';
import React from 'react';
import { useAccount } from 'wagmi';

import useIsMobile from 'lib/hooks/useIsMobile';

import Web3ModalProvider from '../Web3ModalProvider';

const GETIT_API_KEY = 'ZFapehuaQQVIVZIjPGlAG6lffqp8EBVCxkkRik3t04EgABF5TyH0GvByhnBBl32uw5wACnMjeT8wHP80UqYkHof0o0bW6J9gY08LuKX0mL2Dj3oR4pB5Bp39tX0zHoVP';

const GetitBannerContent = ({ address, className }: { address?: string; className?: string }) => {
  const isMobile = Boolean(useIsMobile());
  return (
    <Flex className={ className } h="90px">
      <GetitAdPlugin
        key={ isMobile.toString() }
        apiKey={ GETIT_API_KEY }
        walletConnected={ address ? address : '' }
        isMobile={ isMobile }
        slotId="0"
      />
    </Flex>
  );
};

const GetitBannerWithWalletAddress = ({ className }: { className?: string }) => {
  const { address } = useAccount();

  return <GetitBannerContent address={ address } className={ className }/>;
};

const GetitBanner = ({ className }: { className?: string }) => {
  const fallback = React.useCallback(() => {
    return <GetitBannerContent className={ className }/>;
  }, [ className ]);

  return (
    <Web3ModalProvider fallback={ fallback }>
      <GetitBannerWithWalletAddress className={ className }/>
    </Web3ModalProvider>
  );
};

export default chakra(GetitBanner);
