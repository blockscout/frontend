import { Box } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import 'graphiql/graphiql.css';

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const initialQuery = `{
    transaction(
      hash: "0x69e3923eef50eada197c3336d546936d0c994211492c9f947a24c02827568f9f"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }`;
  const fetcher = createGraphiQLFetcher({
    url: 'https://base-goerli.blockscout.com/graphiql',
  });

  return (
    <Box h="100vh" sx={ graphQLStyle }>
      <GraphiQL fetcher={ fetcher } defaultQuery={ initialQuery }/>
    </Box>
  );
};

export default GraphQL;
