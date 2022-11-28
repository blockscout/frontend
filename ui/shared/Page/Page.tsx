import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import useScrollDirection from 'lib/hooks/useScrollDirection';
import { SocketProvider } from 'lib/socket/context';
import ScrollDirectionContext from 'ui/ScrollDirectionContext';
import AppError from 'ui/shared/AppError/AppError';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  hideMobileHeaderOnScrollDown?: boolean;
  hasSearch?: boolean;
}

const Page = ({
  children,
  wrapChildren = true,
  hideMobileHeaderOnScrollDown,
  hasSearch = true,
}: Props) => {
  const fetch = useFetch();

  useQuery<unknown, unknown, unknown>([ QueryKeys.csrf ], async() => await fetch('/node-api/account/csrf'), {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });

  const directionContext = useScrollDirection();

  const renderErrorScreen = React.useCallback(() => {
    return wrapChildren ?
      <PageContent hasSearch={ hasSearch }><AppError statusCode={ 500 } mt="50px"/></PageContent> :
      <AppError statusCode={ 500 }/>;
  }, [ wrapChildren, hasSearch ]);

  const renderedChildren = wrapChildren ? (
    <PageContent hasSearch={ hasSearch }>{ children }</PageContent>
  ) : children;

  return (
    <SocketProvider url={ `${ appConfig.api.socket }${ appConfig.api.basePath }/socket/v2` }>
      <ScrollDirectionContext.Provider value={ directionContext }>
        <Flex w="100%" minH="100vh" alignItems="stretch">
          <NavigationDesktop/>
          <Flex flexDir="column" width="100%">
            <Header hasSearch={ hasSearch } hideOnScrollDown={ hideMobileHeaderOnScrollDown }/>
            <ErrorBoundary renderErrorScreen={ renderErrorScreen }>
              { renderedChildren }
            </ErrorBoundary>
          </Flex>
        </Flex>
      </ScrollDirectionContext.Provider>
    </SocketProvider>
  );
};

export default Page;
