import { Popover, PopoverTrigger, PopoverContent, PopoverBody, CheckboxGroup, Checkbox, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';

import FilterButton from 'ui/shared/FilterButton';

import { TOKEN_TYPE } from './helpers';

interface Props {
  appliedFiltersNum?: number;
  defaultFilters: Array<TokenType>;
  onFilterChange: (nextValue: Array<TokenType>) => void;
}

const TokenTransfer = ({ onFilterChange, defaultFilters, appliedFiltersNum }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <FilterButton
          isActive={ isOpen || Number(appliedFiltersNum) > 0 }
          onClick={ onToggle }
          appliedFiltersNum={ appliedFiltersNum }
        />
      </PopoverTrigger>
      <PopoverContent w="200px">
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <Text variant="secondary" fontWeight={ 600 }>Type</Text>
          <CheckboxGroup size="lg" onChange={ onFilterChange } defaultValue={ defaultFilters }>
            { TOKEN_TYPE.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TokenTransfer);
