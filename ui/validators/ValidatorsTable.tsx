import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type {
  Validator,
  ValidatorsSorting,
  ValidatorsSortingField,
  ValidatorsSortingValue,
} from 'types/api/validators';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { default as Thead } from 'ui/shared/TheadSticky';

import { SORT_SEQUENCE } from './utils';
import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<Validator>;
  sort: ValidatorsSortingValue | undefined;
  setSorting: (val: ValidatorsSortingValue | undefined) => void;
  isLoading?: boolean;
}

const ValidatorsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const sortIconTransform = sort?.includes('asc' as ValidatorsSorting['order']) ?
    'rotate(-90deg)' :
    'rotate(90deg)';

  const onSortToggle = React.useCallback(
    (field: ValidatorsSortingField) => () => {
      const value = getNextSortValue<
        ValidatorsSortingField,
        ValidatorsSortingValue
      >(
        SORT_SEQUENCE,
        field,
      )(sort);
      setSorting(value);
    },
    [ sort, setSorting ],
  );

  return (
    <Table variant="simple" size="sm">
      <Thead top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th columnGap={ 1 } width="15%">
            Validator ID
          </Th>
          <Th columnGap={ 1 } width="30%">
            Validator Address
          </Th>
          <Th width="20%">
            <Link
              display="flex"
              alignItems="center"
              onClick={ isLoading ? undefined : onSortToggle('state') }
              columnGap={ 1 }
            >
              { sort?.includes('state') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                />
              ) }
              Status
            </Link>
          </Th>
          <Th width="20%" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('blocks_validated') }
              columnGap={ 1 }
            >
              { sort?.includes('blocks_validated') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                />
              ) }
              Total RWA Staked
            </Link>
          </Th>
          <Th width="20%" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('blocks_validated') }
              columnGap={ 1 }
            >
              { sort?.includes('blocks_validated') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                />
              ) }
              Delegated (RWA)
            </Link>
          </Th>
          <Th width="20%" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('blocks_validated') }
              columnGap={ 1 }
            >
              { sort?.includes('blocks_validated') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                />
              ) }
              Self Staked (RWA)
            </Link>
          </Th>
          <Th width="20%" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={ isLoading ? undefined : onSortToggle('blocks_validated') }
              columnGap={ 1 }
            >
              { sort?.includes('blocks_validated') && (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 4 }
                  transform={ sortIconTransform }
                />
              ) }
              Total Reward (RWA)
            </Link>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.address.hash + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
