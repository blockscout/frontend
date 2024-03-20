import { Flex, chakra } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAccount } from 'wagmi';

import useIsMobile from 'lib/hooks/useIsMobile';

import Web3ModalProvider from '../Web3ModalProvider';

const GetitAdPlugin = dynamic(() => import('getit-sdk').then(module => module.GetitAdPlugin), { ssr: false });

const GETIT_API_KEY = 'ZmGXVvwYUAW4yXL8RzWQHNKmpSyQmt3TDXsXUxqFqXPdoaiSSFyca3BOyunDcWdyOwTkX3UVVQel28qbjoOoWPxYVpPdNzbUNkAHyFyJX7Lk9TVcPDZKTQmwHlSMzO3a';

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
