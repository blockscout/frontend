import {
  Box,
  Button,
  useToast,
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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import LinkExternal from '../../shared/LinkExternal';
import { useApproval } from '../../../lib/hooks/useDeepLink/useApproval';

const FixedComponent = () => {
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  const { t } = useTranslation('common');

  // DLC
  const {
    isOpen: isPledgeModalOpenDLC,
    onOpen: onPledgeModalOpenDLC,
    onClose: onPledgeModalCloseDLC,
  } = useDisclosure();

  const {
    approveNft,
    approveDlcToken,
    dlcBtnLoading,
    dlcNodeId,
    setdlcNodeId,
    dlcNodeCount,
    setDlcNodeCount,
    nftLoading,
    machineId,
    setMachineId,
    rentalMachineIdOnChain,
    setRentalMachineIdOnChain,
    nftNodeCount,
    setNftNodeCount,
  } = useApproval(onPledgeModalClose, onPledgeModalCloseDLC);

  // nft按钮提交事件
  const handlePledgeSubmit = () => {
    approveNft();
  };

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">{t('long-rental-requirements')}</Text>
      </Box>

      <Flex direction="column" gap={6}>
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
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
            <Text mb={2}>{t('add-gpu-to-dbc-network')}</Text>
            <Text mb={2}>
              {t('reference-document')}:
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
                https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html
              </LinkExternal>
            </Text>
          </Box>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
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
            <Text mb={2}>{t('machine-rent-down')}</Text>
            <Text mb={2}>
              {t('view-competition-info')}:
              <LinkExternal href="https://orion.deeplink.cloud">https://orion.deeplink.cloud</LinkExternal>
            </Text>
            <Text>
              {t('reference-document')}:
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html">
                https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html
              </LinkExternal>
            </Text>
          </Box>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
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
            <Text mb={4}>{t('add-rented-gpu-to-deeplink')}</Text>
            <Flex direction="column" gap={4}>
              <Button colorScheme="blue" variant="outline" w="fit-content" onClick={onPledgeModalOpen}>
                {t('pledge-nft-nodes')}
              </Button>
              <Button onClick={onPledgeModalOpenDLC} colorScheme="blue" variant="outline" w="fit-content">
                {t('pledge-dlc')}
              </Button>
              <Text color="gray.600" fontSize="sm">
                {t('skip-dlc-pledge')}:
                <LinkExternal href="https://orion.deeplink.cloud/longterm">
                  https://orion.deeplink.cloud/longterm
                </LinkExternal>
              </Text>
              <Text mt={2}>
                {t('view-deeplink-machine-info')}:
                <LinkExternal href="https://orion.deeplink.cloud/device">
                  https://orion.deeplink.cloud/device
                </LinkExternal>
              </Text>
            </Flex>
          </Box>
        </div>
      </Flex>
      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('pledge-nft-nodes')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('nft-nodes-pledge-count')}：</FormLabel>
                <Input
                  value={nftNodeCount}
                  onChange={(e) => setNftNodeCount(e.target.value)}
                  placeholder={t('input-nft-nodes-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('nft-pledge-requirement')}</FormHelperText>
              </FormControl>

              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('rent-id')}：</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder={t('input-rent-id')}
                  size="sm"
                />
              </FormControl>
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={rentalMachineIdOnChain}
                  onChange={(e) => setRentalMachineIdOnChain(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>

              <Button isLoading={nftLoading} colorScheme="blue" width="full" onClick={handlePledgeSubmit}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* DLC */}

      <Modal isOpen={isPledgeModalOpenDLC} onClose={onPledgeModalCloseDLC} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('pledge-dlc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('dlc-pledge-amount')}</FormLabel>
                <Input
                  value={dlcNodeCount}
                  onChange={(e) => setDlcNodeCount(e.target.value)}
                  placeholder={t('input-dlc-pledge-amount')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('dlc-pledge-requirement')}</FormHelperText>
              </FormControl>
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={dlcNodeId}
                  onChange={(e) => setdlcNodeId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>
              <Button isLoading={dlcBtnLoading} colorScheme="blue" width="full" onClick={approveDlcToken}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FixedComponent;
