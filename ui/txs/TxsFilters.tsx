import {
  Button,
  Checkbox,
  CheckboxGroup,
  Grid,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TTxsFilters, TypeFilter, MethodFilter } from 'types/api/txsFilters';

import FilterButton from 'ui/shared/FilterButton';

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

// TODO: i think we need to reload page after applying filters,
// because we need to reset pagination, clear query caches, reconnect websocket...

// also mobile version of filters is not implemented

const TxsFilters = ({ onFiltersChange, filters, appliedFiltersNum }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [ typeFilter, setTypeFilter ] = useState<Array<TypeFilter>>(filters.type || []);
  const [ methodFilter, setMethodFilter ] = useState<Array<MethodFilter>>(filters.method || []);

  const onTypeFilterChange = useCallback((val: Array<TypeFilter>) => {
    setTypeFilter(val);
  }, []);

  const onMethodFilterChange = useCallback((val: Array<MethodFilter>) => {
    setMethodFilter(val);
  }, []);

  const onFilterReset = useCallback(() => {
    setTypeFilter([]);
    setMethodFilter([]);
    onFiltersChange({ type: [], method: [] });
    onClose();
  }, [ onClose, onFiltersChange ]);

  const onFilterApply = useCallback(() => {
    onFiltersChange({ type: typeFilter, method: methodFilter } as Partial<TTxsFilters>);
    onClose();
  }, [ onClose, onFiltersChange, typeFilter, methodFilter ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <FilterButton
          isActive={ isOpen || Number(appliedFiltersNum) > 0 }
          onClick={ onToggle }
          appliedFiltersNum={ appliedFiltersNum }
        />
      </PopoverTrigger>
      <PopoverContent w={{ md: '100%', lg: '438px' }}>
        <PopoverBody px={ 4 } py={ 6 }>
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
          <Flex alignItems="center" justifyContent="space-between">
            <Link fontSize="sm" onClick={ onFilterReset }>Reset filters</Link>
            <Button variant="outline" size="sm" onClick={ onFilterApply }>Apply</Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TxsFilters);
