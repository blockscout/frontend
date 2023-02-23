import { Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
const GraphQL = dynamic(() => import('ui/graphQL/GraphQL'), {
  loading: () => <Spinner/>,
  ssr: false,
});
import React from 'react';

const GraphQLPage: NextPage = () => {
  return <GraphQL/>;
};

export default GraphQLPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
