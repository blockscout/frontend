import type { ToastId } from '@chakra-ui/react';
import { chakra, Alert, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import { MINUTE, SECOND } from 'lib/consts';
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
  const toastId = React.useRef<ToastId>();

  const { status, setStatus } = useMetadataUpdateContext() || {};
  const apiFetch = useApiFetch();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleRefreshError = React.useCallback(() => {
    setStatus?.('ERROR');
    toastId.current && toast.update(toastId.current, {
      title: 'Error',
      description: 'The refreshing process has failed. Please try again.',
      status: 'warning',
      duration: 5 * SECOND,
      isClosable: true,
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
        setStatus?.('WAITING_FOR_RESPONSE');
        toastId.current = toast({
          title: 'Please wait',
          description: 'Refetching metadata request sent',
          icon: <Spinner size="sm" mr={ 2 }/>,
          status: 'warning',
          duration: null,
          isClosable: false,
        });
        timeoutId.current = window.setTimeout(handleRefreshError, 2 * MINUTE);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Unable to initialize metadata update',
          status: 'warning',
        });
        setStatus?.('ERROR');
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

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback((event) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const token = data.get('recaptcha_token');
    typeof token === 'string' && initializeUpdate(token);
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

      const castToString = (value: unknown) => typeof value === 'string' ? value : undefined;

      return {
        ...prevData,
        external_app_url: castToString(payload.fetched_metadata?.external_url) ?? null,
        animation_url: castToString(payload.fetched_metadata?.animation_url) ?? null,
        image_url: castToString(
          payload.fetched_metadata?.image ||
            payload.fetched_metadata?.image_url ||
            payload.fetched_metadata?.animation_url,
        ) ?? null,
        metadata: payload.fetched_metadata,
      };
    });

    toastId.current && toast.update(toastId.current, {
      title: 'Success!',
      description: 'Metadata has been refreshed',
      status: 'success',
      duration: 5 * SECOND,
      isClosable: true,
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

  React.useEffect(() => {
    return () => {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      toastId.current && toast.close(toastId.current);
    };
  // run only on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          { /* ONLY FOR TEST PURPOSES */ }
          <chakra.form noValidate onSubmit={ handleFormSubmit } display="none">
            <chakra.input
              name="recaptcha_token"
              placeholder="reCaptcha token"
            />
            <chakra.button type="submit">Submit</chakra.button>
          </chakra.form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(TokenInstanceMetadataFetcher);
