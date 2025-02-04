import type { useRadioGroup } from '@chakra-ui/react';
import { PopoverBody, PopoverContent } from '@chakra-ui/react';
import React from 'react';

import type { SelectOption as TSelectOption } from './types';

import SelectOption from './SelectOption';

interface Props {
  options: Array<TSelectOption>;
  getRootProps: ReturnType<typeof useRadioGroup>['getRootProps'];
  getRadioProps: ReturnType<typeof useRadioGroup>['getRadioProps'];
  value: string | number;
}

const SelectContent = ({ options, getRootProps, getRadioProps, value }: Props) => {

  const root = getRootProps();

  return (
    <PopoverContent w="fit-content" minW="150px">
      <PopoverBody { ...root } py={ 2 } px={ 0 } display="flex" flexDir="column">
        { options.map((option) => {
          const radio = getRadioProps({ value: option.value });
          return (
            <SelectOption key={ option.value } { ...radio } isChecked={ radio.isChecked || (!option.value && !value) }>
              { option.label }
            </SelectOption>
          );
        }) }
      </PopoverBody>
    </PopoverContent>
  );
};

export default React.memo(SelectContent);
