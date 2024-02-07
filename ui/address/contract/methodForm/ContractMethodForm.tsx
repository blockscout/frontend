import { Button, Flex, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { SmartContractMethodInput, SmartContractWriteMethod } from 'types/api/contract';

import config from 'configs/app';

import { ARRAY_REGEXP } from '../utils';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';

type ContractMethodFormFields = Record<string, string>;

interface Props {
  data: SmartContractWriteMethod;
}

const ContractMethodForm = ({ data }: Props) => {

  const formApi = useForm<ContractMethodFormFields>({
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const onFormSubmit: SubmitHandler<ContractMethodFormFields> = React.useCallback(async(formData) => {
    // eslint-disable-next-line no-console
    console.log('onFormSubmit', formData);
  }, []);

  const inputs: Array<SmartContractMethodInput> = React.useMemo(() => {
    return [
      ...('inputs' in data ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: `Send native ${ config.chain.currency.symbol || 'coin' }`,
        type: 'uint256' as const,
        internalType: 'uint256' as const,
        fieldType: 'native_coin' as const,
      } ] : []),
    ];
  }, [ data ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
        // onChange={ handleFormChange }
      >
        <Flex flexDir="column" rowGap={ 3 }>
          { inputs.map((input, index) => {
            if (input.components && input.type === 'tuple') {
              return <ContractMethodFieldInputTuple key={ index } data={ input } basePath={ `${ index }` }/>;
            }

            const arrayMatch = input.type.match(ARRAY_REGEXP);
            if (arrayMatch) {
              return <ContractMethodFieldInputArray key={ index } data={ input } basePath={ `${ index }` }/>;
            }

            return <ContractMethodFieldInput key={ index } data={ input } path={ `${ index }` }/>;
          }) }
        </Flex>
        <Button
          loadingText="Submit"
          variant="outline"
          size="sm"
          flexShrink={ 0 }
          width="min-content"
          px={ 4 }
          type="submit"
        >
          Submit
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(ContractMethodForm);
