import { Table, Tbody, Tr, Th, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import config from 'configs/app';
import arrowIcon from 'icons/arrows/east.svg';
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
    <Table variant="simple" size="sm">
      <Thead top={ top }>
        <Tr>
          <Th width="28%">Type</Th>
          <Th width="20%">From</Th>
          <Th width="24px" px={ 0 }/>
          <Th width="20%">To</Th>
          <Th width="16%" isNumeric>
            <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('value') } columnGap={ 1 }>
              { sort?.includes('value') && <Icon as={ arrowIcon } boxSize={ 4 } transform={ sortIconTransform }/> }
                Value { config.chain.currency.symbol }
            </Link>
          </Th>
          <Th width="16%" isNumeric>
            <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('gas-limit') } columnGap={ 1 }>
              { sort?.includes('gas-limit') && <Icon as={ arrowIcon } boxSize={ 4 } transform={ sortIconTransform }/> }
                Gas limit { config.chain.currency.symbol }
            </Link>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <TxInternalsTableItem key={ item.transaction_hash + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default TxInternalsTable;
