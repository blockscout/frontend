import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractVerificationMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractVerificationForm from 'ui/contractVerification/ContractVerificationForm';
import { isValidVerificationMethod, sortVerificationMethods } from 'ui/contractVerification/utils';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerification = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const method = getQueryParamString(router.query.method) as SmartContractVerificationMethod;

  const configQuery = useApiQuery('contract_verification_config', {
    queryOptions: {
      select: (data) => {
        return {
          ...data,
          verification_options: data.verification_options.filter(isValidVerificationMethod).sort(sortVerificationMethods),
        };
      },
      enabled: Boolean(hash),
    },
  });

  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm
        method={ method && configQuery.data.verification_options.includes(method) ? method : undefined }
        config={ configQuery.data }
        hash=""
      />
    );
  })();

  return (
    <>
      <PageTitle
        title="Verify & publish contract"
      />
      { content }
    </>
  );
};

export default ContractVerification;
