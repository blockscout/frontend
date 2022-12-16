import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  CheckboxGroup,
  Checkbox,
  Text,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';

import FilterButton from 'ui/shared/FilterButton';

import { TOKEN_TYPE } from './helpers';

interface Props {
  appliedFiltersNum?: number;
  defaultTypeFilters: Array<TokenType>;
  onTypeFilterChange: (nextValue: Array<TokenType>) => void;
  withAddressFilter?: boolean;
  onAddressFilterChange?: (nextValue: string) => void;
  defaultAddressFilter?: AddressFromToFilter;
}

const TokenTransferFilter = ({
  onTypeFilterChange,
  defaultTypeFilters,
  appliedFiltersNum,
  withAddressFilter,
  onAddressFilterChange,
  defaultAddressFilter,
}: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

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
          { withAddressFilter && (
            <>
              <Text variant="secondary" fontWeight={ 600 }>Address</Text>
              <RadioGroup
                size="lg"
                onChange={ onAddressFilterChange }
                defaultValue={ defaultAddressFilter || 'all' }
                paddingBottom={ 4 }
                borderBottom="1px solid"
                borderColor={ borderColor }
              >
                <Stack spacing={ 4 }>
                  <Radio value="all"><Text fontSize="md">All</Text></Radio>
                  <Radio value="from"><Text fontSize="md">From</Text></Radio>
                  <Radio value="to"><Text fontSize="md">To</Text></Radio>
                </Stack>
              </RadioGroup>
            </>
          ) }
          <Text variant="secondary" fontWeight={ 600 }>Type</Text>
          <CheckboxGroup size="lg" onChange={ onTypeFilterChange } defaultValue={ defaultTypeFilters }>
            { TOKEN_TYPE.map(({ title, id }) => <Checkbox key={ id } value={ id }><Text fontSize="md">{ title }</Text></Checkbox>) }
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TokenTransferFilter);
