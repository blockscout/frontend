// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractVerificationMethodApi } from 'client/slices/contract/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import ContractVerificationForm from 'client/slices/contract/pages/contract-verification/ContractVerificationForm';
import useFormConfigQuery from 'client/slices/contract/pages/contract-verification/useFormConfigQuery';
import type { SmartContractVerificationMethod } from 'client/slices/contract/pages/contract-verification/utils';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerificationForAddress = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const method = getQueryParamString(router.query.method) as SmartContractVerificationMethod;

  const contractQuery = useApiQuery('general:contract', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
    },
  });

  throwOnResourceLoadError(contractQuery);

  const configQuery = useFormConfigQuery(Boolean(hash));

  React.useEffect(() => {
    if (method && hash) {
      router.replace({ pathname: '/address/[hash]/contract-verification', query: { hash } }, undefined, { scroll: false, shallow: true });
    }
  // onMount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const isVerifiedContract = contractQuery.data?.is_verified && !contractQuery.data.is_partially_verified;

  React.useEffect(() => {
    if (isVerifiedContract) {
      router.push({ pathname: '/address/[hash]', query: { hash, tab: 'contract' } }, undefined, { scroll: false, shallow: true });
    }
  }, [ hash, isVerifiedContract, router ]);

  const content = (() => {
    if (configQuery.isError || !hash || contractQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending || contractQuery.isPending || isVerifiedContract) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm
        method={ method && configQuery.data.verification_options.includes(method) ? method as SmartContractVerificationMethodApi : undefined }
        config={ configQuery.data }
        hash={ hash }
      />
    );
  })();

  return (
    <>
      <PageTitle
        title="New smart contract verification"
      />
      <AddressEntity
        address={{ hash, is_contract: true }}
        noLink
        variant="subheading"
        mb={ 12 }
        w="min-content"
        maxW="100%"
      />
      { content }
    </>
  );
};

export default ContractVerificationForAddress;
