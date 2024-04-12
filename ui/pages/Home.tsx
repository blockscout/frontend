import { Box, Heading, Flex, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

import config from 'configs/app';
import LatestBlocks from 'ui/home/LatestBlocks';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rollupFeature = config.features.rollup;

const Home = () => {
  const [ isBlockSelected, setIsBlockSelected ] = useState(true);
  return (
    <Box as="main" w="100%" >
      <Box
        w={{ base: '90%', md: '100%' }}
        maxWidth="1360px"
        mx="auto"
        px="3em"
        my="3em"
        background="black"
        borderRadius="24px"
        padding={{ base: '24px', lg: '48px' }}
        minW={{ base: '300px', lg: '900px' }}
        data-label="hero plate"
      >
        <Flex mb={{ base: 6, lg: 8 }} justifyContent="center" alignItems="center">
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'xl' }}
            lineHeight={{ base: '32px', lg: '50px' }}
            fontWeight={ 600 }
            // fontSize="72px"
            bgGradient="linear(to-r, #FFFFFF 25.04%, rgba(255, 255, 255, 0) 137.07%)"
            bgClip="text"
            color="transparent"
          >
            { config.chain.name } Explorer
          </Heading>
          <Box display={{ base: 'none', lg: 'flex' }}>
            { config.features.account.isEnabled && <ProfileMenuDesktop isHomePage/> }
            { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop isHomePage/> }
          </Box>
        </Flex>
        <SearchBar isHomepage/>
      </Box>
      <Box backgroundColor="white" roundedTop="2em" h="100%" p="3em" boxShadow="lg">
        <Box my="1.5em" display="flex" gap="10px" >
          { /* eslint-disable-next-line react/jsx-no-bind */ }
          <Button onClick={ () => setIsBlockSelected(true) }
            backgroundColor={ isBlockSelected ? 'black' : '#F4F4F4' }
            color={ isBlockSelected ? 'white' : 'black' }
            _hover={{
              backgroundColor: 'black',
              color: 'white',
            }}
            fontSize="12px"
            borderRadius="1.7em"
            padding="1.5em"
          >
                  LATEST BLOCKS
          </Button>
          { /* eslint-disable-next-line react/jsx-no-bind */ }
          <Button onClick={ () => setIsBlockSelected(false) }
            backgroundColor={ !isBlockSelected ? 'black' : '#F4F4F4' }
            color={ !isBlockSelected ? 'white' : 'black' }
            _hover={{
              backgroundColor: 'black',
              color: 'white',
            }}
            fontSize="12px"
            borderRadius="1.7em"
            padding="1.5em">
                  LATEST TRANSACTIONS
          </Button>
        </Box>
        <LatestBlocks/>
      </Box>
      { /*<Stats/>*/ }
      { /*<ChainIndicators/>*/ }
      { /*<AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>*/ }
      { /*<Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>*/ }
      { /*  { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }*/ }
      { /*  <Box flexGrow={ 1 }>*/ }
      { /*    <Transactions/>*/ }
      { /*  </Box>*/ }
      { /*</Flex>*/ }
    </Box>
  );
};

export default Home;
