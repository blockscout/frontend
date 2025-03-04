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

import { useLongH } from '../../../lib/hooks/useDecentralGPT/free/useLong';
const FixedComponent = () => {
  // nft
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  const {
    BtnLoading,
    stakedDgcAmount,
    setStakedDgcAmount,
    stakedNftAmount,
    setStakedNftAmount,
    containerId,
    setContainerId,
    machineId,
    setMachineId,
    leaseId,
    setLeaseId,
    approveNft,
  } = useLongH(onPledgeModalClose);

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
                        Pledge NFT And DGC
                      </Button>
                      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody pb={6}>
                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">质押nft的数量(erc1155):</FormLabel>
                              <Input
                                value={stakedNftAmount}
                                onChange={(e) => setStakedNftAmount(e.target.value)}
                                placeholder="请输入质押nft的数量"
                                size="sm"
                              />
                              <FormHelperText fontSize="xs">
                                Please enter a number of NFTs between 1 and 11
                              </FormHelperText>
                            </FormControl>
                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">质押dgc的数量:</FormLabel>
                              <Input
                                value={stakedDgcAmount}
                                onChange={(e) => setStakedDgcAmount(e.target.value)}
                                placeholder="请输入质押dgc的数量"
                                size="sm"
                              />
                            </FormControl>

                            <FormControl mb={4} size="sm">
                              <FormLabel fontSize="sm">容器id:</FormLabel>
                              <Input
                                value={containerId}
                                onChange={(e) => setContainerId(e.target.value)}
                                placeholder="请输入容器id"
                                size="sm"
                              />
                            </FormControl>

                            <FormControl mb={6} size="sm">
                              <FormLabel fontSize="sm">substrate上面生成的机器id:</FormLabel>
                              <Input
                                value={machineId}
                                onChange={(e) => setMachineId(e.target.value)}
                                placeholder="请输入substrate上面生成的机器id"
                                size="sm"
                              />
                            </FormControl>
                            <FormControl mb={6} size="sm">
                              <FormLabel fontSize="sm">租用id:</FormLabel>
                              <Input
                                value={leaseId}
                                onChange={(e) => setLeaseId(e.target.value)}
                                placeholder="请输入租用id"
                                size="sm"
                              />
                            </FormControl>
                            <Button
                              isLoading={BtnLoading}
                              colorScheme="blue"
                              width="full"
                              size="sm"
                              onClick={approveNft}
                            >
                              Submit
                            </Button>
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </Text>
                  </ListItem>

                  <ListItem>
                    <Text fontSize="sm">
                      (5)&nbsp; &nbsp;View the information of machines that have joined the DecentralGPT network:{' '}
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
