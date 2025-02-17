import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';
import type { VerifiedContractsSorting, VerifiedContractsSortingField, VerifiedContractsSortingValue } from 'types/api/verifiedContracts';

import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { SORT_SEQUENCE } from 'ui/verifiedContracts/utils';

import VerifiedContractsTableItem from './VerifiedContractsTableItem';

interface Props {
  data: Array<VerifiedContract>;
  sort: VerifiedContractsSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  isLoading?: boolean;
}

const VerifiedContractsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const sortIconTransform = sort?.includes('asc' as VerifiedContractsSorting['order']) ? 'rotate(-90deg)' : 'rotate(90deg)';

  const onSortToggle = React.useCallback((field: VerifiedContractsSortingField) => () => {
    const value = getNextSortValue<VerifiedContractsSortingField, VerifiedContractsSortingValue>(SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot>
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="50%">Contract</TableColumnHeader>
          <TableColumnHeader width="130px" isNumeric>
            <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ isLoading ? undefined : onSortToggle('balance') } columnGap={ 1 }>
              { sort?.includes('balance') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
              Balance { currencyUnits.ether }
            </Link>
          </TableColumnHeader>
          <TableColumnHeader width="130px" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('transactions_count') }
              columnGap={ 1 }
            >
              { sort?.includes('transactions_count') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
              Txs
            </Link>
          </TableColumnHeader>
          <TableColumnHeader width="50%">Language / Compiler version</TableColumnHeader>
          <TableColumnHeader width="80px">Settings</TableColumnHeader>
          <TableColumnHeader width="150px">Verified</TableColumnHeader>
          <TableColumnHeader width="130px">License</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <VerifiedContractsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(VerifiedContractsTable);
