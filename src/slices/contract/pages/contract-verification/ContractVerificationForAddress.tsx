// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractVerificationMethodApi } from 'src/slices/contract/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import ContractVerificationForm from 'src/slices/contract/pages/contract-verification/ContractVerificationForm';
import useFormConfigQuery from 'src/slices/contract/pages/contract-verification/useFormConfigQuery';
import type { SmartContractVerificationMethod } from 'src/slices/contract/pages/contract-verification/utils';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

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
      return <ApiFetchAlert/>;
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
