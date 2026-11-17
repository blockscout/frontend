// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Spinner, chakra } from '@chakra-ui/react';
import { isEqual, differenceBy } from 'es-toolkit';
import React from 'react';

import type { AdvancedFilterParams } from '../../types/api';
import type { schemas } from '@blockscout/api-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ColumnFilterContent from 'src/shared/filters/ColumnFilterContent';
import ColumnFilterContentSection from 'src/shared/filters/ColumnFilterContentSection';
import useDebounce from 'src/shared/hooks/useDebounce';

import { Badge } from 'src/toolkit/chakra/badge';
import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const RESET_VALUE = 'all';

const FILTER_PARAM = 'methods';
const NAMES_PARAM = 'methods_names';

type Props = {
  value?: Array<schemas['AdvancedFilterMethod']>;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string>) => void;
};

const MethodFilter = ({ value = [], handleFilterChange }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Array<schemas['AdvancedFilterMethod']>>([ ...value ]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [ methodsList, setMethodsList ] = React.useState<Array<schemas['AdvancedFilterMethod']>>([]);

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const methodsQuery = useApiQuery('core:advanced_filter_methods', {
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { refetchOnMount: false },
  });

  React.useEffect(() => {
    if (!methodsList.length && methodsQuery.data) {
      setMethodsList([ ...value, ...differenceBy(methodsQuery.data, value, i => i.method_id) ]);
    }
  }, [ methodsQuery.data, value, methodsList ]);

  const handleChange: React.FormEventHandler<HTMLLabelElement> = React.useCallback((event) => {
    const checked = (event.target as HTMLInputElement).checked;
    const id = event.currentTarget.getAttribute('data-id');

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

  const methods = (searchTerm ? methodsQuery.data : methodsList) || [];

  return (
    <ColumnFilterContent
      isTouched={ !isEqual(currentValue.map(i => JSON.stringify(i)).sort(), value.map(i => JSON.stringify(i)).sort()) }
      onFilter={ onFilter }
    >
      <ColumnFilterContentSection title="Method" onReset={ onReset } isFilled={ Boolean(currentValue.length) }>
        <FilterInput
          size="sm"
          onChange={ onSearchChange }
          placeholder="Find by function name/ method ID"
        />
        { methodsQuery.isLoading && <Spinner/> }
        { methodsQuery.isError && <span>Something went wrong. Please try again.</span> }
        { Boolean(searchTerm) && methodsQuery.data?.length === 0 && <span>No results found.</span> }
        { methods.length > 0 && (
          <Flex display="flex" flexDir="column" maxH="250px" overflowY="scroll">
            <CheckboxGroup
              value={ currentValue.length ? currentValue.map(i => i.method_id) : [ ] }
              orientation="vertical"
            >
              { methods.map(method => (
                <Checkbox
                  key={ method.method_id }
                  value={ method.method_id }
                  data-id={ method.method_id }
                  onChange={ handleChange }
                  labelProps={{ w: '100%', minW: '0' }}
                >
                  <Flex justifyContent="space-between" alignItems="center" id={ method.method_id } w="100%">
                    <chakra.span overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">{ method.name || method.method_id }</chakra.span>
                    <Badge colorPalette="gray" truncated ml="auto">
                      { method.method_id }
                    </Badge>
                  </Flex>
                </Checkbox>
              )) }
            </CheckboxGroup>
          </Flex>
        ) }
      </ColumnFilterContentSection>
    </ColumnFilterContent>
  );
};

export default MethodFilter;
