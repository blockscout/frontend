import { Popover, PopoverTrigger, PopoverContent, PopoverBody, CheckboxGroup, Checkbox, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { TxInternalsType } from 'types/api/tx';

import useIsMobile from 'lib/hooks/useIsMobile';
import FilterButton from 'ui/shared/FilterButton';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

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
            { TX_INTERNALS_ITEMS.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TxInternalsFilter);
