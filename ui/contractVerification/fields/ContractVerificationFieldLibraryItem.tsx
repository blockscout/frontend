import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { FormFields } from '../types';

import { IconButton } from 'toolkit/chakra/icon-button';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const LIMIT = 10;

interface Props {
  index: number;
  fieldsLength: number;
  onAddFieldClick: (index: number) => void;
  onRemoveFieldClick: (index: number) => void;
  isDisabled?: boolean;
}

const ContractVerificationFieldLibraryItem = ({ index, fieldsLength, onAddFieldClick, onRemoveFieldClick, isDisabled }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

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
      <ContractVerificationFormRow>
        <Flex alignItems="center" justifyContent="space-between" ref={ ref } mt={ index !== 0 ? 6 : 0 }>
          <Text color="text.secondary" fontSize="sm">Contract library { index + 1 }</Text>
          <Flex columnGap={ 5 }>
            { fieldsLength > 1 && (
              <IconButton
                aria-label="delete"
                variant="outline"
                size="md"
                onClick={ handleRemoveButtonClick }
                disabled={ isDisabled }
              >
                <IconSvg name="minus"/>
              </IconButton>
            ) }
            { fieldsLength < LIMIT && (
              <IconButton
                aria-label="add"
                variant="outline"
                size="md"
                onClick={ handleAddButtonClick }
                disabled={ isDisabled }
              >
                <IconSvg name="plus"/>
              </IconButton>
            ) }
          </Flex>
        </Flex>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldText<FormFields, `libraries.${ number }.name`>
          name={ `libraries.${ index }.name` }
          required
          rules={{ maxLength: 255 }}
          placeholder="Library name (.sol file)"
        />
        { index === 0 ? (
          <>
            A library name called in the .sol file. Multiple libraries (up to 10) may be added for each contract.
          </>
        ) : null }
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldAddress<FormFields>
          name={ `libraries.${ index }.address` }
          required
          placeholder="Library address (0x...)"
        />
        { index === 0 ? (
          <>
            The 0x library address. This can be found in the generated json file or Truffle output (if using truffle).
          </>
        ) : null }
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraryItem);
