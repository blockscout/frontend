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

function cpuStakeDbcBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gpuCount, setGpuCount] = React.useState('');
  const [machineId, setMachineId] = React.useState('');

  return (
    <div>
      <Button onClick={onOpen} colorScheme="blue" variant="outline" w="fit-content">
        {t('stake-dbc')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-dbc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('gpu-count')}</FormLabel>
                <Input
                  value={gpuCount}
                  onChange={(e) => setGpuCount(e.target.value)}
                  placeholder={t('input-gpu-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('gpu-stake-requirement')}</FormHelperText>
              </FormControl>

              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
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

export default cpuStakeDbcBtn;
