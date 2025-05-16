import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Epoch } from 'types/api/epoch';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { default as Thead } from 'ui/shared/TheadSticky';

import EpochTableItem from './EpochTableItem';

interface Props {
  data: Array<Epoch>;
  isLoading?: boolean;
  top: number;
  page: number;
}

const EpochTable = ({ data, isLoading, top }: Props) => {

  return (
    <AddressHighlightProvider>
      <Table minWidth="1040px" fontWeight={ 500 }>
        <Thead top={ top }>
          <Tr>
            <Th width="300px" minW="250px">Epoch</Th>
            <Th width="300px" minW="250px">End Time</Th>
            <Th width="300px" minW="250px">Duration</Th>
            <Th width="300px" minW="250px">Total Fee (RWA)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <AnimatePresence initial={ false }>
            { data.map((item) => (
              <EpochTableItem
                key={ item.id }
                data={ item }
                isLoading={ isLoading }
              />
            )) }
          </AnimatePresence>
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default EpochTable;
