import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type {
  ValidatorStability,
  ValidatorsStabilitySorting,
  ValidatorsStabilitySortingField,
  ValidatorsStabilitySortingValue,
} from 'types/api/validators';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { default as Thead } from 'ui/shared/TheadSticky';

import { VALIDATORS_STABILITY_SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorStability>;
  sort: ValidatorsStabilitySortingValue | undefined;
  setSorting: (val: ValidatorsStabilitySortingValue | undefined) => void;
  isLoading?: boolean;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const sortIconTransform = sort?.includes('asc' as ValidatorsStabilitySorting['order']) ? 'rotate(-90deg)' : 'rotate(90deg)';

  const onSortToggle = React.useCallback((field: ValidatorsStabilitySortingField) => () => {
    const value = getNextSortValue<ValidatorsStabilitySortingField, ValidatorsStabilitySortingValue>(VALIDATORS_STABILITY_SORT_SEQUENCE, field)(sort);
    setSorting(value);
  }, [ sort, setSorting ]);

  return (
    <Table variant="simple" size="sm">
      <Thead top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th width="50%">Validator’s address</Th>
          <Th width="25%">
            <Link
              display="flex"
              alignItems="center"
              onClick={ isLoading ? undefined : onSortToggle('state') }
              columnGap={ 1 }
            >
              { sort?.includes('state') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
              Status
            </Link>
          </Th>
          <Th width="25%" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('blocks_validated') }
              columnGap={ 1 }
            >
              { sort?.includes('blocks_validated') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
              Blocks
            </Link>
          </Th>
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
