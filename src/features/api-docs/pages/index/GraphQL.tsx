// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';
import buildUrl from 'src/api/utils/build-url';

import config from 'src/config';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';
import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';
import { isBrowser } from 'src/toolkit/utils/isBrowser';

import 'graphiql/graphiql.css';

const feature = config.features.apiDocs;

const graphQLStyle = {
  '.graphiql-container': {
    backgroundColor: 'unset',
  },
};

const GraphQL = () => {

  const latestTxsQuery = useApiQuery('core:homepage_txs', {
    queryOptions: {
      enabled: feature.isEnabled,
    },
  });

  const { colorMode } = useColorMode();

  const graphqlTheme = window.localStorage.getItem('graphiql:theme');

  // colorModeState used as a key to re-render GraphiQL component after color mode change
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

  if (latestTxsQuery.isPending) {
    return <ContentLoader/>;
  }

  const latestTxHash = latestTxsQuery.data?.[0]?.hash;

  const initialQuery = latestTxHash ? `{
    transaction(
      hash: "${ latestTxHash }"
    ) {
      hash
      blockNumber
      value
      gasUsed
    }
  }` : `{
    address(
      hash: "${ ZERO_ADDRESS }"
    ) {
      hash
      fetchedCoinBalance
    }
  }`;

  const graphqlUrl = buildUrl('core:graphql');

  const fetcher = createGraphiQLFetcher({
    url: graphqlUrl,
    // No subscriptions: the GraphQL WS server (absinthe plugin) speaks neither the graphql-ws protocol nor the
    // older subscriptions-transport-ws. Reconfiguring it with the absinthe_graphql_ws package would allow them.
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
