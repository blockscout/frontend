import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { SmartContractSecurityAuditSubmission } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import dayjs from 'lib/date/dayjs';
import useToast from 'lib/hooks/useToast';
import FormFieldCheckbox from 'ui/shared/forms/fields/FormFieldCheckbox';
import FormFieldEmail from 'ui/shared/forms/fields/FormFieldEmail';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';

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
  audit_publish_date: string;
  comment?: string;
};

type AuditSubmissionErrors = {
  errors: Record<keyof Inputs, Array<string>>;
};

const ContractSubmitAuditForm = ({ address, onSuccess }: Props) => {
  const containerRef = React.useRef<HTMLFormElement>(null);

  const apiFetch = useApiFetch();
  const toast = useToast();

  const formApi = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: { is_project_owner: false },
  });
  const { handleSubmit, formState, setError } = formApi;

  const onFormSubmit: SubmitHandler<Inputs> = React.useCallback(async(data) => {
    try {
      await apiFetch<'contract_security_audits', SmartContractSecurityAuditSubmission, AuditSubmissionErrors>('contract_security_audits', {
        pathParams: { hash: address },
        fetchParams: {
          method: 'POST',
          body: data,
        },
      });

      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Your audit report has been successfully submitted for review',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
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
        toast({
          position: 'top-right',
          title: 'Error',
          description: (_error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
      }
    }
  }, [ apiFetch, address, toast, setError, onSuccess ]);

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
        <VStack gap={ 5 } alignItems="flex-start">
          <FormFieldText<Inputs> name="submitter_name" isRequired placeholder="Submitter name"/>
          <FormFieldEmail<Inputs> name="submitter_email" isRequired placeholder="Submitter email"/>
          <FormFieldCheckbox<Inputs, 'is_project_owner'>
            name="is_project_owner"
            label="I'm the contract owner"
          />
          <FormFieldText<Inputs> name="project_name" isRequired placeholder="Project name"/>
          <FormFieldUrl<Inputs> name="project_url" isRequired placeholder="Project URL"/>
          <FormFieldText<Inputs> name="audit_company_name" isRequired placeholder="Audit company name"/>
          <FormFieldUrl<Inputs> name="audit_report_url" isRequired placeholder="Audit report URL"/>
          <FormFieldText<Inputs>
            name="audit_publish_date"
            type="date"
            max={ dayjs().format('YYYY-MM-DD') }
            isRequired
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
          size="lg"
          mt={ 8 }
          isLoading={ formState.isSubmitting }
          loadingText="Send request"
          isDisabled={ !formState.isDirty }
        >
          Send request
        </Button>
      </form>
    </FormProvider>
  );
};

export default React.memo(ContractSubmitAuditForm);
