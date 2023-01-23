import { Checkbox, GridItem } from '@chakra-ui/react';
import React from 'react';
import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationFieldLibraryItem from './ContractVerificationFieldLibraryItem';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldLibraries = ({ control }: Props) => {
  const [ isEnabled, setIsEnabled ] = React.useState(false);

  const { fields, append, remove, insert } = useFieldArray({
    name: 'libraries',
    control,
  });

  const handleCheckboxChange = React.useCallback(() => {
    if (!isEnabled) {
      append({ name: '', address: '' });
    } else {
      remove();
    }
    setIsEnabled(prev => !prev);
  }, [ append, isEnabled, remove ]);

  const handleAddFieldClick = React.useCallback((index: number) => {
    insert(index + 1, { name: '', address: '' });
  }, [ insert ]);

  const handleRemoveFieldClick = React.useCallback((index: number) => {
    remove(index);
  }, [ remove ]);

  return (
    <>
      <GridItem mt={ 9 }>
        <Checkbox
          size="lg"
          onChange={ handleCheckboxChange }
        >
            Add contract libraries
        </Checkbox>
      </GridItem>
      <GridItem/>
      { fields.map((field, index) => (
        <ContractVerificationFieldLibraryItem
          key={ field.id }
          index={ index }
          control={ control }
          fieldsLength={ fields.length }
          onAddFieldClick={ handleAddFieldClick }
          onRemoveFieldClick={ handleRemoveFieldClick }
        />
      )) }
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraries);
