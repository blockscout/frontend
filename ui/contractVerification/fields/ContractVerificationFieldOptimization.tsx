import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { FormFields } from '../types';

import FormFieldCheckbox from 'ui/shared/forms/fields/FormFieldCheckbox';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldOptimization = () => {
  const [ isEnabled, setIsEnabled ] = React.useState(true);

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return (
    <ContractVerificationFormRow>
      <Flex columnGap={ 5 } h={{ base: 'auto', lg: '32px' }}>
        <FormFieldCheckbox<FormFields, 'is_optimization_enabled'>
          name="is_optimization_enabled"
          label="Optimization enabled"
          onChange={ handleCheckboxChange }
          flexShrink={ 0 }
        />
        { isEnabled && (
          <FormFieldText<FormFields, 'optimization_runs'>
            name="optimization_runs"
            isRequired
            placeholder="Optimization runs"
            type="number"
            size="xs"
            minW="100px"
            maxW="200px"
            flexShrink={ 1 }
          />
        ) }
      </Flex>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldOptimization);
