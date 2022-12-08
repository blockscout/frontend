import { chakra, Alert, Icon, Modal, ModalBody, ModalContent, ModalCloseButton, ModalOverlay, Box, useDisclosure, Tooltip, IconButton } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import QRCode from 'qrcode';
import React from 'react';

import qrCodeIcon from 'icons/qr_code.svg';
import useIsMobile from 'lib/hooks/useIsMobile';

const SVG_OPTIONS = {
  margin: 0,
};

interface Props {
  className?: string;
  hash: string;
}

const AddressQrCode = ({ hash, className }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();
  const [ qr, setQr ] = React.useState('');
  const [ error, setError ] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      QRCode.toString(hash, SVG_OPTIONS, (error: Error | null | undefined, svg: string) => {
        if (error) {
          setError('We were unable to generate QR code.');
          Sentry.captureException(error, { tags: { source: 'QR code' } });
          return;
        }

        setError('');
        setQr(svg);
      });
    }
  }, [ hash, isOpen, onClose ]);

  return (
    <>
      <Tooltip label="Click to view QR code">
        <IconButton
          className={ className }
          aria-label="Show QR code"
          variant="outline"
          size="sm"
          pl="6px"
          pr="6px"
          onClick={ onOpen }
          icon={ <Icon as={ qrCodeIcon } boxSize={ 5 }/> }
        />
      </Tooltip>
      <Modal isOpen={ isOpen } onClose={ onClose } size={{ base: 'full', lg: 'sm' }}>
        <ModalOverlay/>
        <ModalContent bgColor={ error ? undefined : 'white' }>
          { isMobile && <ModalCloseButton/> }
          <ModalBody mb={ 0 }>
            { error ? <Alert status="warning">{ error }</Alert> : <Box dangerouslySetInnerHTML={{ __html: qr }}/> }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(chakra(AddressQrCode));
