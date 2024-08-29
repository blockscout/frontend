import { Flex, Checkbox, CheckboxGroup, Text, Spinner, Select } from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';
import type { TokenInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import Tag from 'ui/shared/chakra/Tag';
import ClearButton from 'ui/shared/ClearButton';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import FilterInput from 'ui/shared/filters/FilterInput';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';

import { NATIVE_TOKEN } from '../constants';

const FILTER_PARAM_INCLUDE = 'token_contract_address_hashes_to_include';
const FILTER_PARAM_EXCLUDE = 'token_contract_address_hashes_to_exclude';
const NAME_PARAM_INCLUDE = 'token_contract_symbols_to_include';
const NAME_PARAM_EXCLUDE = 'token_contract_symbols_to_exclude';

export type AssetFilterMode = 'include' | 'exclude';

// add native token
type Value = Array<{ token: TokenInfo; mode: AssetFilterMode }>;

type Props = {
  value: Value;
  handleFilterChange: (filed: keyof AdvancedFilterParams, val: Array<string>) => void;
  columnName: string;
  isLoading?: boolean;
  onClose?: () => void;
}

const AssetFilter = ({ value = [], handleFilterChange, onClose }: Props) => {
  const [ currentValue, setCurrentValue ] = React.useState<Value>([ ...value ]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleModeSelectChange = React.useCallback((index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AssetFilterMode;
    setCurrentValue(prev => {
      prev[index] = { ...prev[index], mode: value };
      return [ ...prev ];
    });
  }, []);

  const handleRemove = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      prev.splice(index, 1);
      return [ ...prev ];
    });
  }, []);

  const tokensQuery = useApiQuery('tokens', {
    queryParams: { limit: '7', q: searchTerm },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const onTokenClick = React.useCallback((token: TokenInfo) => () => {
    setCurrentValue(prev => prev.findIndex(i => i.token.address === token.address) > -1 ? prev : [ { token, mode: 'include' }, ...prev ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    setSearchTerm('');
    handleFilterChange(FILTER_PARAM_INCLUDE, currentValue.filter(i => i.mode === 'include').map(i => i.token.address));
    handleFilterChange(NAME_PARAM_INCLUDE, currentValue.filter(i => i.mode === 'include').map(i => i.token.symbol || ''));
    handleFilterChange(FILTER_PARAM_EXCLUDE, currentValue.filter(i => i.mode === 'exclude').map(i => i.token.address));
    handleFilterChange(NAME_PARAM_EXCLUDE, currentValue.filter(i => i.mode === 'exclude').map(i => i.token.symbol || ''));
    return;
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Asset"
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
        placeholder="Token name or symbol"
        initialValue={ searchTerm }
      />
      { !searchTerm && currentValue.map((item, index) => (
        <Flex key={ item.token.address } alignItems="center">
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
          <TokenEntity.default token={ item.token } noLink noCopy flexGrow={ 1 }/>
          <ClearButton onClick={ handleRemove(index) }/>
        </Flex>
      )) }
      { tokensQuery.isLoading && <Spinner display="block" mt={ 3 }/> }
      { tokensQuery.data && !searchTerm && (
        <>
          <Text color="text_secondary" fontWeight="600" mt={ 3 }>Popular</Text>
          <Flex rowGap={ 3 } flexWrap="wrap" gap={ 3 } mb={ 2 }>
            { [ NATIVE_TOKEN, ...tokensQuery.data.items ].map(token => (
              <Tag
                key={ token.address }
                data-id={ token.address }
                onClick={ onTokenClick(token) }
                variant="select"
              >
                <Flex flexGrow={ 1 } alignItems="center">
                  <TokenEntity.Icon token={ token }/>
                  { token.symbol || token.name || token.address }
                </Flex>
              </Tag>
            )) }
          </Flex>
        </>
      ) }
      { searchTerm && tokensQuery.data && !tokensQuery.data?.items.length && <Text>No tokens found</Text> }
      { searchTerm && tokensQuery.data && Boolean(tokensQuery.data?.items.length) && (
        <Flex display="flex" flexDir="column" rowGap={ 3 } maxH="250px" overflowY="scroll" mt={ 3 } ml="-4px">
          <CheckboxGroup value={ currentValue.map(i => i.token.address) }>
            { tokensQuery.data.items.map(token => (
              <Flex justifyContent="space-between" alignItems="center" key={ token.address }>
                <Checkbox
                  value={ token.address }
                  id={ token.address }
                  onChange={ onTokenClick(token) }
                  overflow="hidden"
                  w="100%"
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
                  <TokenEntity.default token={ token } noLink noCopy/>
                </Checkbox>
              </Flex>
            )) }
          </CheckboxGroup>
        </Flex>
      ) }
    </TableColumnFilter>
  );
};

export default AssetFilter;
