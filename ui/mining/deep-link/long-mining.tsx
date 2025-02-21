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
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  const [nftNodeCount, setNftNodeCount] = useState('');
  const [machineId, setMachineId] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handlePledgeSubmit = () => {
    onPledgeModalClose();
  };

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">
          Note: The long-term rental mode requires the GPU server to be hosted in a professional data center, and to
          maintain 365 days of power and network can not be interrupted, otherwise it will be punished DBC Token
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
            <Text mb={2}>First, add the GPU machine to the DBC network</Text>
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
              The machine in DBC network rent down, rent to the end of the Orion competition at this stage time.
            </Text>
            <Text mb={2}>
              View the competition information:{' '}
              <LinkExternal href="https://orion.deeplink.cloud">https://orion.deeplink.cloud</LinkExternal>
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
            <Text mb={4}>Add rented GPU machines to the Deeplink network</Text>
            <Flex direction="column" gap={4}>
              <Button colorScheme="blue" variant="outline" w="fit-content" onClick={onPledgeModalOpen}>
                Pledge NFT nodes
              </Button>
              <Button colorScheme="blue" variant="outline" w="fit-content">
                Pledge DLC
              </Button>
              <Text color="gray.600" fontSize="sm">
                This step can also be skipped without pledging DLC, refer to the rules:{' '}
                <LinkExternal href="https://orion.deeplink.cloud/longterm">
                  https://orion.deeplink.cloud/longterm
                </LinkExternal>
              </Text>
              <Text mt={2}>
                View machine information that has been added to the Deeplink network:{' '}
                <LinkExternal href="https://orion.deeplink.cloud/device">
                  https://orion.deeplink.cloud/device
                </LinkExternal>
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">Number of NFT nodes to pledge</FormLabel>
              <Input
                value={nftNodeCount}
                onChange={(e) => setNftNodeCount(e.target.value)}
                placeholder="Enter number of nodes"
                size="sm"
              />
              <FormHelperText fontSize="xs">
                A minimum of 1 NFT and a maximum of 20 NFT need to be pledged
              </FormHelperText>
            </FormControl>

            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">ID of the machine you want to pledge</FormLabel>
              <Input
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                placeholder="Enter machine ID"
                size="sm"
              />
            </FormControl>

            <FormControl mb={6} size="sm">
              <FormLabel fontSize="sm">Machine private key you want to pledge</FormLabel>
              <Input
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter private key"
                type="password"
                size="sm"
              />
            </FormControl>

            <Button colorScheme="blue" width="full" size="sm" onClick={handlePledgeSubmit}>
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FixedComponent;
