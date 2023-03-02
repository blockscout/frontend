import { Spinner, useColorMode } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <Spinner/>,
  ssr: false,
});
import Head from 'next/head';
import React from 'react';

import isBrowser from 'lib/isBrowser';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const AppsPage: NextPage = () => {
  const { colorMode } = useColorMode();
  const [ show, setShow ] = React.useState(true);

  React.useEffect(() => {
    // force re-render GraphQL component to apply new theme
    setShow(true);
  }, [ show ]);

  React.useEffect(() => {
    if (isBrowser()) {
      const graphqlTheme = window.localStorage.getItem('graphiql:theme');
      if (graphqlTheme !== colorMode) {
        window.localStorage.setItem('graphiql:theme', colorMode);
        setShow(false);
      }
    }
  }, [ colorMode ]);

  return (
    <Page>
      <Head><title>Graph Page</title></Head>
      <PageTitle text="GraphQL playground"/>
      { show && <GraphQL key={ colorMode }/> }
    </Page>
  );
};

export default AppsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
