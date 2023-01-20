import { Button, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { FormFields } from './types';

import ContractVerificationFieldMethod from './fields/ContractVerificationFieldMethod';
import ContractVerificationFlattenSourceCode from './methods/ContractVerificationFlattenSourceCode';
import ContractVerificationMultiPartFile from './methods/ContractVerificationMultiPartFile';
import ContractVerificationSourcify from './methods/ContractVerificationSourcify';
import ContractVerificationStandardInput from './methods/ContractVerificationStandardInput';
import ContractVerificationVyperContract from './methods/ContractVerificationVyperContract';

const ContractVerificationForm = () => {
  const { control, handleSubmit, watch } = useForm<FormFields>();

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback((data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
  }, []);

  const methods = React.useMemo(() => ({
    flatten_source_code: <ContractVerificationFlattenSourceCode control={ control }/>,
    standard_input: <ContractVerificationStandardInput control={ control }/>,
    sourcify: <ContractVerificationSourcify control={ control }/>,
    multi_part_file: <ContractVerificationMultiPartFile control={ control }/>,
    vyper_contract: <ContractVerificationVyperContract control={ control }/>,
  }), [ control ]);

  const method = watch('method');

  const content = methods[method] || null;

  return (
    <chakra.form
      noValidate
      onSubmit={ handleSubmit(onFormSubmit) }
      mt={ 12 }
    >
      <ContractVerificationFieldMethod control={ control }/>
      { content }
      { Boolean(method) && (
        <Button
          variant="solid"
          size="lg"
          type="submit"
          mt={ 12 }
        >
        Verify & publish
        </Button>
      ) }
    </chakra.form>
  );
};

export default React.memo(ContractVerificationForm);
