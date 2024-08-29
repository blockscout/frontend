import { Flex, Select, Input, InputGroup, InputRightElement, VStack, IconButton } from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import ClearButton from 'ui/shared/ClearButton';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';
import IconSvg from 'ui/shared/IconSvg';

const FILTER_PARAM_TO_INCLUDE = 'to_address_hashes_to_include';
const FILTER_PARAM_FROM_INCLUDE = 'from_address_hashes_to_include';
const FILTER_PARAM_TO_EXCLUDE = 'to_address_hashes_to_exclude';
const FILTER_PARAM_FROM_EXCLUDE = 'from_address_hashes_to_exclude';

export type AddressFilterMode = 'include' | 'exclude';

type Value = Array<{ address: string; mode: AddressFilterMode }>;

type Props = {
  value: Value;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string> | undefined) => void;
  columnName: string;
  type: 'from' | 'to';
  isLoading?: boolean;
  onClose?: () => void;
}

type InputProps = {
  address?: string;
  mode?: AddressFilterMode;
  isLast: boolean;
  onModeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onAddFieldClick: () => void;
}

const AddressFilterInput = ({ address, mode, onModeChange, onChange, onClear, isLast, onAddFieldClick }: InputProps) => {
  return (
    <Flex alignItems="center" w="100%">
      <Select
        size="xs"
        borderRadius="base"
        value={ mode || 'include' }
        onChange={ onModeChange }
        minW="105px"
        w="105px"
        mr={ 3 }
      >
        <option value="include">Include</option>
        <option value="exclude">Exclude</option>
      </Select>
      <InputGroup size="xs" flexGrow={ 1 }>
        <Input value={ address } onChange={ onChange } placeholder="Smart contract / Address (0x...)*" size="xs" autoComplete="off"/>
        <InputRightElement>
          <ClearButton onClick={ onClear } isDisabled={ !address }/>
        </InputRightElement>
      </InputGroup>
      { isLast && (
        <IconButton
          aria-label="add"
          variant="outline"
          minW="30px"
          w="30px"
          h="30px"
          ml={ 2 }
          onClick={ onAddFieldClick }
          icon={ <IconSvg name="plus" w="20px" h="20px"/> }
        />
      ) }
    </Flex>
  );
};

const emptyItem = { address: '', mode: 'include' as AddressFilterMode };

const AddressFilter = ({ type, value = [], handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] =
    React.useState<Array<{ address: string; mode: AddressFilterMode }>>([ ...value, emptyItem ]);

  const handleModeSelectChange = React.useCallback((index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AddressFilterMode;
    setCurrentValue(prev => {
      prev[index] = { ...prev[index], mode: value };
      return [ ...prev ];
    });
  }, []);

  const handleAddressClear = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      const newVal = [ ...prev ];
      newVal[index] = { ...newVal[index], address: '' };
      return newVal;
    });
  }, []);

  const handleAddressChange = React.useCallback((index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setCurrentValue(prev => {
      const newVal = [ ...prev ];
      newVal[index] = { ...newVal[index], address: value };
      return newVal;
    });
  }, []);

  const onAddFieldClick = React.useCallback(() => {
    setCurrentValue(prev => [ ...prev, emptyItem ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([ emptyItem ]), []);

  const onFilter = React.useCallback(() => {
    const includeFilterParam = type === 'from' ? FILTER_PARAM_FROM_INCLUDE : FILTER_PARAM_TO_INCLUDE;
    const excludeFilterParam = type === 'from' ? FILTER_PARAM_FROM_EXCLUDE : FILTER_PARAM_TO_EXCLUDE;
    const includeValue = currentValue.filter(i => i.mode === 'include').map(i => i.address).filter(Boolean);
    const excludeValue = currentValue.filter(i => i.mode === 'exclude').map(i => i.address).filter(Boolean);

    handleFilterChange(includeFilterParam, includeValue.length ? includeValue : undefined);
    handleFilterChange(excludeFilterParam, excludeValue.length ? excludeValue : undefined);
  }, [ handleFilterChange, currentValue, type ]);

  return (
    <TableColumnFilter
      title={ type === 'from' ? 'From address' : 'To address' }
      isFilled={ Boolean(currentValue[0].address) }
      isTouched={ !isEqual(currentValue.filter(i => i.address).map(i => JSON.stringify(i)).sort(), value.map(i => JSON.stringify(i)).sort()) }
      onFilter={ onFilter }
      onReset={ onReset }
      onClose={ onClose }
      hasReset
    >
      <VStack gap={ 2 }>
        { currentValue.map((item, index) => (
          <AddressFilterInput
            key={ index }
            address={ item.address }
            mode={ item.mode }
            isLast={ index === currentValue.length - 1 }
            onModeChange={ handleModeSelectChange(index) }
            onChange={ handleAddressChange(index) }
            onClear={ handleAddressClear(index) }
            onAddFieldClick={ onAddFieldClick }
          />
        )) }
      </VStack>
    </TableColumnFilter>
  );
};

export default AddressFilter;
