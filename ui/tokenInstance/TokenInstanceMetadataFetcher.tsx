import { Alert, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import useToast from 'lib/hooks/useToast';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';

interface Props {
  hash: string;
  id: string;
}

const TokenInstanceMetadataFetcher = ({ hash, id }: Props) => {
  const ref = React.useRef<ReCaptcha>(null);

  const { status, setStatus } = useMetadataUpdateContext() || {};
  const apiFetch = useApiFetch();
  const toast = useToast();
  const queryClient = useQueryClient();

  const initializeUpdate = React.useCallback((reCaptchaToken: string) => {
    apiFetch<'token_instance_refresh_metadata', unknown, unknown>('token_instance_refresh_metadata', {
      pathParams: { hash, id },
      fetchParams: {
        method: 'PATCH',
        body: { recaptcha_response: reCaptchaToken },
      },
    })
      .then(() => {
        setStatus?.('UPDATING');
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Unable to initialize metadata update',
          status: 'warning',
          variant: 'subtle',
        });
        setStatus?.('INITIAL');
      });
  }, [ apiFetch, hash, id, setStatus, toast ]);

  const handleModalClose = React.useCallback(() => {
    setStatus?.('INITIAL');
  }, [ setStatus ]);

  const handleReCaptchaChange = React.useCallback((token: string | null) => {
    if (token) {
      initializeUpdate(token);
    }
  }, [ initializeUpdate ]);

  const handleSocketMessage: SocketMessage.TokenInstanceMetadataFetched['handler'] = React.useCallback((payload) => {
    if (String(payload.token_id) !== id) {
      return;
    }

    const queryKey = getResourceKey('token_instance', { queryParams: { hash, id } });
    queryClient.setQueryData(queryKey, (prevData: TokenInstance | undefined): TokenInstance | undefined => {
      if (!prevData) {
        return;
      }
      return { ...prevData, metadata: payload.fetched_metadata };
    });

    toast({
      title: 'Success!',
      description: 'Metadata has been refreshed',
      status: 'success',
      variant: 'subtle',
    });
  }, [ hash, id, queryClient, toast ]);

  const handleSocketError = React.useCallback(() => {
    setStatus?.('ERROR');
  }, [ setStatus ]);

  const channel = useSocketChannel({
    topic: `token_instances:${ hash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: status !== 'UPDATING',
  });

  useSocketMessage({
    channel,
    event: 'fetched_token_instance_metadata',
    handler: handleSocketMessage,
  });

  return (
    <Modal isOpen={ status === 'MODAL_OPENED' } onClose={ handleModalClose } size={{ base: 'full', lg: 'sm' }}>
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
  );
};

export default React.memo(TokenInstanceMetadataFetcher);
