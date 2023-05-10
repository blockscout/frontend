import { Flex } from '@chakra-ui/react';
import React from 'react';

import getErrorCauseStatusCode from 'lib/errors/getErrorCauseStatusCode';
import getResourceErrorPayload from 'lib/errors/getResourceErrorPayload';
import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import AppError from 'ui/shared/AppError/AppError';
import AppErrorBlockConsensus from 'ui/shared/AppError/AppErrorBlockConsensus';
import AppErrorInvalidTxHash from 'ui/shared/AppError/AppErrorInvalidTxHash';
import AppErrorUnverifiedEmail from 'ui/shared/AppError/AppErrorUnverifiedEmail';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  isHomePage?: boolean;
  renderHeader?: () => React.ReactNode;
}

const Page = ({
  children,
  wrapChildren = true,
  isHomePage,
  renderHeader,
}: Props) => {

  useGetCsrfToken();

  useAdblockDetect();

  const renderErrorScreen = React.useCallback((error?: Error) => {
    const statusCode = getErrorCauseStatusCode(error) || 500;
    const resourceErrorPayload = getResourceErrorPayload(error);
    const messageInPayload = resourceErrorPayload && 'message' in resourceErrorPayload && typeof resourceErrorPayload.message === 'string' ?
      resourceErrorPayload.message :
      undefined;

    const isInvalidTxHash = error?.message.includes('Invalid tx hash');
    const isBlockConsensus = messageInPayload?.includes('Block lost consensus');
    const isUnverifiedEmail = statusCode === 403 && messageInPayload?.includes('Unverified email');

    if (isInvalidTxHash) {
      return <PageContent isHomePage={ isHomePage }><AppErrorInvalidTxHash/></PageContent>;
    }

    if (isUnverifiedEmail) {
      return <PageContent isHomePage={ isHomePage }><AppErrorUnverifiedEmail mt="50px"/></PageContent>;
    }

    if (isBlockConsensus) {
      const hash = resourceErrorPayload && 'hash' in resourceErrorPayload && typeof resourceErrorPayload.hash === 'string' ?
        resourceErrorPayload.hash :
        undefined;
      return <PageContent isHomePage={ isHomePage }><AppErrorBlockConsensus hash={ hash } mt="50px"/></PageContent>;
    }

    return <PageContent isHomePage={ isHomePage }><AppError statusCode={ statusCode } mt="50px"/></PageContent>;
  }, [ isHomePage ]);

  const renderedChildren = wrapChildren ? (
    <PageContent isHomePage={ isHomePage }>{ children }</PageContent>
  ) : children;

  return (
    <Flex w="100%" minH="100vh" alignItems="stretch">
      <NavigationDesktop/>
      <Flex flexDir="column" flexGrow={ 1 } w={{ base: '100%', lg: 'auto' }}>
        { renderHeader ?
          renderHeader() :
          <Header isHomePage={ isHomePage }/>
        }
        <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
          { renderedChildren }
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
};

export default Page;
