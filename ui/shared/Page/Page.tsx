import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import appConfig from 'configs/app/config';
import buildUrl from 'lib/api/buildUrl';
import { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import AppError from 'ui/shared/AppError/AppError';
import ErrorBoundary from 'ui/shared/ErrorBoundary';
import ErrorInvalidTxHash from 'ui/shared/ErrorInvalidTxHash';
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
  const nodeApiFetch = useFetch();

  useQuery(getResourceKey('csrf'), async() => {
    if (appConfig.host === appConfig.api.host) {
      const url = buildUrl('csrf');
      const apiResponse = await fetch(url, { credentials: 'include' });
      const csrfFromHeader = apiResponse.headers.get('x-bs-account-csrf');
      // eslint-disable-next-line no-console
      console.log('>>> RESPONSE HEADERS <<<');
      // eslint-disable-next-line no-console
      console.table([ {
        'content-length': apiResponse.headers.get('content-length'),
        'x-bs-account-csrf': csrfFromHeader,
      } ]);

      return csrfFromHeader ? { token: csrfFromHeader } : undefined;
    }

    return nodeApiFetch('/node-api/csrf');
  }, {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });

  const renderErrorScreen = React.useCallback((error?: Error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (error?.cause as any)?.error?.status || 500;
    const isInvalidTxHash = error?.message.includes('Invalid tx hash');

    if (wrapChildren) {
      const content = isInvalidTxHash ? <ErrorInvalidTxHash/> : <AppError statusCode={ statusCode } mt="50px"/>;
      return <PageContent isHomePage={ isHomePage }>{ content }</PageContent>;
    }

    return isInvalidTxHash ? <ErrorInvalidTxHash/> : <AppError statusCode={ 500 }/>;
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
