import { Alert, Button, chakra, Flex } from '@chakra-ui/react';
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
import FormFieldReCaptcha from 'ui/shared/forms/fields/FormFieldReCaptcha';

import CsvExportFormField from './CsvExportFormField';

interface Props {
  hash: string;
  resource: ResourceName;
  filterType?: CsvExportParams['filterType'] | null;
  filterValue?: CsvExportParams['filterValue'] | null;
  fileNameTemplate: string;
  exportType: CsvExportParams['type'] | undefined;
}

const CsvExportForm = ({ hash, resource, filterType, filterValue, fileNameTemplate, exportType }: Props) => {
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
      const url = buildUrl(resource, { hash } as never, {
        address_id: hash,
        from_period: exportType !== 'holders' ? data.from : null,
        to_period: exportType !== 'holders' ? data.to : null,
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
      const fileName = exportType === 'holders' ?
        `${ fileNameTemplate }_${ hash }.csv` :
        // eslint-disable-next-line max-len
        `${ fileNameTemplate }_${ hash }_${ data.from }_${ data.to }${ filterType && filterValue ? '_with_filter_type_' + filterType + '_value_' + filterValue : '' }.csv`;
      downloadBlob(blob, fileName);

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

  }, [ resource, hash, exportType, filterType, filterValue, fileNameTemplate, toast ]);

  const disabledFeatureMessage = (
    <Alert status="error">
      CSV export is not available at the moment since reCaptcha is not configured for this application.
      Please contact the service maintainer to make necessary changes in the service configuration.
    </Alert>
  );

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
      >
        <Flex columnGap={ 5 } rowGap={ 3 } flexDir={{ base: 'column', lg: 'row' }} alignItems={{ base: 'flex-start', lg: 'center' }} flexWrap="wrap">
          { exportType !== 'holders' && <CsvExportFormField name="from" formApi={ formApi }/> }
          { exportType !== 'holders' && <CsvExportFormField name="to" formApi={ formApi }/> }
          <FormFieldReCaptcha disabledFeatureMessage={ disabledFeatureMessage }/>
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
