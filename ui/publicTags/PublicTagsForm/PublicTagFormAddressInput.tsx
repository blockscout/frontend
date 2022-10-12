import type { InputProps } from '@chakra-ui/react';
import { IconButton, Icon, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control, FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import MinusIcon from 'icons/minus.svg';
import PlusIcon from 'icons/plus.svg';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';

import type { Inputs } from './PublicTagsForm';

interface Props {
  control: Control<Inputs>;
  index: number;
  fieldsLength: number;
  error?: FieldError;
  onAddFieldClick: (e: React.SyntheticEvent) => void;
  onRemoveFieldClick: (index: number) => (e: React.SyntheticEvent) => void;
  size?: InputProps['size'];
}

const MAX_INPUTS_NUM = 10;

export default function PublicTagFormAction({ control, index, fieldsLength, error, onAddFieldClick, onRemoveFieldClick, size }: Props) {
  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, `addresses.${ number }.address`>}) => {
    return (
      <AddressInput<Inputs, `addresses.${ number }.address`>
        field={ field }
        error={ error }
        size={ size }
        placeholder="Smart contract / Address (0x...)"
      />
    );
  }, [ error, size ]);

  return (
    <Flex flexDir="column" rowGap={ 5 } alignItems="flex-end">
      <Controller
        name={ `addresses.${ index }.address` }
        control={ control }
        render={ renderAddressInput }
        rules={{
          pattern: ADDRESS_REGEXP,
          required: index === 0,
        }}
      />
      <Flex
        columnGap={ 5 }
        position={{ base: 'static', lg: 'absolute' }}
        left={{ base: 'auto', lg: 'calc(100% + 20px)' }}
        h="100%"
        alignItems="center"
      >
        { fieldsLength > 1 && (
          <IconButton
            aria-label="delete"
            variant="outline"
            w="30px"
            h="30px"
            onClick={ onRemoveFieldClick(index) }
            icon={ <Icon as={ MinusIcon } w="20px" h="20px"/> }
          />
        ) }
        { index === fieldsLength - 1 && fieldsLength < MAX_INPUTS_NUM && (
          <IconButton
            aria-label="add"
            variant="outline"
            w="30px"
            h="30px"
            onClick={ onAddFieldClick }
            icon={ <Icon as={ PlusIcon } w="20px" h="20px"/> }
          />
        ) }
      </Flex>
    </Flex>
  );
}
