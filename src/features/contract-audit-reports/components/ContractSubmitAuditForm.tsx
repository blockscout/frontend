// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { getLocalTimeZone, toCalendarDate, today } from '@internationalized/date';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { operations } from '@blockscout/api-types';

import useApiFetch from 'src/api/hooks/useApiFetch';
import type { ResourceError } from 'src/api/resources';

import { Button } from 'src/toolkit/chakra/button';
import { toaster } from 'src/toolkit/chakra/toaster';
import { FormFieldCheckbox } from 'src/toolkit/components/forms/fields/FormFieldCheckbox';
import { FormFieldDate } from 'src/toolkit/components/forms/fields/FormFieldDate';
import { FormFieldEmail } from 'src/toolkit/components/forms/fields/FormFieldEmail';
import { FormFieldText } from 'src/toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'src/toolkit/components/forms/fields/FormFieldUrl';

interface Props {
  address?: string;
  onSuccess: () => void;
}

export type Inputs = {
  submitter_name: string;
  submitter_email: string;
  is_project_owner: boolean;
  project_name: string;
  project_url: string;
  audit_company_name: string;
  audit_report_url: string;
  audit_publish_date: Array<DateValue>;
  comment?: string;
};

type AuditSubmissionErrors = {
  errors: Record<keyof Inputs, Array<string>>;
};

const ContractSubmitAuditForm = ({ address, onSuccess }: Props) => {
  const containerRef = React.useRef<HTMLFormElement>(null);

  const apiFetch = useApiFetch();

  const formApi = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: { is_project_owner: false, audit_publish_date: [] },
  });
  const { handleSubmit, formState, setError } = formApi;

  const maxDate = React.useMemo(() => today(getLocalTimeZone()), []);

  const onFormSubmit: SubmitHandler<Inputs> = React.useCallback(async(data) => {
    const [ publishDate ] = data.audit_publish_date;
    if (!publishDate) {
      return;
    }

    try {
      await apiFetch<
        'core:contract_security_audits',
        operations['SmartContractController.audit_report_submission']['requestBody'],
        AuditSubmissionErrors
      >('core:contract_security_audits', {
        pathParams: { hash: address },
        fetchParams: {
          method: 'POST',
          body: {
            ...data,
            // the API expects a date-only string, the picker may carry a time
            audit_publish_date: toCalendarDate(publishDate).toString(),
          },
        },
      });

      toaster.success({
        title: 'Success',
        description: 'Your audit report has been successfully submitted for review',
      });

      onSuccess();

    } catch (_error) {
      const error = _error as ResourceError<AuditSubmissionErrors>;
      // add scroll to the error field
      const errorMap = error?.payload?.errors;
      if (errorMap && Object.keys(errorMap).length) {
        (Object.keys(errorMap) as Array<keyof Inputs>).forEach((errorField) => {
          setError(errorField, { type: 'custom', message: errorMap[errorField].join(', ') });
        });
      } else {
        toaster.error({
          title: 'Error',
          description: (_error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
        });
      }
    }
  }, [ apiFetch, address, setError, onSuccess ]);

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
        <VStack gap={ 5 } alignItems="flex-start">
          <FormFieldText<Inputs> name="submitter_name" required placeholder="Submitter name"/>
          <FormFieldEmail<Inputs> name="submitter_email" required placeholder="Submitter email"/>
          <FormFieldCheckbox<Inputs, 'is_project_owner'>
            name="is_project_owner"
            label="I'm the contract owner"
          />
          <FormFieldText<Inputs> name="project_name" required placeholder="Project name"/>
          <FormFieldUrl<Inputs> name="project_url" required placeholder="Project URL"/>
          <FormFieldText<Inputs> name="audit_company_name" required placeholder="Audit company name"/>
          <FormFieldUrl<Inputs> name="audit_report_url" required placeholder="Audit report URL"/>
          <FormFieldDate<Inputs, 'audit_publish_date'>
            name="audit_publish_date"
            max={ maxDate }
            required
            placeholder="Audit publish date"
          />
          <FormFieldText<Inputs>
            name="comment"
            placeholder="Comment"
            maxH="160px"
            rules={{ maxLength: 300 }}
            asComponent="Textarea"
          />
        </VStack>
        <Button
          type="submit"
          mt={ 8 }
          loading={ formState.isSubmitting }
          loadingText="Send request"
          disabled={ !formState.isDirty }
        >
          Send request
        </Button>
      </form>
    </FormProvider>
  );
};

export default React.memo(ContractSubmitAuditForm);
