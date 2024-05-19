/* eslint-disable */

import { Box, Heading, Flex, useColorModeValue, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button, } from "@chakra-ui/react";
import React, { useState } from "react";

import config from "configs/app";
import LatestBlocks from "ui/home/LatestBlocks";
import ProfileMenuDesktop from "ui/snippets/profileMenu/ProfileMenuDesktop";
import SearchBar from "ui/snippets/searchBar/SearchBar";
import WalletMenuDesktop from "ui/snippets/walletMenu/WalletMenuDesktop";

import BWButton from "../shared/BWbutton";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rollupFeature = config.features.rollup;

type ModalStateType = {
  show: boolean;
  data: Record<string, any>;
}

const Home = () => {
  const [isBlockSelected, setIsBlockSelected] = useState(true);
  const [ isModalOpen, setIsModalOpen ] = useState<ModalStateType>({
    show: false,
    data: {
      contractAddress: ''
    },
  });
  const [isCopied, setIsCopied] = useState(false);

  const listBgColor = useColorModeValue('white', 'blue.1000');

  const fetchInscriptionData = async(inscriptionId: string) => {
    if (inscriptionId?.length !== 66) return;
    try {
      const response = await fetch(`https://explorer-api.satschain.xyz/get-contract-addresses-from-inscription-id?inscription_id=${ inscriptionId }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIsModalOpen({
          show: true,
          data: {
            contractAddress: (data as any)?.contractAddress,
          }
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    }
  };

  const onModalClose = () => {
    setIsModalOpen({
      show: false,
      data: {},
    });
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(isModalOpen?.data?.contractAddress).then(() => {
      setIsCopied(true);
      setInterval(() => {
        setIsCopied(false);
      }, 1000);
    })
  }

  return (
    <Box as="main" w="100%">
      <Box
        w={{ base: "90%", md: "100%" }}
        maxWidth="1360px"
        mx="auto"
        px="3em"
        my="3em"
        background="black"
        borderRadius="24px"
        padding={{ base: "24px", lg: "48px" }}
        minW={{ base: "300px", lg: "900px" }}
        data-label="hero plate"
      >
        <Flex
          mb={{ base: 6, lg: 8 }}
          justifyContent="center"
          alignItems="center"
        >
          <Heading
            as="h1"
            size={{ base: "md", lg: "xl" }}
            lineHeight={{ base: "32px", lg: "50px" }}
            fontWeight={600}
            // fontSize="72px"
            bgGradient="linear(to-r, #FFFFFF 25.04%, rgba(255, 255, 255, 0) 137.07%)"
            bgClip="text"
            color="transparent"
          >
            {config.chain.name} Explorer
          </Heading>
          <Box display={{ base: "none", lg: "flex" }}>
            {config.features.account.isEnabled && (
              <ProfileMenuDesktop isHomePage />
            )}
            {config.features.blockchainInteraction.isEnabled && (
              <WalletMenuDesktop isHomePage />
            )}
          </Box>
        </Flex>
        <SearchBar isHomepage onSubmit={fetchInscriptionData} />
      </Box>
      <Box
        backgroundColor={listBgColor}
        roundedTop="2em"
        h="100%"
        p="3em"
        boxShadow="lg"
      >
        <Box my="1.5em" display="flex" gap="10px">
          {/* eslint-disable-next-line react/jsx-no-bind */}

          <BWButton
            active={isBlockSelected}
            onClick={() => setIsBlockSelected(true)}
          >
            LATEST BLOCKS
          </BWButton>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <BWButton
            onClick={() => setIsBlockSelected(false)}
            active={!isBlockSelected}
          >
            LATEST TRANSACTIONS
          </BWButton>
        </Box>
        <LatestBlocks />
      </Box>
      {/*<Stats/>*/}
      {/*<ChainIndicators/>*/}
      {/*<AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>*/}
      {/*<Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>*/}
      {/*  { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }*/}
      {/*  <Box flexGrow={ 1 }>*/}
      {/*    <Transactions/>*/}
      {/*  </Box>*/}
      {/*</Flex>*/}
      <Modal isOpen={ isModalOpen.show } onClose={ onModalClose }>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Contract Address</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Flex direction={'column'} 
            gap={'.5rem'}>
              <Box>Below is the Address associated with the given inscription</Box>
              <Box onClick={copyAddress} border={'1px'} borderColor={'lightgray'} borderRadius={4} paddingX={'6px'} paddingY={'4px'} cursor={'pointer'}>
                {isCopied ? 'Copied' : `${isModalOpen?.data?.contractAddress}`} 
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button mr={ 3 } onClick={ onModalClose }>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
