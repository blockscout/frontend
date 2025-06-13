import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Heading } from 'toolkit/chakra/heading';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import SubchainSelect from 'ui/shared/multichain/SubchainSelect';

import LatestTxsCrossChain from './LatestTxsCrossChain';
import LatestTxsLocal from './LatestTxsLocal';

const LatestTxs = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const [ subchainValue, setSubchainValue ] = React.useState<Array<string> | undefined>(
    [ getQueryParamString(router.query['subchain-slug']) ?? multichainConfig()?.chains[0]?.slug ].filter(Boolean),
  );

  const handleSubchainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSubchainValue(value);
    router.push({
      query: {
        ...router.query,
        'subchain-slug': value[0],
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
      component: subchainValue ? <LatestTxsLocal key={ subchainValue[0] } subchainSlug={ subchainValue[0] }/> : null,
    },
  ];

  const rightSlot = tab === 'local_txs' ? (
    <SubchainSelect
      loading={ false }
      value={ subchainValue }
      onValueChange={ handleSubchainValueChange }
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
