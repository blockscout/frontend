import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { IconButton, Icon } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import type { Inputs } from './PublicTagsForm';
import AddressInput from 'ui/shared/AddressInput';

import PlusIcon from 'icons/plus.svg';
import MinusIcon from 'icons/minus.svg';

interface Props {
  control: Control<Inputs, object>;
  index: number;
  fieldsLength: number;
  hasError: boolean;
  onAddFieldClick: (e: React.SyntheticEvent) => void;
  onRemoveFieldClick: (index: number) => (e: React.SyntheticEvent) => void;
}

const MAX_INPUTS_NUM = 10;

export default function PublicTagFormAction({ control, index, fieldsLength, hasError, onAddFieldClick, onRemoveFieldClick }: Props) {
  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, `addresses.${ number }.address`>}) => {
    return <AddressInput field={ field } isInvalid={ hasError } size="lg" placeholder="Smart contract / Address (0x...)"/>
  }, [ hasError ]);

  return (
    <>
      <Controller
        name={ `addresses.${ index }.address` }
        control={ control }
        render={ renderAddressInput }
      />
      { index === fieldsLength - 1 && fieldsLength < MAX_INPUTS_NUM && (
        <IconButton
          aria-label="add"
          variant="iconBorderBlue"
          w="30px"
          h="30px"
          onClick={ onAddFieldClick }
          icon={ <Icon as={ PlusIcon } w="20px" h="20px"/> }
          position="absolute"
          right={ index === 0 ? '-50px' : '-100px' }
          top="25px"
        />
      ) }
      { fieldsLength > 1 && (
        <IconButton
          aria-label="add"
          variant="iconBorderBlue"
          w="30px"
          h="30px"
          onClick={ onRemoveFieldClick(index) }
          icon={ <Icon as={ MinusIcon } w="20px" h="20px"/> }
          position="absolute"
          right="-50px"
          top="25px"
        />
      ) }</>
  )
}
