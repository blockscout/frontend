import { Flex, Checkbox, CheckboxGroup, Text, Spinner, Select } from '@chakra-ui/react';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';
import type { TokenInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import Tag from 'ui/shared/chakra/Tag';
import ClearButton from 'ui/shared/ClearButton';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import FilterInput from 'ui/shared/filters/FilterInput';

import ColumnFilter from '../ColumnFilter';

const FILTER_PARAM_INCLUDE = 'token_contract_address_hashes_to_include';
const FILTER_PARAM_EXCLUDE = 'token_contract_address_hashes_to_exclude';

export type AssetFilterMode = 'include' | 'exclude';

// add native token
type Value = Array<{ token: TokenInfo; mode: AssetFilterMode }>;

type Props = {
  value: Value;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string>) => void;
  columnName: string;
}

const AssetFilter = ({ value, handleFilterChange, columnName }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Value>(value || []);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleModeSelectChange = React.useCallback((index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AssetFilterMode;
    setCurrentValue(prev => {
      prev[index].mode = value;
      return [ ...prev ];
    });
  }, []);

  const handleRemove = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      prev.splice(index, 1);
      return [ ...prev ];
    });
  }, []);

  const tokensQuery = useApiQuery('tokens', { queryParams: { limit: '7', q: searchTerm } });

  const onTokenClick = React.useCallback((token: TokenInfo) => () => {
    setCurrentValue(prev => prev.findIndex(i => i.token.address === token.address) > -1 ? prev : [ { token, mode: 'include' }, ...prev ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    handleFilterChange(FILTER_PARAM_INCLUDE, currentValue.filter(i => i.mode === 'include').map(i => i.token.address));
    handleFilterChange(FILTER_PARAM_EXCLUDE, currentValue.filter(i => i.mode === 'exclude').map(i => i.token.address));
    return;
  }, [ handleFilterChange, currentValue ]);

  return (
    <ColumnFilter
      columnName={ columnName }
      title="Asset"
      isFilled={ Boolean(currentValue.length) }
      isActive={ Boolean(value.length) }
      onFilter={ onFilter }
      onReset={ onReset }
      w="382px"
    >
      <FilterInput
        size="xs"
        onChange={ onSearchChange }
        placeholder="Token name or symbol"
        initialValue={ searchTerm }
      />
      { !searchTerm && currentValue.map((item, index) => (
        <Flex key={ item.token.address } mt={ 3 } alignItems="center">
          <Select
            size="xs"
            borderRadius="base"
            value={ item.mode }
            onChange={ handleModeSelectChange(index) }
            minW="105px"
            w="105px"
            mr={ 3 }
          >
            <option value="include">Include</option>
            <option value="exclude">Exclude</option>
          </Select>
          <TokenEntity token={ item.token } noLink noCopy flexGrow={ 1 }/>
          <ClearButton onClick={ handleRemove(index) }/>
        </Flex>
      )) }
      { tokensQuery.isLoading && <Spinner display="block" mt={ 3 }/> }
      { tokensQuery.data && !searchTerm && (
        <>
          <Text color="text_secondary" fontWeight="600" mt={ 3 }>Popular</Text>
          <Flex rowGap={ 3 } flexWrap="wrap" gap={ 3 } mt={ 3 }>
            { tokensQuery.data.items.map(token => (
              <Tag
                key={ token.address }
                data-id={ token.address }
                onClick={ onTokenClick(token) }
                // color="link"
                colorScheme="gray-blue"
                // isActive={ (!currentValue.from || currentValue.from === '0') && currentValue.to === preset.value }
                _hover={{ opacity: 0.76 }}
                cursor="pointer"
              >
                { token.symbol || token.name || token.address }
              </Tag>
            )) }
          </Flex>
        </>
      ) }
      { searchTerm && tokensQuery.data && (
        <Flex display="flex" flexDir="column" rowGap={ 3 } maxH="250px" overflowY="scroll" mt={ 3 }>
          <CheckboxGroup value={ currentValue.map(i => i.token.address) }>
            { tokensQuery.data.items.map(token => (
              <Flex justifyContent="space-between" alignItems="center" key={ token.address }>
                <Checkbox
                  value={ token.address }
                  id={ token.address }
                  onChange={ onTokenClick(token) }
                  overflow="hidden"
                  sx={{
                    '.chakra-checkbox__label': {
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    },
                  }}
                >
                  <TokenEntity token={ token } noLink noCopy/>
                </Checkbox>
              </Flex>
            )) }
          </CheckboxGroup>
        </Flex>
      ) }
    </ColumnFilter>
  );
};

export default AssetFilter;
