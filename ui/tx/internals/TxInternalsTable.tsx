import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';
import type { Sort, SortField } from 'ui/tx/internals/utils';

interface Props {
  data: Array<InternalTransaction>;
  sort: Sort | undefined;
  onSortToggle: (field: SortField) => () => void;
  top: number;
  isLoading?: boolean;
}

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading }: Props) => {
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <AddressHighlightProvider>
      <Table>
        <Thead top={ top }>
          <Tr>
            <Th width="28%">Type</Th>
            <Th width="40%">From/To</Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('value') } columnGap={ 1 }>
                { sort?.includes('value') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                Value { currencyUnits.ether }
              </Link>
            </Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('gas-limit') } columnGap={ 1 }>
                { sort?.includes('gas-limit') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                Gas limit { currencyUnits.ether }
              </Link>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => (
            <TxInternalsTableItem key={ item.index.toString() + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
