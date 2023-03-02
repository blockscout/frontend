import { Box } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';

import appConfig from 'configs/app/config';
import buildUrl from 'lib/api/buildUrl';
import 'graphiql/graphiql.css';

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const initialQuery = `{
    transaction(
      hash: "${ appConfig.graphQL.defaultTxnHash }"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }`;

  const graphqlUrl = buildUrl('graphql');

  const fetcher = createGraphiQLFetcher({
    url: graphqlUrl,
    // graphql ws implementation with absinthe plugin is incompatible with graphiql-ws protocol
    // or the older one subscriptions-transport-ws
    // so we (isstuev & vbaranov) decided to configure playground without subscriptions
    // in case of any complaint consider reconfigure the graphql ws server with absinthe_graphql_ws package
    // subscriptionUrl: `wss://${appConfig.host}/socket/`,
  });

  return (
    <Box h="100vh" overflowX="scroll" sx={ graphQLStyle }>
      <Box h="100vh" minW="900px" sx={ graphQLStyle }>
        <GraphiQL fetcher={ fetcher } defaultQuery={ initialQuery }/>
      </Box>
    </Box>
  );
};

export default GraphQL;
