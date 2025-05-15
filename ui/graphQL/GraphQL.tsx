import { Box } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import 'graphiql/graphiql.css';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { isBrowser } from 'toolkit/utils/isBrowser';

const feature = config.features.graphqlApiDocs;

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const { colorMode } = useColorMode();

  const graphqlTheme = window.localStorage.getItem('graphiql:theme');

  // colorModeState used as a key to re-render GraphiQL conponent after color mode change
  const [ colorModeState, setColorModeState ] = React.useState(graphqlTheme);

  React.useEffect(() => {
    if (isBrowser()) {
      if (graphqlTheme !== colorMode) {
        window.localStorage.setItem('graphiql:theme', colorMode);
        setColorModeState(colorMode);
      }
    }
  }, [ colorMode, graphqlTheme ]);

  if (!feature.isEnabled) {
    return null;
  }

  const initialQuery = `{
    transaction(
      hash: "${ feature.defaultTxHash }"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }`;

  const graphqlUrl = buildUrl('general:graphql');

  const fetcher = createGraphiQLFetcher({
    url: graphqlUrl,
    // graphql ws implementation with absinthe plugin is incompatible with graphiql-ws protocol
    // or the older one subscriptions-transport-ws
    // so we (isstuev & vbaranov) decided to configure playground without subscriptions
    // in case of any complaint consider reconfigure the graphql ws server with absinthe_graphql_ws package
    // subscriptionUrl: `wss://${config.app.host}/socket/`,
  });

  return (
    <Box h="100vh" overflowX="scroll" css={ graphQLStyle }>
      <Box h="100vh" minW="900px" css={ graphQLStyle }>
        <GraphiQL fetcher={ fetcher } defaultQuery={ initialQuery } key={ colorModeState }/>
      </Box>
    </Box>
  );
};

export default GraphQL;
