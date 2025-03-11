import React from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  useToast,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

function cpuStakeDlcBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gpuCount, setGpuCount] = React.useState('');

  return (
    <div>
      <Button onClick={onOpen} colorScheme="blue" variant="outline" w="fit-content">
        {t('stake-dlc')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-dlc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('dlc-stake-count')}</FormLabel>
                <Input
                  value={gpuCount}
                  onChange={(e) => setGpuCount(e.target.value)}
                  placeholder={t('input-dlc-stake-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('dlc-stake-requirement')} </FormHelperText>
              </FormControl>

              <Button colorScheme="blue" width="full" onClick={onClose}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default cpuStakeDlcBtn;
