import { Flex } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import AppError from 'ui/shared/AppError/AppError';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  hideMobileHeaderOnScrollDown?: boolean;
  isHomePage?: boolean;
}

const Page = ({
  children,
  wrapChildren = true,
  hideMobileHeaderOnScrollDown,
  isHomePage,
}: Props) => {
  useApiQuery('csrf', {
    queryOptions: {
      enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });

  const renderErrorScreen = React.useCallback(() => {
    return wrapChildren ?
      <PageContent isHomePage={ isHomePage }><AppError statusCode={ 500 } mt="50px"/></PageContent> :
      <AppError statusCode={ 500 }/>;
  }, [ isHomePage, wrapChildren ]);

  const renderedChildren = wrapChildren ? (
    <PageContent isHomePage={ isHomePage }>{ children }</PageContent>
  ) : children;

  return (
    <Flex w="100%" minH="100vh" alignItems="stretch">
      <NavigationDesktop/>
      <Flex flexDir="column" flexGrow={ 1 } w={{ base: '100%', lg: 'auto' }}>
        <Header isHomePage={ isHomePage } hideOnScrollDown={ hideMobileHeaderOnScrollDown }/>
        <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
          { renderedChildren }
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
};

export default Page;
