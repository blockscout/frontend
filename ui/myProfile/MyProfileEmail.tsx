import { Button, chakra, FormControl, Heading, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { UserInfo } from 'types/api/account';

import { EMAIL_REGEXP } from 'lib/validations/email';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface FormFields {
  email: string;
}

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
}

const MyProfileEmail = ({ profileQuery }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: profileQuery.data?.email || '',
    },
  });

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback((formData) => {
    // eslint-disable-next-line no-console
    console.log(formData);
  }, [ ]);

  const isDisabled = formApi.formState.isSubmitting;

  return (
    <section>
      <Heading as="h2" size="sm" mb={ 3 }>Notifications</Heading>
      <FormProvider { ...formApi }>
        <chakra.form
          noValidate
          onSubmit={ formApi.handleSubmit(onFormSubmit) }
        >
          <FormControl variant="floating" isDisabled={ isDisabled } isRequired size="md">
            <InputGroup>
              <Input
                { ...formApi.register('email', { required: true, pattern: EMAIL_REGEXP }) }
                required
                isInvalid={ Boolean(formApi.formState.errors.email) }
                isDisabled={ isDisabled }
                autoComplete="off"
              />
              <InputPlaceholder text="Email" error={ formApi.formState.errors.email }/>
              { !formApi.formState.isDirty && (
                <InputRightElement h="100%">
                  <IconSvg name="certified" boxSize={ 5 } color="green.500"/>
                </InputRightElement>
              ) }
            </InputGroup>
            <Text variant="secondary" mt={ 1 } fontSize="sm">Email for watch list notifications and private tags</Text>
          </FormControl>
          <Button
            mt={ 6 }
            size="sm"
            variant="outline"
            type="submit"
            isDisabled={ formApi.formState.isSubmitting || !formApi.formState.isDirty }
            isLoading={ formApi.formState.isSubmitting }
            loadingText="Save changes"
          >
            Save changes
          </Button>
        </chakra.form>
      </FormProvider>
    </section>
  );
};

export default React.memo(MyProfileEmail);
