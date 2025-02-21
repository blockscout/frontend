import React, { useEffect, useState } from 'react';
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
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import LinkExternal from '../../shared/LinkExternal';

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

  const [pledgedNftCount, setNftCount] = useState('');
  const [machineId, setMachineId] = useState('');
  const [containerId, setContainerId] = useState('');
  const [nftMachinePrivateKey, nftSetMachinePrivateKey] = useState('');
  const handlePledgeSubmitNft = () => {
    nftOnPledgeModalClose();
  };

  // Pledge NFT Node
  const {
    isOpen: dgcIsPledgeModalOpen,
    onOpen: dgcOnPledgeModalOpen,
    onClose: dgcOnPledgeModalClose,
  } = useDisclosure();

  const [pledgedDgcAmount, setPledgedDgcAmount] = useState('');
  const [dgcMachineId, dgcSetMachineId] = useState('');
  const [dgcContainerId, dgcSetContainerId] = useState('');
  const [dgcMachinePrivateKey, dgcSetMachinePrivateKey] = useState('');
  const handlePledgeSubmitDgc = () => {
    dgcOnPledgeModalClose();
  };

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
              <ModalHeader fontSize="lg">Pledge DBC</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Please enter the number of GPUs of the machine:</FormLabel>
                  <Input
                    value={gpuCount}
                    onChange={(e) => setGpuCount(e.target.value)}
                    placeholder="Please enter the number of GPUs of the machine"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">1000 DBC needs to be pledged for each GPU</FormHelperText>
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Please enter the machine ID:</FormLabel>
                  <Input
                    value={machineIdentifier}
                    onChange={(e) => setMachineIdentifier(e.target.value)}
                    placeholder="Please enter the machine ID"
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={6} size="sm">
                  <FormLabel fontSize="sm">Please enter the machine's private key:</FormLabel>
                  <Input
                    value={machinePrivateKey}
                    onChange={(e) => setMachinePrivateKey(e.target.value)}
                    placeholder="Please enter the machine's private key"
                    type="password"
                    size="sm"
                  />
                </FormControl>

                <Button colorScheme="blue" width="full" size="sm" onClick={handlePledgeSubmitDnc}>
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
            Pledge NFT Node
          </Button>

          <Modal isOpen={nftIsPledgeModalOpen} onClose={nftOnPledgeModalClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Please enter the number of NFTs to pledge:</FormLabel>
                  <Input
                    value={pledgedNftCount}
                    onChange={(e) => setNftCount(e.target.value)}
                    placeholder="Please enter the number of NFTs to pledge"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">
                    A minimum of 1 NFT and a maximum of 20 NFTs need to be pledged.
                  </FormHelperText>
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Please enter the machine ID:</FormLabel>
                  <Input
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    placeholder="Please enter the machine ID"
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">Please enter the ID of the launched container:</FormLabel>
                  <Input
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                    placeholder="Please enter the ID of the launched container"
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={6} size="sm">
                  <FormLabel fontSize="sm">Please enter the machine's private key:</FormLabel>
                  <Input
                    value={nftMachinePrivateKey}
                    onChange={(e) => nftSetMachinePrivateKey(e.target.value)}
                    placeholder="Please enter the machine's private key"
                    type="password"
                    size="sm"
                  />
                </FormControl>

                <Button colorScheme="blue" width="full" size="sm" onClick={handlePledgeSubmitNft}>
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
            6
          </Box>
          <Flex gap={'4'} alignItems="center">
            <Button onClick={dgcOnPledgeModalOpen} size="sm" colorScheme="blue" variant="outline" w="fit-content">
              Pledge DGC
            </Button>

            <Modal isOpen={dgcIsPledgeModalOpen} onClose={dgcOnPledgeModalClose} size="sm">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader fontSize="lg">Pledge DGC</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl mb={4} size="sm">
                    <FormLabel fontSize="sm">Please enter the amount of DGC to pledge:</FormLabel>
                    <Input
                      value={pledgedDgcAmount}
                      onChange={(e) => setPledgedDgcAmount(e.target.value)}
                      placeholder="Please enter the amount of DGC to pledge"
                      size="sm"
                    />
                    <FormHelperText fontSize="xs">You can pledge 0 or more than 100,000 DGC.</FormHelperText>
                  </FormControl>

                  <FormControl mb={4} size="sm">
                    <FormLabel fontSize="sm">Please enter the machine ID:</FormLabel>
                    <Input
                      value={dgcMachineId}
                      onChange={(e) => dgcSetMachineId(e.target.value)}
                      placeholder="Please enter the machine ID"
                      size="sm"
                    />
                  </FormControl>

                  <FormControl mb={4} size="sm">
                    <FormLabel fontSize="sm">Please enter the ID of the launched container:</FormLabel>
                    <Input
                      value={dgcContainerId}
                      onChange={(e) => dgcSetContainerId(e.target.value)}
                      placeholder="Please enter the ID of the launched container"
                      size="sm"
                    />
                  </FormControl>

                  <FormControl mb={6} size="sm">
                    <FormLabel fontSize="sm">Please enter the machine's private key:</FormLabel>
                    <Input
                      value={dgcMachinePrivateKey}
                      onChange={(e) => dgcSetMachinePrivateKey(e.target.value)}
                      placeholder="Please enter the machine's private key"
                      type="password"
                      size="sm"
                    />
                  </FormControl>

                  <Button colorScheme="blue" width="full" size="sm" onClick={handlePledgeSubmitDgc}>
                    Submit
                  </Button>
                </ModalBody>
              </ModalContent>
            </Modal>

            <Text>This step can also be skipped without pledging DGC.</Text>
            <Text>
              Reference rule:&nbsp;&nbsp;
              <LinkExternal href="https://and.decentralgpt.org/rule">https://and.decentralgpt.org/rule</LinkExternal>
            </Text>
          </Flex>
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
          <Flex gap={'4'}>
            <Text>View the information of machines that have joined the DecentralGPT network</Text>
            <LinkExternal href="https://and.decentralgpt.org/calc">https://and.decentralgpt.org/calc</LinkExternal>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default FixedComponent;
