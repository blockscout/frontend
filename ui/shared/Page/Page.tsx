import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
}

const Page = ({ children, wrapChildren = true }: Props) => {
  const router = useRouter();
  const fetch = useFetch();

  const networkType = router.query.network_type;
  const networkSubType = router.query.network_sub_type;

  useQuery<unknown, unknown, unknown>([ 'csrf' ], async() => await fetch('/api/account/csrf'));

  React.useEffect(() => {
    if (typeof networkType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_TYPE, networkType);
    }
    if (typeof networkSubType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_SUB_TYPE, networkSubType);
    }
  }, [ networkType, networkSubType ]);

  const renderedChildren = wrapChildren ? (
    <PageContent>{ children }</PageContent>
  ) : children;

  return (
    <Flex w="100%" minH="100vh" alignItems="stretch">
      <NavigationDesktop/>
      <Flex flexDir="column" width="100%">
        <Header/>
        { renderedChildren }
      </Flex>
    </Flex>
  );
};

export default Page;
