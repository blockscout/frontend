import { Button, chakra } from '@chakra-ui/react';
import _fromPairs from 'lodash/fromPairs';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { MethodInputFields } from './types';
import type { SmartContractMethodInput } from 'types/api/contract';

import ContractReadItemInputField from './ContractReadItemInputField';

interface Props {
  data: Array<SmartContractMethodInput>;
}

const ContractReadItemInput = ({ data }: Props) => {
  const { control, handleSubmit } = useForm<MethodInputFields>({
    defaultValues: _fromPairs(data.map(({ name }, index) => [ name || index, '' ])),
  });

  const onSubmit: SubmitHandler<MethodInputFields> = React.useCallback((data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
  }, [ ]);

  return (
    <chakra.form
      noValidate
      display="flex"
      columnGap={ 3 }
      flexDir={{ base: 'column', lg: 'row' }}
      rowGap={ 2 }
      alignItems={{ base: 'flex-start', lg: 'center' }}
      onSubmit={ handleSubmit(onSubmit) }
    >
      { data.map(({ type, name }, index) => {
        return (
          <ContractReadItemInputField
            key={ name || index }
            name={ name }
            index={ index }
            control={ control }
            type={ type }
          />
        );
      }) }
      <Button
        variant="outline"
        size="sm"
        flexShrink={ 0 }
        type="submit"
      >
        Query
      </Button>
    </chakra.form>
  );
};

export default ContractReadItemInput;
