import { chakra, VStack, Grid, GridItem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import PageContent from 'ui/shared/Page/PageContent';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
  wrapChildren?: boolean;
  className?: string;
}

const Page = ({ children, wrapChildren = true, className }: Props) => {
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <VStack width="100%" minH="100vh" spacing={ 0 } className={ className }>
        <Header/>
        { renderedChildren }
      </VStack>
    );
  }

  return (
    <Grid templateColumns="auto 1fr" templateRows="auto 1fr" rowGap="52px" className={ className }>
      <GridItem rowSpan={ 2 } colSpan={ 1 }>
        <NavigationDesktop/>
      </GridItem>
      <GridItem>
        <Header/>
      </GridItem>
      <GridItem>
        { renderedChildren }
      </GridItem>
    </Grid>
  );
};

export default chakra(Page);
