import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  List,
  ListItem,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import LinkExternal from '../../shared/LinkExternal';
const FixedComponent = () => {
  // nft
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  const [nftNodeCount, setNftNodeCount] = useState('');
  const [machineId, setMachineId] = useState('');
  const [machineId2, setMachineId2] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handlePledgeSubmitDNft = () => {
    onPledgeModalClose();
  };

  // nft
  const {
    isOpen: isPledgeModalOpenDgc,
    onOpen: onPledgeModalOpenDgc,
    onClose: onPledgeModalCloseDgc,
  } = useDisclosure();
  const [dgcNodeCount, setDgcNodeCount] = useState('');
  const [machineIdDgc, setMachineIdDgc] = useState('');
  const [machineIdDgc2, setMachineIdDgc2] = useState('');
  const [privateKeyDgc, setPrivateKeyDgc] = useState('');

  const handlePledgeSubmitDgc = () => {
    onPledgeModalCloseDgc();
  };

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">
          Note: For the long - term rental mode, the GPU server needs to be hosted in a professional data center, and
          the power and network should be maintained without interruption for 365 days. Otherwise, DBC Tokens will be
          penalized.
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
          <Box>
            <Text mb={2}>
              First, Rent your own machine in the DBC network until the end of the current stage of the Andromeda GPU
              competition.
            </Text>
            <Text mb={2}>
              Reference document:{' '}
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
                https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html
              </LinkExternal>
            </Text>
          </Box>
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
          <Box>
            <Text mb={2}>
              Rent your own machine in the DBC network, and the rental period should last until the end of the current
              stage of the Andromeda GPU competition.
            </Text>

            <Text>
              Reference document:{' '}
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html">
                https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html
              </LinkExternal>
            </Text>
          </Box>
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
          <Box>
            <Text mb={4}>Log in to the rented GPU virtual machine.</Text>
            <Flex direction="column" gap={4}>
              <List as="ol">
                <Flex gap="5" direction="column">
                  <ListItem>
                    <Text fontSize="sm">
                      (1)&nbsp; &nbsp;Install the DBC Worker node in the virtual machine. Installation documentation:
                      <LinkExternal href="https://github.com/DeepBrainChain/AIComputingNode">
                        https://github.com/DeepBrainChain/AIComputingNode
                      </LinkExternal>
                    </Text>
                  </ListItem>

                  <ListItem>
                    <Text fontSize="sm">
                      (2)&nbsp; &nbsp;Download the AI container image. Download address:
                      <LinkExternal href="https://and.decentralgpt.org/rule">xxxxxx</LinkExternal>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      (3)&nbsp; &nbsp;Start a certain AI model container of DecentralGPT, obtain the container ID.
                      Startup command:
                      <LinkExternal href="https://and.decentralgpt.org/rule">xxxxxx</LinkExternal>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      (4)&nbsp; &nbsp;
                      <Button
                        onClick={onPledgeModalOpen}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        w="fit-content"
                      >
                        Pledge NFT Node
                      </Button>
                      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody pb={6}>
                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">Number of NFT Nodes:</FormLabel>
                              <Input
                                value={nftNodeCount}
                                onChange={(e) => setNftNodeCount(e.target.value)}
                                placeholder="Number of NFT Nodes"
                                size="sm"
                              />
                              <FormHelperText fontSize="xs">
                                At least 1 NFT and at most 20 NFTs are required to be pledged.
                              </FormHelperText>
                            </FormControl>

                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">ID of the Rented Machine:</FormLabel>
                              <Input
                                value={machineId}
                                onChange={(e) => setMachineId(e.target.value)}
                                placeholder="ID of the Rented Machine"
                                size="sm"
                              />
                            </FormControl>

                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">ID of the Launched Container:</FormLabel>
                              <Input
                                value={machineId2}
                                onChange={(e) => setMachineId2(e.target.value)}
                                placeholder="ID of the Launched Container"
                                size="sm"
                              />
                            </FormControl>

                            <FormControl mb={6} size="sm">
                              <FormLabel fontSize="sm">Wallet Private Key of the Rented GPU Machine:</FormLabel>
                              <Input
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                placeholder="Wallet Private Key of the Rented GPU Machine"
                                type="password"
                                size="sm"
                              />
                            </FormControl>

                            <Button colorScheme="blue" width="full" size="sm" onClick={handlePledgeSubmitDNft}>
                              Submit
                            </Button>
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      <Flex gap="2" alignItems="center">
                        (5)&nbsp;
                        <Button
                          onClick={onPledgeModalOpenDgc}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          w="fit-content"
                        >
                          Pledge DGC
                        </Button>
                        <Modal isOpen={isPledgeModalOpenDgc} onClose={onPledgeModalCloseDgc} size="sm">
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader fontSize="lg">Pledge DGC</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                              <FormControl mb={4} size="sm">
                                <FormLabel fontSize="sm">Amount of DGC to Pledge:</FormLabel>
                                <Input
                                  value={dgcNodeCount}
                                  onChange={(e) => setDgcNodeCount(e.target.value)}
                                  placeholder="Please enter the amount of DGC to pledge"
                                  size="sm"
                                />
                                <FormHelperText fontSize="xs">
                                  You can pledge either 0 or more than 100,000 DGC.
                                </FormHelperText>
                              </FormControl>

                              <FormControl mb={4} size="sm">
                                <FormLabel fontSize="sm">ID of the Rented Machine:</FormLabel>
                                <Input
                                  value={machineIdDgc}
                                  onChange={(e) => setMachineIdDgc(e.target.value)}
                                  placeholder="Please enter the ID of the rented machine"
                                  size="sm"
                                />
                              </FormControl>

                              <FormControl mb={4} size="sm">
                                <FormLabel fontSize="sm">ID of the Launched Container:</FormLabel>
                                <Input
                                  value={machineIdDgc2}
                                  onChange={(e) => setMachineIdDgc2(e.target.value)}
                                  placeholder="Please enter the ID of the launched container"
                                  size="sm"
                                />
                              </FormControl>

                              <FormControl mb={6} size="sm">
                                <FormLabel fontSize="sm">Wallet Private Key of the Rented GPU Machine:</FormLabel>
                                <Input
                                  value={privateKeyDgc}
                                  onChange={(e) => setPrivateKeyDgc(e.target.value)}
                                  placeholder="Please enter the wallet private key of the rented GPU machine"
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
                        Reference rule:{' '}
                        <LinkExternal href="https://and.decentralgpt.org/rule">
                          https://and.decentralgpt.org/rule
                        </LinkExternal>
                      </Flex>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      (6)&nbsp; &nbsp;View the information of machines that have joined the DecentralGPT network:{' '}
                      <LinkExternal href="https://and.decentralgpt.org/calc">
                        https://and.decentralgpt.org/calc
                      </LinkExternal>
                    </Text>
                  </ListItem>
                </Flex>
              </List>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};

export default FixedComponent;
