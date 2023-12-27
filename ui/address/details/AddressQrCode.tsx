import {
  chakra,
  Alert,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  LightMode,
  Box,
  useDisclosure,
  Tooltip,
  IconButton,
  Skeleton,
} from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import React from 'react';

import type { Address as AddressType } from 'types/api/address';

import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

const SVG_OPTIONS = {
  margin: 0,
};

interface Props {
  className?: string;
  address: AddressType;
  isLoading?: boolean;
}

const AddressQrCode = ({ address, className, isLoading }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const [ qr, setQr ] = React.useState('');
  const [ error, setError ] = React.useState('');

  const pageType = getPageType(router.pathname);

  React.useEffect(() => {
    if (isOpen) {
      QRCode.toString(address.hash, SVG_OPTIONS, (error: Error | null | undefined, svg: string) => {
        if (error) {
          setError('We were unable to generate QR code.');
          Sentry.captureException(error, { tags: { source: 'qr_code' } });
          return;
        }

        setError('');
        setQr(svg);
        mixpanel.logEvent(mixpanel.EventTypes.QR_CODE, { 'Page type': pageType });
      });
    }
  }, [ address.hash, isOpen, onClose, pageType ]);

  if (isLoading) {
    return <Skeleton className={ className } w="36px" h="32px" borderRadius="base"/>;
  }

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
          icon={ <IconSvg name="qr_code" boxSize={ 5 }/> }
          flexShrink={ 0 }
        />
      </Tooltip>

      { error && (
        <Modal isOpen={ isOpen } onClose={ onClose } size={{ base: 'full', lg: 'sm' }}>
          <ModalOverlay/>
          <ModalContent>
            <ModalBody mb={ 0 }>
              <Alert status="warning">{ error }</Alert>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) }
      { !error && (
        <LightMode>
          <Modal isOpen={ isOpen } onClose={ onClose } size={{ base: 'full', lg: 'sm' }}>
            <ModalOverlay/>
            <ModalContent>
              <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 }>Address QR code</ModalHeader>
              <ModalCloseButton/>
              <ModalBody mb={ 0 }>
                <AddressEntity
                  mb={ 3 }
                  fontWeight={ 500 }
                  color="text"
                  address={ address }
                  noLink
                />
                <Box p={ 4 } dangerouslySetInnerHTML={{ __html: qr }}/>
              </ModalBody>
            </ModalContent>
          </Modal>
        </LightMode>
      ) }
    </>
  );
};

export default React.memo(chakra(AddressQrCode));
