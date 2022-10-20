import { Table, Thead, Tbody, Tr, Th, TableContainer, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import appConfig from 'configs/app/config';
import arrowIcon from 'icons/arrows/east.svg';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';
import type { Sort, SortField } from 'ui/tx/internals/utils';

interface Props {
  data: Array<InternalTransaction>;
  sort: Sort | undefined;
  onSortToggle: (field: SortField) => () => void;
}

const TxInternalsTable = ({ data, sort, onSortToggle }: Props) => {
  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <TableContainer width="100%" mt={ 6 }>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th width="28%">Type</Th>
            <Th width="28%">From</Th>
            <Th width="24px" px={ 0 }/>
            <Th width="28%">To</Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('value') } columnGap={ 1 }>
                { sort?.includes('value') && <Icon as={ arrowIcon } boxSize={ 4 } transform={ sortIconTransform }/> }
                Value { appConfig.network.currency.symbol }
              </Link>
            </Th>
            { /* no gas limit in api yet */ }
            { /* <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('gas-limit') } columnGap={ 1 }>
                { sort?.includes('gas-limit') && <Icon as={ arrowIcon } boxSize={ 4 } transform={ sortIconTransform }/> }
                Gas limit
              </Link>
            </Th> */ }
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item) => (
            <TxInternalsTableItem key={ item.transaction_hash } { ...item }/>
          )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TxInternalsTable;
