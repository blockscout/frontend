import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import IconSvg from 'ui/shared/IconSvg';

import ContractMethodField from './ContractMethodField';

interface Props {
  name: string;
  size: number;
  argType: SmartContractMethodArgType;
  control: Control<MethodFormFields>;
  setValue: UseFormSetValue<MethodFormFields>;
  getValues: UseFormGetValues<MethodFormFields>;
  isDisabled: boolean;
  onChange: () => void;
}

const ContractMethodFieldArray = ({ control, name, setValue, getValues, isDisabled, argType, onChange, size }: Props) => {
  const { fields, append, remove } = useFieldArray({
    name: name as never,
    control,
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      if (size === Infinity) {
        append('');
      } else {
        for (let i = 0; i < size - 1; i++) {
          // a little hack to append multiple empty fields in the array
          // had to adjust code in ContractMethodField as well
          append('\n');
        }
      }
    }

  }, [ fields.length, append, size ]);

  const handleAddButtonClick = React.useCallback(() => {
    append('');
  }, [ append ]);

  const handleRemoveButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const itemIndex = event.currentTarget.getAttribute('data-index');
    if (itemIndex) {
      remove(Number(itemIndex));
    }
  }, [ remove ]);

  return (
    <Flex flexDir="column" rowGap={ 3 } w="100%">
      { fields.map((field, index, array) => {
        return (
          <Flex key={ field.id } columnGap={ 3 }>
            <ContractMethodField
              name={ `${ name }[${ index }]` }
              groupName={ name }
              index={ index }
              argType={ argType }
              placeholder={ argType }
              control={ control }
              setValue={ setValue }
              getValues={ getValues }
              isDisabled={ isDisabled }
              onChange={ onChange }
            />
            { array.length > 1 && size === Infinity && (
              <IconButton
                aria-label="remove"
                data-index={ index }
                variant="outline"
                w="30px"
                h="30px"
                flexShrink={ 0 }
                onClick={ handleRemoveButtonClick }
                icon={ <IconSvg name="minus" boxSize={ 4 }/> }
                isDisabled={ isDisabled }
              />
            ) }
            { index === array.length - 1 && size === Infinity && (
              <IconButton
                aria-label="add"
                data-index={ index }
                variant="outline"
                w="30px"
                h="30px"
                flexShrink={ 0 }
                onClick={ handleAddButtonClick }
                icon={ <IconSvg name="plus" boxSize={ 4 }/> }
                isDisabled={ isDisabled }
              />
            ) }
          </Flex>
        );
      }) }
    </Flex>
  );
};

export default React.memo(ContractMethodFieldArray);
