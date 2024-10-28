import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { SmartContractSecurityAuditSubmission } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useToast from 'lib/hooks/useToast';

import AuditComment from './fields/AuditComment';
import AuditCompanyName from './fields/AuditCompanyName';
import AuditProjectName from './fields/AuditProjectName';
import AuditProjectUrl from './fields/AuditProjectUrl';
import AuditReportDate from './fields/AuditReportDate';
import AuditReportUrl from './fields/AuditReportUrl';
import AuditSubmitterEmail from './fields/AuditSubmitterEmail';
import AuditSubmitterIsOwner from './fields/AuditSubmitterIsOwner';
import AuditSubmitterName from './fields/AuditSubmitterName';

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
}

type AuditSubmissionErrors = {
  errors: Record<keyof Inputs, Array<string>>;
}

const ContractSubmitAuditForm = ({ address, onSuccess }: Props) => {
  const containerRef = React.useRef<HTMLFormElement>(null);

  const apiFetch = useApiFetch();
  const toast = useToast();

  const { handleSubmit, formState, control, setError } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: { is_project_owner: false },
  });

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
    <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
      <VStack gap={ 5 }>
        <AuditSubmitterName control={ control }/>
        <AuditSubmitterEmail control={ control }/>
        <AuditSubmitterIsOwner control={ control }/>
        <AuditProjectName control={ control }/>
        <AuditProjectUrl control={ control }/>
        <AuditCompanyName control={ control }/>
        <AuditReportUrl control={ control }/>
        <AuditReportDate control={ control }/>

        <AuditComment control={ control }/>
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
  );
};

export default React.memo(ContractSubmitAuditForm);
