import { Flex } from '@chakra-ui/react';
import React from 'react';

import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
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

  useGetCsrfToken();

  const renderErrorScreen = React.useCallback((error?: Error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusCode = (error?.cause as any)?.status || 500;
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
