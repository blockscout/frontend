import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import useScrollDirection from 'lib/hooks/useScrollDirection';
import ScrollDirectionContext from 'ui/ScrollDirectionContext';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  hideMobileHeaderOnScrollDown?: boolean;
}

const Page = ({
  children,
  wrapChildren = true,
  hideMobileHeaderOnScrollDown,
}: Props) => {
  const fetch = useFetch();

  useQuery<unknown, unknown, unknown>([ QueryKeys.csrf ], async() => await fetch('/node-api/account/csrf'), {
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });

  const directionContext = useScrollDirection();

  const renderedChildren = wrapChildren ? (
    <PageContent>{ children }</PageContent>
  ) : children;

  return (
    <ScrollDirectionContext.Provider value={ directionContext }>
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Flex flexDir="column" width="100%">
          <Header hideOnScrollDown={ hideMobileHeaderOnScrollDown }/>
          { renderedChildren }
        </Flex>
      </Flex>
    </ScrollDirectionContext.Provider>
  );
};

export default Page;
