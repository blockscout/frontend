import { useUpdateEffect } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { Option } from 'ui/shared/forms/inputs/select/types';

import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const SOURCIFY_ERROR_REGEXP = /\(([^()]*)\)/;

const ContractVerificationFieldContractIndex = () => {
  const [ options, setOptions ] = React.useState<Array<Option>>([]);
  const { formState, watch } = useFormContext<FormFields>();

  const sources = watch('sources');
  const sourcesError = 'sources' in formState.errors ? formState.errors.sources?.message : undefined;

  useUpdateEffect(() => {
    if (!sourcesError) {
      return;
    }

    const matchResult = sourcesError.match(SOURCIFY_ERROR_REGEXP);
    const parsedMethods = matchResult?.[1].split(',');
    if (!Array.isArray(parsedMethods) || parsedMethods.length === 0) {
      return;
    }

    const newOptions = parsedMethods.map((option, index) => ({ label: option, value: String(index + 1) }));
    setOptions(newOptions);
  }, [ sourcesError ]);

  useUpdateEffect(() => {
    setOptions([]);
  }, [ sources ]);

  if (options.length === 0) {
    return null;
  }

  return (
    <ContractVerificationFormRow>
      <FormFieldFancySelect<FormFields, 'contract_index'>
        name="contract_index"
        placeholder="Contract name"
        options={ options }
        isRequired
        isAsync={ false }
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldContractIndex);
