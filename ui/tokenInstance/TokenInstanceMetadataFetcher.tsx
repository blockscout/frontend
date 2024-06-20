import { Alert, Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import config from 'configs/app';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';

const TokenInstanceMetadataFetcher = () => {
  const ref = React.useRef<ReCaptcha>(null);
  const [ reCaptchaToken, setReCaptchaToken ] = React.useState<string | undefined>();

  const { status, setStatus } = useMetadataUpdateContext() || {};

  React.useEffect(() => {
    if (status === 'MODAL_OPENED') {
      if (reCaptchaToken) {
        setStatus?.('UPDATING');
      }
    }
    // should run only on status update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ status ]);

  const handleModalClose = React.useCallback(() => {
    setStatus?.('INITIAL');
  }, [ setStatus ]);

  const handleReCaptchaChange = React.useCallback((token: string | null) => {
    token && setReCaptchaToken(token);
  }, []);

  const handleReCaptchaExpire = React.useCallback(() => {
    setReCaptchaToken(undefined);
  }, []);

  return (
    <>
      <Box>Foo</Box>
      <Modal isOpen={ status === 'MODAL_OPENED' && Boolean(reCaptchaToken) } onClose={ handleModalClose } size={{ base: 'full', lg: 'sm' }}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 }>Solve captcha to refresh metadata</ModalHeader>
          <ModalCloseButton/>
          <ModalBody mb={ 0 } minH="78px">
            { config.services.reCaptcha.siteKey ? (
              <ReCaptcha
                className="recaptcha"
                ref={ ref }
                sitekey={ config.services.reCaptcha.siteKey }
                onChange={ handleReCaptchaChange }
                onExpired={ handleReCaptchaExpire }
              />
            ) : (
              <Alert status="error">
                Metadata refresh is not available at the moment since reCaptcha is not configured for this application.
                Please contact the service maintainer to make necessary changes in the service configuration.
              </Alert>
            ) }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(TokenInstanceMetadataFetcher);
