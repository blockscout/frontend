import { Flex, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';
import type { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import minusIcon from 'icons/minus.svg';
import plusIcon from 'icons/plus.svg';

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

const ContractMethodFieldArray = ({ control, name, setValue, getValues, isDisabled, argType, onChange }: Props) => {
  const { fields, append, remove } = useFieldArray({
    name: name as never,
    control,
  });

  React.useEffect(() => {
    fields.length === 0 && append('');
  }, [ append, fields.length ]);

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
    <Flex flexDir="column" rowGap={ 3 }>
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
            { array.length > 1 && (
              <IconButton
                aria-label="remove"
                data-index={ index }
                variant="outline"
                w="30px"
                h="30px"
                flexShrink={ 0 }
                onClick={ handleRemoveButtonClick }
                icon={ <Icon as={ minusIcon } boxSize={ 4 }/> }
                isDisabled={ isDisabled }
              />
            ) }
            { index === array.length - 1 && (
              <IconButton
                aria-label="add"
                data-index={ index }
                variant="outline"
                w="30px"
                h="30px"
                flexShrink={ 0 }
                onClick={ handleAddButtonClick }
                icon={ <Icon as={ plusIcon } boxSize={ 4 }/> }
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
