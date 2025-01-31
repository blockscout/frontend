import { Flex, chakra } from '@chakra-ui/react';
import { Banner, setWalletAddresses } from '@hypelab/sdk-react';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import useAccount from 'lib/web3/useAccount';

import { hypeInit } from './hypeBannerScript';

const DESKTOP_BANNER_SLUG = 'b1559fc3e7';
const MOBILE_BANNER_SLUG = '668ed80a9e';

const HypeBanner = ({ className, platform }: BannerProps) => {
  const { address } = useAccount();

  React.useEffect(() => {
    if (address) {
      setWalletAddresses([ address ]);
    }
  }, [ address ]);

  const banner = (() => {
    switch (platform) {
      case 'desktop': {
        return (
          <Flex className={ className } w="728px" h="90px">
            <Banner placement={ DESKTOP_BANNER_SLUG }/>
          </Flex>
        );
      }
      case 'mobile': {
        return (
          <Flex className={ className } w="320px" h="50px">
            <Banner placement={ MOBILE_BANNER_SLUG }/>
          </Flex>
        );
      }
      default: {
        return (
          <>
            <Flex className={ className } w="728px" h="90px" display={{ base: 'none', lg: 'flex' }}>
              <Banner placement={ DESKTOP_BANNER_SLUG }/>
            </Flex>
            <Flex className={ className } w="320px" h="50px" display={{ base: 'flex', lg: 'none' }}>
              <Banner placement={ MOBILE_BANNER_SLUG }/>
            </Flex>
          </>
        );
      }
    }
  })();

  return (
    <>
      <Script
        id="hypelab"
        strategy="afterInteractive"
      >
        { hypeInit }
      </Script>
      { banner }
    </>
  );
};

export default chakra(HypeBanner);
