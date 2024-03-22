import { Table as ChakraTable, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppWithSecurityReport, ContractListTypes } from 'types/client/marketplace';

import { default as Thead } from 'ui/shared/TheadSticky';

import TableItem from './TableItem';

type Props = {
  apps: Array<MarketplaceAppWithSecurityReport>;
  isLoading?: boolean;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Security view') => void;
  onAppClick: (event: MouseEvent, id: string) => void;
  onInfoClick: (id: string) => void;
  showContractList: (id: string, type: ContractListTypes) => void;
}

const Table = ({ apps, isLoading, favoriteApps, onFavoriteClick, onAppClick, onInfoClick, showContractList }: Props) => {
  return (
    <ChakraTable>
      <Thead top={ 0 }>
        <Tr>
          <Th w="5%"></Th>
          <Th w="40%">App</Th>
          <Th w="15%">Contracts score</Th>
          <Th w="10%">Total</Th>
          <Th w="10%">Verified</Th>
          <Th w="20%"></Th>
        </Tr>
      </Thead>
      <Tbody>
        { apps.map((app, index) => (
          <TableItem
            key={ app.id + (isLoading ? index : '') }
            app={ app }
            isLoading={ isLoading }
            isFavorite={ favoriteApps.includes(app.id) }
            onFavoriteClick={ onFavoriteClick }
            onAppClick={ onAppClick }
            onInfoClick={ onInfoClick }
            showContractList={ showContractList }
          />
        )) }
      </Tbody>
    </ChakraTable>
  );
};

export default Table;
