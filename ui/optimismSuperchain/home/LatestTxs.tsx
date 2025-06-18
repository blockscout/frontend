import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Heading } from 'toolkit/chakra/heading';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';

import LatestTxsCrossChain from './LatestTxsCrossChain';
import LatestTxsLocal from './LatestTxsLocal';

const LatestTxs = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const [ chainValue, setChainValue ] = React.useState<Array<string> | undefined>(
    [ getQueryParamString(router.query['chain-slug']) ?? multichainConfig()?.chains[0]?.slug ].filter(Boolean),
  );

  const handleChainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setChainValue(value);
    router.push({
      query: {
        ...router.query,
        'chain-slug': value[0],
      },
    }, undefined, { shallow: true });
  }, [ router ]);

  const tabs = [
    {
      id: 'cross_chain_txs',
      title: 'Cross-chain',
      component: <LatestTxsCrossChain/>,
    },
    {
      id: 'local_txs',
      title: 'Local',
      component: chainValue ? <LatestTxsLocal key={ chainValue[0] } chainSlug={ chainValue[0] }/> : null,
    },
  ];

  const rightSlot = tab === 'local_txs' ? (
    <ChainSelect
      loading={ false }
      value={ chainValue }
      onValueChange={ handleChainValueChange }
      w="fit-content"
    />
  ) : null;

  return (
    <Box as="section" mt={ 8 }>
      <Heading level="3" mb={ 6 }>Latest transactions</Heading>
      <RoutedTabs
        tabs={ tabs }
        rightSlot={ rightSlot }
      />
    </Box>
  );
};

export default React.memo(LatestTxs);
