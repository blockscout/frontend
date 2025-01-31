import type { ToastId } from '@chakra-ui/react';
import { Alert, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Center } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { TokenInstance } from 'types/api/token';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import { MINUTE, SECOND } from 'lib/consts';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useToast from 'lib/hooks/useToast';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

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
  const recaptcha = useReCaptcha();

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

  const initializeUpdate = React.useCallback(async(tokenProp?: string) => {
    try {
      const token = tokenProp || await recaptcha.executeAsync();
      await apiFetch<'token_instance_refresh_metadata', unknown, unknown>('token_instance_refresh_metadata', {
        pathParams: { hash, id },
        fetchParams: {
          method: 'PATCH',
          body: { recaptcha_response: token },
        },
      });
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
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error) || 'Unable to initialize metadata update',
        status: 'warning',
      });
      setStatus?.('ERROR');
    }

  }, [ apiFetch, handleRefreshError, hash, id, recaptcha, setStatus, toast ]);

  const handleModalClose = React.useCallback(() => {
    setStatus?.('INITIAL');
  }, [ setStatus ]);

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
    if (status !== 'MODAL_OPENED') {
      return;
    }

    const timeoutId = window.setTimeout(initializeUpdate, 100);
    return () => window.clearTimeout(timeoutId);
  }, [ status, initializeUpdate ]);

  React.useEffect(() => {
    return () => {
      timeoutId.current && window.clearTimeout(timeoutId.current);
      toastId.current && toast.close(toastId.current);
    };
  // run only on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status !== 'MODAL_OPENED') {
    return null;
  }

  return (
    <Modal isOpen={ status === 'MODAL_OPENED' } onClose={ handleModalClose } size={{ base: 'full', lg: 'sm' }}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 }>Sending request</ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 } minH="78px">
          { config.services.reCaptchaV2.siteKey ? (
            <>
              <Center h="80px">
                <Spinner size="lg"/>
              </Center>
              <ReCaptcha ref={ recaptcha.ref }/>
            </>
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
