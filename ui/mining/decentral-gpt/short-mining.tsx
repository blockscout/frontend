import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormErrorMessage,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import LinkExternal from '../../shared/LinkExternal';
import { useFreeH } from '../../../lib/hooks/useDecentralGPT/free/useFree';

const FixedComponent = () => {
  // dnc
  const {
    isOpen: dbcIsPledgeModalOpen,
    onOpen: dbcOnPledgeModalOpen,
    onClose: dbcOnPledgeModalClose,
  } = useDisclosure();

  const [gpuCount, setGpuCount] = useState('');
  const [machineIdentifier, setMachineIdentifier] = useState('');
  const [machinePrivateKey, setMachinePrivateKey] = useState('');
  const handlePledgeSubmitDnc = () => {
    dbcOnPledgeModalClose();
  };

  // Pledge NFT Node
  const {
    isOpen: nftIsPledgeModalOpen,
    onOpen: nftOnPledgeModalOpen,
    onClose: nftOnPledgeModalClose,
  } = useDisclosure();

  const {
    nftBtnLoading,
    startApprove,
    pledgedNftCount,
    setPledgedNftCount,
    pledgedDgcCount,
    setPledgedDgcCount,
    machineId,
    setMachineId,
    handleAddDbcToStake,
    dbcBtnLoading,
    pledgedDbcCount,
    dockerId,
    toPledgedDbcCount,
    setPledgedDbcCount,
    setDockerId,
    settoPledgedDbcCount,
  } = useFreeH(nftOnPledgeModalClose, dbcOnPledgeModalClose);

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">
          Note: Machines in the free mode can be placed anywhere. However, the network upstream bandwidth of a single
          GPU machine needs to be at least 5Mbps. For detailed rules, please; check:https://and.decentralgpt.org/rule
        </Text>
      </Box>
      <Flex direction="column" gap={6}>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            1
          </Box>
          <Text mb={2}>
            First, install the DBC Worker node. Installation documentation:
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
            , and obtain the machine ID and private key.
          </Text>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            2
          </Box>
          <Text mb={2}>
            Download the AI container image. Download address:{' '}
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
          </Text>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            3
          </Box>
          <Text mb={2}>
            Start a certain AI model container of DecentralGPT, obtain the container ID. Startup command:{' '}
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
          </Text>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            4
          </Box>
          <Button size="sm" onClick={dbcOnPledgeModalOpen} colorScheme="blue" variant="outline" w="fit-content">
            Pledge DBC
          </Button>

          <Modal isOpen={dbcIsPledgeModalOpen} onClose={dbcOnPledgeModalClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="lg">Stake DBC</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Amount of DBC to Stake:</FormLabel>
                  <Input
                    value={pledgedDbcCount}
                    onChange={(e) => setPledgedDbcCount(e.target.value)}
                    placeholder="Enter the amount of DBC to stake"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">1000 DBC needs to be staked for each GPU</FormHelperText>
                </FormControl>

                <FormControl mb={6} size="sm">
                  <FormLabel fontSize="sm">Docker ID:</FormLabel>
                  <Input
                    value={dockerId}
                    onChange={(e) => setDockerId(e.target.value)}
                    placeholder="Enter your Docker ID"
                    size="sm"
                  />
                </FormControl>

                <Button
                  isLoading={dbcBtnLoading}
                  colorScheme="blue"
                  width="full"
                  size="sm"
                  onClick={handleAddDbcToStake}
                >
                  Submit
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            5
          </Box>
          <Button onClick={nftOnPledgeModalOpen} size="sm" colorScheme="blue" variant="outline" w="fit-content">
            Stake NFT or DGC
          </Button>

          <Modal isOpen={nftIsPledgeModalOpen} onClose={nftOnPledgeModalClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="lg">Stake NFT Nodes</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Number of NFTs to Stake:</FormLabel>
                  <Input
                    value={pledgedNftCount}
                    onChange={(e) => setPledgedNftCount(e.target.value)}
                    placeholder="Enter the number of NFTs to stake"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">Please enter a number of NFTs between 1 and 11</FormHelperText>
                </FormControl>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Amount of DGC to Stake:</FormLabel>
                  <Input
                    value={pledgedDgcCount}
                    onChange={(e) => setPledgedDgcCount(e.target.value)}
                    placeholder="Enter the amount of DGC to stake"
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Docker ID:</FormLabel>
                  <Input
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    placeholder="Enter your Docker ID"
                    size="sm"
                  />
                </FormControl>

                <Button isLoading={nftBtnLoading} colorScheme="blue" width="full" size="sm" onClick={startApprove}>
                  Submit
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>

        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            7
          </Box>
          <Flex gap="4">
            <Text>View the information of machines that have joined the DecentralGPT network</Text>
            <LinkExternal href="https://and.decentralgpt.org/calc">https://and.decentralgpt.org/calc</LinkExternal>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default FixedComponent;
