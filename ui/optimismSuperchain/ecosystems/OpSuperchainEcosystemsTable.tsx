import { chakra } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import OpSuperchainEcosystemsTableItem from './OpSuperchainEcosystemsTableItem';

interface Props {
  data: Array<multichain.ChainMetrics>;
  isLoading?: boolean;
}

const OpSuperchainEcosystemsTable = ({ data, isLoading }: Props) => {

  const chains = multichainConfig()?.chains;

  return (
    <TableRoot minW="1000px">
      <TableHeaderSticky>
        <TableRow>
          <TableColumnHeader width="30%">Chain name</TableColumnHeader>
          <TableColumnHeader width="17.5%">
            Active addresses
            <chakra.span color="text.secondary"> 7D</chakra.span>
          </TableColumnHeader>
          <TableColumnHeader width="17.5%">
            New addresses
            <chakra.span color="text.secondary"> 7D</chakra.span>
          </TableColumnHeader>
          <TableColumnHeader width="17.5%">
            Daily txs
            <chakra.span color="text.secondary"> 7D</chakra.span>
          </TableColumnHeader>
          <TableColumnHeader width="17.5%">TPS</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <MultichainProvider key={ item.chain_id + (isLoading ? `_${ index }` : '') } chainId={ item.chain_id }>
            <OpSuperchainEcosystemsTableItem
              data={ item }
              isLoading={ isLoading }
              chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            />
          </MultichainProvider>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(OpSuperchainEcosystemsTable);
