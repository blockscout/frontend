import { Alert, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import { MINUTE } from 'lib/consts';
import useToast from 'lib/hooks/useToast';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';

interface Props {
  hash: string;
  id: string;
}

const TokenInstanceMetadataFetcher = ({ hash, id }: Props) => {
  const timeoutId = React.useRef<number>();

  const { status, setStatus } = useMetadataUpdateContext() || {};
  const apiFetch = useApiFetch();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleRefreshError = React.useCallback(() => {
    setStatus?.('ERROR');
    toast({
      title: 'Error',
      description: 'The refreshing process has failed. Please try again.',
      status: 'warning',
      variant: 'subtle',
    });
  }, [ setStatus, toast ]);

  const initializeUpdate = React.useCallback((reCaptchaToken: string) => {
    apiFetch<'token_instance_refresh_metadata', unknown, unknown>('token_instance_refresh_metadata', {
      pathParams: { hash, id },
      fetchParams: {
        method: 'PATCH',
        body: { recaptcha_response: reCaptchaToken },
      },
    })
      .then(() => {
        toast({
          title: 'Please wait',
          description: 'Refetching metadata request sent',
          status: 'warning',
          variant: 'subtle',
        });
        setStatus?.('WAITING_FOR_RESPONSE');
        timeoutId.current = window.setTimeout(handleRefreshError, 2 * MINUTE);
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
  }, [ apiFetch, handleRefreshError, hash, id, setStatus, toast ]);

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

    setStatus?.('SUCCESS');

    window.clearTimeout(timeoutId.current);
  }, [ hash, id, queryClient, setStatus, toast ]);

  const channel = useSocketChannel({
    topic: `token_instances:${ hash.toLowerCase() }`,
    onSocketClose: handleRefreshError,
    onSocketError: handleRefreshError,
    isDisabled: status !== 'WAITING_FOR_RESPONSE',
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
