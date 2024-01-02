import { Flex, chakra } from '@chakra-ui/react';
import { Banner, useIdentity, Environment, HypeLab, HypeLabContext } from 'hypelab-react';
import React from 'react';
import { useAccount } from 'wagmi';

import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

const HypeBannerContent = ({ className }: { className?: string }) => {

  return (
    <>
      <Flex className={ className } h="90px" display={{ base: 'none', lg: 'flex' }}>
        <Banner placement="771e47c10c"/>
      </Flex>
      <Flex className={ className } h="50px" display={{ base: 'flex', lg: 'none' }}>
        <Banner placement="64412f33ad"/>
      </Flex>
    </>
  );
};

const HypeBannerWithWalletAddress = ({ className }: { className?: string }) => {
  const { address } = useAccount();
  const { setWalletAddresses } = useIdentity();
  if (address) {
    setWalletAddresses([ address ]);
  }

  return <HypeBannerContent className={ className }/>;
};

const HypeBanner = ({ className }: { className?: string }) => {
  const client = new HypeLab({
    URL: 'https://api.hypelab-staging.com',
    // URL: 'https://api.hypelab.com', /* Production URL */
    propertySlug: 'baaded78c2',
    environment: Environment.Development,
    // environment: Environment.Production /* Production Environment */
  });

  const fallback = React.useCallback(() => {
    return <HypeBannerContent className={ className }/>;
  }, [ className ]);

  return (
    <HypeLabContext client={ client }>
      <Web3ModalProvider fallback={ fallback }>
        <HypeBannerWithWalletAddress className={ className }/>
      </Web3ModalProvider>
    </HypeLabContext>
  );
};

export default chakra(HypeBanner);
