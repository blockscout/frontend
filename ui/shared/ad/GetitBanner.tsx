import { Flex, chakra } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import useAccount from 'lib/web3/useAccount';

const GetitAdPlugin = dynamic(() => import('getit-sdk').then(module => module.GetitAdPlugin), { ssr: false });

const GETIT_API_KEY = 'ZmGXVvwYUAW4yXL8RzWQHNKmpSyQmt3TDXsXUxqFqXPdoaiSSFyca3BOyunDcWdyOwTkX3UVVQel28qbjoOoWPxYVpPdNzbUNkAHyFyJX7Lk9TVcPDZKTQmwHlSMzO3a';

const GetitBanner = ({ className, platform }: BannerProps) => {
  const isMobile = Boolean(useIsMobile());
  const { address } = useAccount();

  return (
    <Flex className={ className } h="90px" w={{ base: '270px', lg: platform === 'mobile' ? '270px' : undefined }}>
      <GetitAdPlugin
        key={ isMobile.toString() }
        apiKey={ GETIT_API_KEY }
        walletConnected={ address ? address : '' }
        isMobile={ platform === 'mobile' || isMobile }
        slotId="0"
      />
    </Flex>
  );
};

export default chakra(GetitBanner);
