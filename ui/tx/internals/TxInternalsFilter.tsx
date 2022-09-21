import { Popover, PopoverTrigger, PopoverContent, PopoverBody, CheckboxGroup, Checkbox, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/tx';

import useIsMobile from 'lib/hooks/useIsMobile';
import FilterButton from 'ui/shared/FilterButton';

interface Filter {
  title: string;
  id: TxInternalsType;
}

const FILTERS: Array<Filter> = [
  { title: 'Call', id: 'call' },
  { title: 'Delegate call', id: 'delegate_call' },
  { title: 'Static call', id: 'static_call' },
  { title: 'Create', id: 'create' },
  { title: 'Create2', id: 'create2' },
  { title: 'Self-destruct', id: 'self_destruct' },
  { title: 'Reward', id: 'reward' },
];

interface Props {
  appliedFiltersNum?: number;
  defaultFilters: Array<TxInternalsType>;
  onFilterChange: (nextValue: Array<TxInternalsType>) => void;
}

const TxInternalsFilter = ({ onFilterChange, defaultFilters, appliedFiltersNum }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useIsMobile();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <FilterButton
          isActive={ isOpen || Number(appliedFiltersNum) > 0 }
          isCollapsed={ isMobile }
          onClick={ onToggle }
          appliedFiltersNum={ appliedFiltersNum }
        />
      </PopoverTrigger>
      <PopoverContent w="438px">
        <PopoverBody px={ 4 } py={ 6 } display="grid" gridTemplateColumns="1fr 1fr" rowGap={ 5 }>
          <CheckboxGroup size="lg" onChange={ onFilterChange } defaultValue={ defaultFilters }>
            { FILTERS.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TxInternalsFilter;
