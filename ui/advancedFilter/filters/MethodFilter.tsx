import { Flex, Checkbox, CheckboxGroup, Spinner, chakra } from '@chakra-ui/react';
import differenceBy from 'lodash/differenceBy';
import isEqual from 'lodash/isEqual';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { AdvancedFilterMethodInfo, AdvancedFilterParams } from 'types/api/advancedFilter';

import useApiQuery from 'lib/api/useApiQuery';
import Tag from 'ui/shared/chakra/Tag';
import FilterInput from 'ui/shared/filters/FilterInput';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

const RESET_VALUE = 'all';

const FILTER_PARAM = 'methods';
const NAMES_PARAM = 'methods_names';

type Props = {
  value?: Array<AdvancedFilterMethodInfo>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string>) => void;
  onClose?: () => void;
}

const MethodFilter = ({ value = [], handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<AdvancedFilterMethodInfo>>([ ...value ]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const [ methodsList, setMethodsList ] = React.useState<Array<AdvancedFilterMethodInfo>>([]);

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const methodsQuery = useApiQuery('advanced_filter_methods', {
    queryParams: { q: searchTerm },
    queryOptions: { refetchOnMount: false },
  });

  React.useEffect(() => {
    if (!methodsList.length && methodsQuery.data) {
      setMethodsList([ ...value, ...differenceBy(methodsQuery.data, value, i => i.method_id) ]);
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
        setCurrentValue(prev => {
          return checked ? [ ...prev, methodInfo ] : prev.filter(i => i.method_id !== id);
        });
        searchTerm && checked &&
        setMethodsList(prev => [ methodInfo, ...(prev.filter(m => m.method_id !== id) || []) ]);
      }
    }
  }, [ methodsQuery.data, searchTerm ]);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    handleFilterChange(FILTER_PARAM, currentValue.map(item => item.method_id));
    handleFilterChange(NAMES_PARAM, currentValue.map(item => item.name || ''));
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Method"
      isFilled={ Boolean(currentValue.length) }
      isTouched={ !isEqual(currentValue.map(i => JSON.stringify(i)).sort(), value.map(i => JSON.stringify(i)).sort()) }
      onFilter={ onFilter }
      onReset={ onReset }
      onClose={ onClose }
      hasReset
    >
      <FilterInput
        size="xs"
        onChange={ onSearchChange }
        placeholder="Find by function name/ method ID"
        mb={ 3 }
      />
      { methodsQuery.isLoading && <Spinner/> }
      { methodsQuery.isError && <span>Something went wrong. Please try again.</span> }
      { Boolean(searchTerm) && methodsQuery.data?.length === 0 && <span>No results found.</span> }
      { methodsQuery.data && (
        // added negative margin because of checkbox focus styles & overflow hidden
        <Flex display="flex" flexDir="column" rowGap={ 3 } maxH="250px" overflowY="scroll" ml="-4px">
          <CheckboxGroup value={ currentValue.length ? currentValue.map(i => i.method_id) : [ 'all' ] }>
            { (searchTerm ? methodsQuery.data : (methodsList || [])).map(method => (
              <Checkbox
                key={ method.method_id }
                value={ method.method_id }
                id={ method.method_id }
                onChange={ handleChange }
                pl={ 1 }
                sx={{
                  '.chakra-checkbox__label': {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flexGrow: 1,
                  },
                }}
              >
                <Flex justifyContent="space-between" alignItems="center" id={ method.method_id }>
                  <chakra.span overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ method.name || method.method_id }</chakra.span>
                  <Tag colorScheme="gray" isTruncated ml={ 2 }>
                    { method.method_id }
                  </Tag>
                </Flex>
              </Checkbox>
            )) }
          </CheckboxGroup>
        </Flex>
      ) }
    </TableColumnFilter>
  );
};

export default MethodFilter;
