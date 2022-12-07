import { Button, Alert, Icon, Modal, ModalBody, ModalContent, ModalCloseButton, ModalOverlay, Box, useDisclosure } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import QRCode from 'qrcode';
import React from 'react';

import qrCodeIcon from 'icons/qr_code.svg';
import useIsMobile from 'lib/hooks/useIsMobile';

const SVG_OPTIONS = {
  margin: 0,
};

interface Props {
  hash: string;
}

const AddressQrCode = ({ hash }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();
  const ref = React.useRef<HTMLDivElement>(null);
  const [ qr, setQr ] = React.useState('');
  const [ error, setError ] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      QRCode.toString(hash, SVG_OPTIONS, function(error: Error | null | undefined, svg: string) {
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
      <Button variant="outline" size="sm" ml={ 2 } onClick={ onOpen } aria-label="Show QR code">
        <Icon as={ qrCodeIcon } boxSize={ 5 }/>
      </Button>
      <Modal isOpen={ isOpen } onClose={ onClose } size={{ base: 'full', lg: 'sm' }}>
        <ModalOverlay/>
        <ModalContent bgColor={ error ? undefined : 'white' }>
          { isMobile && <ModalCloseButton/> }
          <ModalBody mb={ 0 }>
            { error ? <Alert status="warning">{ error }</Alert> : <Box ref={ ref } dangerouslySetInnerHTML={{ __html: qr }}/> }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(AddressQrCode);
