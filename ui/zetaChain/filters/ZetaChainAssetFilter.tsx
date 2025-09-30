import { Flex, Text, Spinner } from '@chakra-ui/react';
import { isEqual } from 'es-toolkit';
import React from 'react';

import type { Token } from '@blockscout/zetachain-cctx-types';
import type { TokenInfo } from 'types/api/token';
import type { ZetaChainCCTXFilterParams } from 'types/client/zetaChain';

import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';
import { Tag } from 'toolkit/chakra/tag';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TableColumnFilter from 'ui/shared/filters/TableColumnFilter';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';

const FILTER_PARAM_SYMBOL = 'token_symbol';

// ZETA native token constant
const ZETA_NATIVE_TOKEN = {
  name: 'Zeta',
  icon_url: '',
  symbol: 'ZETA',
  address_hash: 'native',
  type: 'ERC-20' as const,
} as TokenInfo;

type Value = Array<TokenInfo>;

type Props = {
  value: Value | TokenInfo | null;
  handleFilterChange: (field: keyof ZetaChainCCTXFilterParams, val: Array<string>) => void;
  columnName: string;
  isLoading?: boolean;
};

const ZetaChainAssetFilter = ({ value = [], handleFilterChange }: Props) => {
  // Handle both old single value format and new array format
  let normalizedValue: Value;
  if (Array.isArray(value)) {
    normalizedValue = value;
  } else if (value) {
    normalizedValue = [ value ];
  } else {
    normalizedValue = [];
  }
  const [ currentValue, setCurrentValue ] = React.useState<Value>([ ...normalizedValue ]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const onSearchChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRemove = React.useCallback((index: number) => () => {
    setCurrentValue(prev => {
      prev.splice(index, 1);
      return [ ...prev ];
    });
  }, []);

  const tokensQuery = useApiQuery('zetachain:tokens', {
    queryParams: {},
    queryOptions: {
      refetchOnMount: false,
    },
  });

  // Filter tokens based on search term
  const filteredTokens = React.useMemo(() => {
    if (!tokensQuery.data?.tokens) return [];

    if (!debouncedSearchTerm) {
      return tokensQuery.data.tokens.slice(0, 5);
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return tokensQuery.data.tokens.filter(token =>
      (token.symbol?.toLowerCase().includes(searchLower) ||
       token.name?.toLowerCase().includes(searchLower)),
    );
  }, [ tokensQuery.data?.tokens, debouncedSearchTerm ]);

  const onTokenClick = React.useCallback((token: Token | TokenInfo) => () => {
    // Convert to TokenInfo for compatibility
    const tokenInfo: TokenInfo = 'zrc20_contract_address' in token ? {
      address_hash: token.zrc20_contract_address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals.toString(),
      total_supply: null,
      icon_url: token.icon_url ?? null,
      type: 'ERC-20', // Default type for ZetaChain tokens
      holders_count: null,
      exchange_rate: null,
      circulating_market_cap: null,
    } : token;
    setCurrentValue(prev => prev.findIndex(i => i.address_hash === tokenInfo.address_hash) > -1 ? prev : [ tokenInfo, ...prev ]);
  }, []);

  const onReset = React.useCallback(() => setCurrentValue([]), []);

  const onFilter = React.useCallback(() => {
    setSearchTerm('');
    handleFilterChange(FILTER_PARAM_SYMBOL, currentValue.map(i => i.symbol || ''));
    return;
  }, [ handleFilterChange, currentValue ]);

  return (
    <TableColumnFilter
      title="Asset"
      isFilled={ Boolean(currentValue.length) }
      isTouched={ !isEqual(currentValue.map(i => JSON.stringify(i)).sort(), normalizedValue.map(i => JSON.stringify(i)).sort()) }
      onFilter={ onFilter }
      onReset={ onReset }
      hasReset
    >
      <FilterInput
        placeholder="Search by token name or symbol"
        initialValue={ searchTerm }
        onChange={ onSearchChange }
        loading={ tokensQuery.isLoading }
      />
      { !searchTerm && currentValue.map((item, index) => (
        <Flex key={ item.address_hash } alignItems="center">
          <Flex alignItems="center" gap={ 2 } flexGrow={ 1 }>
            { item.symbol === 'ZETA' ? (
              <NativeTokenIcon boxSize={ 5 } mr={ 2 }/>
            ) : (
              <TokenEntity.Icon token={ item }/>
            ) }
            <TokenEntity.Content token={ item } onlySymbol/>
          </Flex>
          <ClearButton onClick={ handleRemove(index) }/>
        </Flex>
      )) }
      { tokensQuery.isLoading && <Spinner display="block" mt={ 3 }/> }
      { tokensQuery.data && !searchTerm && (
        <>
          <Text color="text.secondary" fontWeight="600" mt={ 3 }>Popular</Text>
          <Flex rowGap={ 3 } flexWrap="wrap" gap={ 3 } mb={ 2 }>
            { [ ZETA_NATIVE_TOKEN, ...filteredTokens.map(token => ({
              address_hash: token.zrc20_contract_address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals.toString(),
              total_supply: null,
              icon_url: token.icon_url,
              type: 'ERC-20' as const,
              holders_count: null,
              exchange_rate: null,
              circulating_market_cap: null,
            } as TokenInfo)) ].map(token => (
              <Tag
                key={ token.address_hash }
                data-id={ token.address_hash }
                onClick={ onTokenClick(token) }
                variant="select"
              >
                <Flex flexGrow={ 1 } alignItems="center">
                  { token.address_hash === ZETA_NATIVE_TOKEN.address_hash ? <NativeTokenIcon boxSize={ 5 } mr={ 2 }/> : <TokenEntity.Icon token={ token }/> }
                  { token.symbol || token.name || token.address_hash }
                </Flex>
              </Tag>
            )) }
          </Flex>
        </>
      ) }
      { searchTerm && tokensQuery.data && !filteredTokens.length && <Text>No tokens found</Text> }
      { searchTerm && tokensQuery.data && Boolean(filteredTokens.length) && (
        <Flex display="flex" flexDir="column" rowGap={ 3 } maxH="250px" overflowY="scroll" mt={ 3 } ml="-4px">
          <CheckboxGroup value={ currentValue.map(i => i.address_hash) } orientation="vertical">
            { filteredTokens.map(token => (
              <Checkbox
                key={ token.zrc20_contract_address }
                value={ token.zrc20_contract_address }
                id={ token.zrc20_contract_address }
                onChange={ onTokenClick(token) }
                overflow="hidden"
                w="100%"
                pl={ 1 }
              >
                <TokenEntity.default token={{
                  address_hash: token.zrc20_contract_address,
                  symbol: token.symbol,
                  name: token.name,
                  decimals: token.decimals.toString(),
                  total_supply: null,
                  icon_url: token.icon_url,
                  type: 'ERC-20',
                  holders_count: null,
                  exchange_rate: null,
                  circulating_market_cap: null,
                } as TokenInfo} noLink noCopy onlySymbol/>
              </Checkbox>
            )) }
          </CheckboxGroup>
        </Flex>
      ) }
    </TableColumnFilter>
  );
};

export default ZetaChainAssetFilter;
