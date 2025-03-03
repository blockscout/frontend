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

  // Pledge DGC
  const {
    isOpen: dgcIsPledgeModalOpen,
    onOpen: dgcOnPledgeModalOpen,
    onClose: dgcOnPledgeModalClose,
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
  } = useFreeH(nftOnPledgeModalClose);

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
            质押NFT或者DGC
          </Button>

          <Modal isOpen={nftIsPledgeModalOpen} onClose={nftOnPledgeModalClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                {/* <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">NFT数量:</FormLabel>
                  <Input
                    value={pledgedNftCount}
                    onChange={(e) => setNftCount(e.target.value)}
                    placeholder="请输入NFT数量"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">请输入0-11之间的nft数量</FormHelperText>
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">容器ID:</FormLabel>
                  <Input
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    placeholder="请输入容器ID"
                    size="sm"
                  />
                </FormControl> */}
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">NFT数量:</FormLabel>
                  <Input
                    value={pledgedNftCount}
                    onChange={(e) => setPledgedNftCount(e.target.value)}
                    placeholder="请输入NFT数量"
                    size="sm"
                  />
                  <FormHelperText fontSize="xs">请输入0-11之间的nft数量</FormHelperText>
                </FormControl>
                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">DGC数量:</FormLabel>
                  <Input
                    value={pledgedDgcCount}
                    onChange={(e) => setPledgedDgcCount(e.target.value)}
                    placeholder="请输入DGC数量"
                    size="sm"
                  />
                </FormControl>

                <FormControl mb={4} size="sm">
                  <FormLabel fontSize="sm">容器ID:</FormLabel>
                  <Input
                    value={machineId}
                    onChange={(e) => setMachineId(e.target.value)}
                    placeholder="请输入容器ID"
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
        {/* <Flex gap={4}>
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
          <Flex gap="4" alignItems="center">
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
                    <FormLabel fontSize="sm">DGC数量:</FormLabel>
                    <Input
                      value={pledgedDgcCount2}
                      onChange={(e) => setDgcCount2(e.target.value)}
                      placeholder="请输入DGC数量"
                      size="sm"
                    />
                  </FormControl>

                  <FormControl mb={4} size="sm">
                    <FormLabel fontSize="sm">NFT数量:</FormLabel>
                    <Input
                      value={pledgedNftCount2}
                      onChange={(e) => setNftCount2(e.target.value)}
                      placeholder="请输入NFT数量"
                      size="sm"
                    />
                    <FormHelperText fontSize="xs">请输入0-11之间的nft数量</FormHelperText>
                  </FormControl>

                  <FormControl mb={4} size="sm">
                    <FormLabel fontSize="sm">容器ID:</FormLabel>
                    <Input
                      value={machineId2}
                      onChange={(e) => setMachineId2(e.target.value)}
                      placeholder="请输入容器ID"
                      size="sm"
                    />
                  </FormControl>
                  <Button isLoading={nftBtnLoading2} colorScheme="blue" width="full" size="sm" onClick={approveDgc}>
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
        </Flex> */}
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
