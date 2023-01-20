import { Flex, FormControl, GridItem, Icon, IconButton, Input, Text } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import minusIcon from 'icons/minus.svg';
import plusIcon from 'icons/plus.svg';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const LIMIT = 10;

interface Props {
  control: Control<FormFields>;
  index: number;
  fieldsLength: number;
  onAddFieldClick: (index: number) => void;
  onRemoveFieldClick: (index: number) => void;
}

const ContractVerificationFieldLibraryItem = ({ control, index, fieldsLength, onAddFieldClick, onRemoveFieldClick }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const renderNameControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, `libraries.${ number }.name`>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          maxLength={ 255 }
        />
        <InputPlaceholder text="Library name (.sol file)"/>
      </FormControl>
    );
  }, []);

  const renderAddressControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, `libraries.${ number }.address`>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
        />
        <InputPlaceholder text="Library address (0x...)"/>
      </FormControl>
    );
  }, []);

  const handleAddButtonClick = React.useCallback(() => {
    onAddFieldClick(index);
  }, [ index, onAddFieldClick ]);

  const handleRemoveButtonClick = React.useCallback(() => {
    onRemoveFieldClick(index);
  }, [ index, onRemoveFieldClick ]);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <GridItem mt={ index !== 0 ? 12 : 0 } ref={ ref }>
        <Flex alignItems="center" justifyContent="space-between">
          <Text variant="secondary" fontSize="sm">Contract library { index + 1 }</Text>
          <Flex columnGap={ 5 }>
            { fieldsLength > 1 && (
              <IconButton
                aria-label="delete"
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleRemoveButtonClick }
                icon={ <Icon as={ minusIcon } w="20px" h="20px"/> }
              />
            ) }
            { fieldsLength < LIMIT && (
              <IconButton
                aria-label="add"
                variant="outline"
                w="30px"
                h="30px"
                onClick={ handleAddButtonClick }
                icon={ <Icon as={ plusIcon } w="20px" h="20px"/> }
              />
            ) }
          </Flex>
        </Flex>
      </GridItem>
      <GridItem/>
      <GridItem>
        <Controller
          name={ `libraries.${ index }.name` }
          control={ control }
          render={ renderNameControl }
          rules={{ required: true }}
        />
      </GridItem>
      { index === 0 ? (
        <GridItem fontSize="sm">
            A library name called in the .sol file. Multiple libraries (up to 10) may be added for each contract.
        </GridItem>
      ) : <GridItem/> }
      <GridItem>
        <Controller
          name={ `libraries.${ index }.address` }
          control={ control }
          render={ renderAddressControl }
          rules={{ required: true, pattern: ADDRESS_REGEXP }}
        />
      </GridItem>
      { index === 0 ? (
        <GridItem fontSize="sm">
            The 0x library address. This can be found in the generated json file or Truffle output (if using truffle).
        </GridItem>
      ) : <GridItem/> }
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraryItem);
