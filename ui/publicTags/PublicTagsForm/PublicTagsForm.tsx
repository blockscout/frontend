import {
  Button,
  Box,
  Grid,
  GridItem,
  Text,
  HStack,
  chakra,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { FieldError, Path, SubmitHandler } from 'react-hook-form';
import { useForm, useFieldArray } from 'react-hook-form';

import type { PublicTags, PublicTag, PublicTagNew, PublicTagErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import { EMAIL_REGEXP } from 'lib/validations/email';
import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

import PublicTagFormAction from './PublicTagFormAction';
import PublicTagFormAddressInput from './PublicTagFormAddressInput';
import PublicTagFormComment from './PublicTagFormComment';
import PublicTagsFormInput from './PublicTagsFormInput';

type Props = {
  changeToDataScreen: (success?: boolean) => void;
  data?: Partial<PublicTag>;
}

export type Inputs = {
  fullName?: string;
  email?: string;
  companyName?: string;
  companyUrl?: string;
  action: 'add' | 'report';
  tags?: string;
  addresses?: Array<{
    name: string;
    address: string;
  }>;
  comment?: string;
}

const placeholders = {
  fullName: 'Your name',
  email: 'Email',
  companyName: 'Company name',
  companyUrl: 'Company website',
  tags: 'Public tag (max 35 characters)',
  comment: 'Specify the reason for adding tags and color preference(s).',
} as Record<Path<Inputs>, string>;

const ADDRESS_INPUT_BUTTONS_WIDTH = 100;

const PublicTagsForm = ({ changeToDataScreen, data }: Props) => {
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();
  const inputSize = { base: 'md', lg: 'lg' };

  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm<Inputs>({
    defaultValues: {
      fullName: data?.full_name || '',
      email: data?.email || '',
      companyName: data?.company || '',
      companyUrl: data?.website || '',
      tags: data?.tags?.split(';').map((tag) => tag).join('; ') || '',
      addresses: data?.addresses?.map((address, index: number) => ({ name: `address.${ index }.address`, address })) ||
        [ { name: 'address.0.address', address: '' } ],
      comment: data?.additional_comment || '',
      action: data?.is_owner === undefined || data?.is_owner ? 'add' : 'report',
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'addresses',
    control,
  });

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const onAddFieldClick = useCallback(() => append({ address: '', name: '' }), [ append ]);

  const onRemoveFieldClick = useCallback((index: number) => () => remove(index), [ remove ]);

  const updatePublicTag = (formData: Inputs) => {
    const body: PublicTagNew = {
      full_name: formData.fullName || '',
      email: formData.email || '',
      company: formData.companyName || '',
      website: formData.companyUrl || '',
      is_owner: formData.action === 'add',
      addresses: formData.addresses?.map(({ address }) => address) || [],
      tags: formData.tags?.split(';').map((s) => s.trim()).join(';') || '',
      additional_comment: formData.comment || '',
    };

    if (!data?.id) {
      return apiFetch('public_tags', { fetchParams: { method: 'POST', body } });
    }

    return apiFetch('public_tags', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'PUT', body },
    });
  };

  const mutation = useMutation({
    mutationFn: updatePublicTag,
    onSuccess: async(data) => {
      const response = data as unknown as PublicTag;

      queryClient.setQueryData([ resourceKey('public_tags') ], (prevData: PublicTags | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.id === response.id);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.id === response.id) {
              return response;
            }

            return item;
          });
        }

        return [ response, ...(prevData || []) ];
      });

      changeToDataScreen(true);
    },
    onError: (error: ResourceErrorAccount<PublicTagErrors>) => {
      const errorMap = error.payload?.errors;
      if (errorMap?.full_name || errorMap?.email || errorMap?.tags || errorMap?.addresses || errorMap?.additional_comment) {
        errorMap?.full_name && setError('fullName', { type: 'custom', message: getErrorMessage(errorMap, 'full_name') });
        errorMap?.email && setError('email', { type: 'custom', message: getErrorMessage(errorMap, 'email') });
        errorMap?.tags && setError('tags', { type: 'custom', message: getErrorMessage(errorMap, 'tags') });
        errorMap?.addresses && setError('addresses.0.address', { type: 'custom', message: getErrorMessage(errorMap, 'addresses') });
        errorMap?.additional_comment && setError('comment', { type: 'custom', message: getErrorMessage(errorMap, 'additional_comment') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    setAlertVisible(false);
    mutation.mutate(data);
  }, [ mutation ]);

  return (
    <chakra.form
      noValidate
      width={{ base: 'auto', lg: `calc(100% - ${ ADDRESS_INPUT_BUTTONS_WIDTH }px)` }}
      maxWidth="844px"
      onSubmit={ handleSubmit(onSubmit) }
    >
      { isAlertVisible && <Box mb={ 4 }><FormSubmitAlert/></Box> }
      <Text size="sm" variant="secondary" paddingBottom={ 5 }>Company info</Text>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 5 }>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="fullName"
            control={ control }
            label={ placeholders.fullName }
            error={ errors.fullName }
            required
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyName"
            control={ control }
            label={ placeholders.companyName }
            error={ errors.companyName }
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="email"
            control={ control }
            label={ placeholders.email }
            pattern={ EMAIL_REGEXP }
            error={ errors.email }
            required
            size={ inputSize }
          />
        </GridItem>
        <GridItem>
          <PublicTagsFormInput<Inputs>
            fieldName="companyUrl"
            control={ control }
            label={ placeholders.companyUrl }
            error={ errors?.companyUrl }
            size={ inputSize }
          />
        </GridItem>
      </Grid>
      <Box marginTop={{ base: 5, lg: 8 }} marginBottom={{ base: 5, lg: 8 }}>
        <PublicTagFormAction control={ control }/>
      </Box>
      <Text size="sm" variant="secondary" marginBottom={ 5 }>Public tags (2 tags maximum, please use &quot;;&quot; as a divider)</Text>
      <Box marginBottom={ 4 }>
        <PublicTagsFormInput<Inputs>
          fieldName="tags"
          control={ control }
          label={ placeholders.tags }
          error={ errors.tags }
          required
          size={ inputSize }
        />
      </Box>
      { fields.map((field, index) => {
        return (
          <Box position="relative" key={ field.id } marginBottom={ 4 }>
            <PublicTagFormAddressInput
              control={ control }
              error={ errors?.addresses?.[index]?.address as FieldError }
              index={ index }
              fieldsLength={ fields.length }
              onAddFieldClick={ onAddFieldClick }
              onRemoveFieldClick={ onRemoveFieldClick }
              size={ inputSize }
            />
          </Box>
        );
      }) }
      <Box marginBottom={ 8 }>
        <PublicTagFormComment control={ control } error={ errors.comment } size={ inputSize }/>
      </Box>
      <HStack spacing={ 6 }>
        <Button
          size="lg"
          type="submit"
          isDisabled={ !isDirty }
          isLoading={ mutation.isPending }
        >
          Send request
        </Button>
      </HStack>
    </chakra.form>
  );
};

export default React.memo(PublicTagsForm);
