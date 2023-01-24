import {
  Checkbox,
  CheckboxGroup,
  Grid,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TTxsFilters, TypeFilter, MethodFilter } from 'types/api/txsFilters';

import PopoverFilter from 'ui/shared/filters/PopoverFilter';

interface Props {
  appliedFiltersNum?: number;
  filters: Partial<TTxsFilters>;
  onFiltersChange: (val: Partial<TTxsFilters>) => void;
}

const TYPE_OPTIONS = [
  { title: 'Token transfer', id: 'token_transfer' },
  { title: 'Contract Creation', id: 'contract_creation' },
  { title: 'Contract Call', id: 'contract_call' },
  { title: 'Coin Transfer', id: 'coin_transfer' },
  { title: 'Token Creation', id: 'token_creation' },
];

const METHOD_OPTIONS = [
  { title: 'Approve', id: 'approve' },
  { title: 'Transfer', id: 'transfer' },
  { title: 'Multicall', id: 'multicall' },
  { title: 'Mint', id: 'mint' },
  { title: 'Commit', id: 'commit' },
];

const TxsFilters = ({ filters, appliedFiltersNum }: Props) => {

  const [ typeFilter, setTypeFilter ] = useState<Array<TypeFilter>>(filters.type || []);
  const [ methodFilter, setMethodFilter ] = useState<Array<MethodFilter>>(filters.method || []);

  const onTypeFilterChange = useCallback((val: Array<TypeFilter>) => {
    setTypeFilter(val);
  }, []);

  const onMethodFilterChange = useCallback((val: Array<MethodFilter>) => {
    setMethodFilter(val);
  }, []);

  return (
    <PopoverFilter contentProps={{ w: { md: '100%', lg: '438px' } }} appliedFiltersNum={ appliedFiltersNum }>
      <Text variant="secondary" fontWeight="600" fontSize="sm">Type</Text>
      <Grid gridTemplateColumns="1fr 1fr" rowGap={ 5 } mt={ 4 } mb={ 4 } pb={ 6 } borderBottom="1px solid" borderColor="divider">
        <CheckboxGroup size="lg" onChange={ onTypeFilterChange } defaultValue={ typeFilter }>
          { TYPE_OPTIONS.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
        </CheckboxGroup>
      </Grid>
      <Text variant="secondary" fontWeight="600" fontSize="sm">Method</Text>
      <Grid gridTemplateColumns="1fr 1fr" rowGap={ 5 } mt={ 4 } mb={ 4 } pb={ 6 } borderBottom="1px solid" borderColor="divider">
        <CheckboxGroup size="lg" onChange={ onMethodFilterChange } defaultValue={ methodFilter }>
          { METHOD_OPTIONS.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
        </CheckboxGroup>
      </Grid>
    </PopoverFilter>
  );
};

export default React.memo(TxsFilters);
