import { Flex, Select, Input, InputGroup, InputRightElement, VStack, IconButton } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';

import ClearButton from 'ui/shared/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

import ColumnFilter from '../ColumnFilter';

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
}

type InputProps = {
  address?: string;
  mode?: AddressFilterMode;
  isLast: boolean;
  onModeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onRemove: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddFieldClick: () => void;
}

const AddressFilterInput = ({ address, mode, onModeChange, onRemove, onChange, isLast, onAddFieldClick }: InputProps) => {
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
          <ClearButton onClick={ onRemove }/>
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

const AddressFilter = ({ type, value, handleFilterChange, columnName, isLoading }: Props) => {
  const [ currentValue, setCurrentValue ] =
    React.useState<Array<{ address: string; mode: AddressFilterMode }>>([ ...value, emptyItem ] || [ emptyItem ]);

  const handleModeSelectChange = React.useCallback((index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AddressFilterMode;
    setCurrentValue(prev => {
      prev[index].mode = value;
      return [ ...prev ];
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

  const handleRemove = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      prev.splice(index, 1);
      return [ ...prev ];
    });
  }, []);

  const onAddFieldClick = React.useCallback(() => {
    setCurrentValue(prev => [ ...prev, emptyItem ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([ emptyItem ]), []);

  const onFilter = React.useCallback(() => {
    const includeFilterParam = type === 'from' ? FILTER_PARAM_FROM_INCLUDE : FILTER_PARAM_TO_INCLUDE;
    const excludeFilterParam = type === 'from' ? FILTER_PARAM_FROM_EXCLUDE : FILTER_PARAM_TO_EXCLUDE;
    const includeValue = currentValue.filter(i => i.mode === 'include').map(i => i.address);
    const excludeValue = currentValue.filter(i => i.mode === 'exclude').map(i => i.address);

    handleFilterChange(includeFilterParam, includeValue.length ? includeValue : undefined);
    handleFilterChange(excludeFilterParam, excludeValue.length ? excludeValue : undefined);
  }, [ handleFilterChange, currentValue, type ]);

  return (
    <ColumnFilter
      columnName={ columnName }
      title={ type === 'from' ? 'From address' : 'To address' }
      isFilled={ Boolean(currentValue[0].address) }
      isActive={ Boolean(value.length) }
      onFilter={ onFilter }
      onReset={ onReset }
      isLoading={ isLoading }
      w="382px"
    >
      <VStack gap={ 2 }>
        { currentValue.map((item, index) => (
          <AddressFilterInput
            key={ index }
            address={ item.address }
            mode={ item.mode }
            isLast={ index === currentValue.length - 1 }
            onModeChange={ handleModeSelectChange(index) }
            onRemove={ handleRemove(index) }
            onChange={ handleAddressChange(index) }
            onAddFieldClick={ onAddFieldClick }
          />
        )) }
      </VStack>
    </ColumnFilter>
  );
};

export default AddressFilter;
