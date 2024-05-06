import { Flex, chakra } from '@chakra-ui/react';
import { Banner, setWalletAddresses } from '@hypelab/sdk-react';
import Script from 'next/script';
import React from 'react';

import useAccount from 'lib/web3/useAccount';

import { hypeInit } from './hypeBannerScript';

const DESKTOP_BANNER_SLUG = 'b1559fc3e7';
const MOBILE_BANNER_SLUG = '668ed80a9e';

const HypeBanner = ({ className }: { className?: string }) => {
  const { address } = useAccount();

  React.useEffect(() => {
    if (address) {
      setWalletAddresses([ address ]);
    }
  }, [ address ]);

  return (
    <>
      <Script
        id="hypelab"
        strategy="afterInteractive"
      >{ hypeInit }</Script>
      <Flex className={ className } h="90px" display={{ base: 'none', lg: 'flex' }}>
        <Banner placement={ DESKTOP_BANNER_SLUG }/>
      </Flex>
      <Flex className={ className } h="50px" display={{ base: 'flex', lg: 'none' }}>
        <Banner placement={ MOBILE_BANNER_SLUG }/>
      </Flex>
    </>
  );
};

export default chakra(HypeBanner);
