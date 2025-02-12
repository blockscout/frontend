import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type {
  ValidatorBlackfort,
  ValidatorsBlackfortSorting,
  ValidatorsBlackfortSortingField,
  ValidatorsBlackfortSortingValue,
} from 'types/api/validators';

import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { default as Thead } from 'ui/shared/TheadSticky';

import { VALIDATORS_BLACKFORT_SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorBlackfort>;
  sort: ValidatorsBlackfortSortingValue | undefined;
  setSorting: (val: ValidatorsBlackfortSortingValue | undefined) => void;
  isLoading?: boolean;
  top: number;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading, top }: Props) => {
  const sortIconTransform = sort?.includes('asc' as ValidatorsBlackfortSorting['order']) ? 'rotate(-90deg)' : 'rotate(90deg)';

  const onSortToggle = React.useCallback((field: ValidatorsBlackfortSortingField) => () => {
    const value = getNextSortValue<ValidatorsBlackfortSortingField, ValidatorsBlackfortSortingValue>(VALIDATORS_BLACKFORT_SORT_SEQUENCE, field)(sort);
    setSorting(value);
  }, [ sort, setSorting ]);

  return (
    <Table>
      <Thead top={ top }>
        <Tr>
          <Th>
            <Link
              display="flex"
              alignItems="center"
              onClick={ isLoading ? undefined : onSortToggle('address_hash') }
              columnGap={ 1 }
            >
              { sort?.includes('address') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
              Validator’s address
            </Link>
          </Th>
          <Th>Name</Th>
          <Th isNumeric>Commission</Th>
          <Th isNumeric>{ `Self bonded ${ currencyUnits.ether }` }</Th>
          <Th isNumeric>{ `Delegated amount ${ currencyUnits.ether }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
