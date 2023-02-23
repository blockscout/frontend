import { Box } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import 'graphiql/graphiql.css';

const GraphQL = () => {

  const fetcher = createGraphiQLFetcher({
    url: 'https://base-goerli.blockscout.com/graphiql',
  });
  return (
    <Box h="100vh" sx={{}}>
      <GraphiQL fetcher={ fetcher }/>
    </Box>
  );
};

export default GraphQL;
