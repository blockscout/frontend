import { Button, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields } from './types';
import type { CsvExportParams } from 'types/client/address';

import buildUrl from 'lib/api/buildUrl';
import type { ResourceName } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import downloadBlob from 'lib/downloadBlob';
import useToast from 'lib/hooks/useToast';

import CsvExportFormField from './CsvExportFormField';
import CsvExportFormReCaptcha from './CsvExportFormReCaptcha';

interface Props {
  hash: string;
  resource: ResourceName;
  filterType?: CsvExportParams['filterType'] | null;
  filterValue?: CsvExportParams['filterValue'] | null;
  fileNameTemplate: string;
}

const CsvExportForm = ({ hash, resource, filterType, filterValue, fileNameTemplate }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      from: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
  });
  const { handleSubmit, formState } = formApi;
  const toast = useToast();

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    try {
      const url = buildUrl(resource, undefined, {
        address_id: hash,
        from_period: data.from,
        to_period: data.to,
        filter_type: filterType,
        filter_value: filterValue,
        recaptcha_response: data.reCaptcha,
      });

      const response = await fetch(url, {
        headers: {
          'content-type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();
      downloadBlob(
        blob,
        `${ fileNameTemplate }_${ hash }_${ data.from }_${ data.to }
        ${ filterType && filterValue ? '_with_filter_type_' + filterType + '_value_' + filterValue : '' }.csv`,
      );

    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }

  }, [ fileNameTemplate, hash, resource, filterType, filterValue, toast ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
      >
        <Flex columnGap={ 5 } rowGap={ 3 } flexDir={{ base: 'column', lg: 'row' }} alignItems={{ base: 'flex-start', lg: 'center' }} flexWrap="wrap">
          <CsvExportFormField name="from" formApi={ formApi }/>
          <CsvExportFormField name="to" formApi={ formApi }/>
          <CsvExportFormReCaptcha formApi={ formApi }/>
        </Flex>
        <Button
          variant="solid"
          size="lg"
          type="submit"
          mt={ 8 }
          isLoading={ formState.isSubmitting }
          loadingText="Download"
          isDisabled={ !formState.isValid }
        >
          Download
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(CsvExportForm);
