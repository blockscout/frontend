import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import AppError from 'ui/shared/AppError/AppError';
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
  const fetch = useFetch();

  useQuery([ 'csrf' ], async() => await fetch('/node-api/csrf'), {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
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
