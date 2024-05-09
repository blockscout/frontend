import { Flex, Checkbox, CheckboxGroup, Spinner, chakra } from '@chakra-ui/react';
import difference from 'lodash/difference';
import without from 'lodash/without';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AdvancedFilterMethodInfo, AdvancedFilterParams } from 'types/api/advancedFilter';

import useApiQuery from 'lib/api/useApiQuery';
import Tag from 'ui/shared/chakra/Tag';
import FilterInput from 'ui/shared/filters/FilterInput';

import ColumnFilter from '../ColumnFilter';

const RESET_VALUE = 'all';

const FILTER_PARAM = 'methods';

// !!!!!!
// test when search params are ready

type Props = {
  value?: Array<AdvancedFilterMethodInfo>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string>) => void;
  columnName: string;
}

const MethodFilter = ({ value = [], handleFilterChange, columnName }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<AdvancedFilterMethodInfo>>(value);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const [ methodsList, setMethodsList ] = React.useState<Array<AdvancedFilterMethodInfo>>();

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // q should work whem Max replace method /search with common one
  const methodsQuery = useApiQuery('advanced_filter_methods', { queryParams: { q: searchTerm } });
  React.useEffect(() => {
    if (!methodsList && methodsQuery.data) {
      setMethodsList([ ...difference(value, methodsQuery.data), ...methodsQuery.data ]);
    }
  }, [ methodsQuery.data, value, methodsList ]);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const id = event.target.id as string | 'all';
    if (id === RESET_VALUE) {
      setCurrentValue([]);
      setMethodsList(methodsQuery.data || []);
    } else {
      const methodInfo = methodsQuery.data?.find(m => m.method_id === id);
      if (methodInfo) {
        setCurrentValue(prev => checked ? [ ...prev, methodInfo ] : without(prev, methodInfo));
        searchTerm && checked && setMethodsList(prev => [ methodInfo, ...(prev || []) ]);
      }
    }
  }, [ methodsQuery.data, searchTerm ]);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    handleFilterChange(FILTER_PARAM, currentValue.map(item => item.method_id));
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilter
      columnName={ columnName }
      title="Method"
      isActive={ Boolean(value.length) }
      isFilled={ Boolean(currentValue.length) }
      onFilter={ onFilter }
      onReset={ onReset }
      w="350px"
    >
      <FilterInput
        size="xs"
        onChange={ onSearchChange }
        placeholder="Find by function name/ method ID"
        mb={ 3 }
      />
      { methodsQuery.isLoading && <Spinner/> }
      { /* fixme */ }
      { methodsQuery.isError && <span>error</span> }
      { methodsQuery.data && (
        <Flex display="flex" flexDir="column" rowGap={ 3 } maxH="250px" overflowY="scroll">
          <CheckboxGroup value={ currentValue.length ? currentValue.map(i => i.method_id) : [ 'all' ] }>
            { (searchTerm ? methodsQuery.data : (methodsList || [])).map(method => (
              <Flex justifyContent="space-between" alignItems="center" key={ method.method_id }>
                <Checkbox
                  value={ method.method_id }
                  id={ method.method_id }
                  onChange={ handleChange }
                  overflow="hidden"
                  sx={{
                    '.chakra-checkbox__label': {
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    },
                  }}
                >
                  <chakra.span overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ method.name }</chakra.span>
                </Checkbox>
                <Tag colorScheme="gray" isTruncated ml={ 2 }>
                  { method.method_id }
                </Tag>
              </Flex>
            )) }
          </CheckboxGroup>
        </Flex>
      ) }
    </ColumnFilter>
  );
};

export default MethodFilter;
