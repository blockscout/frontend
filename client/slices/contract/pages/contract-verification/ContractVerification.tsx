// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ContractVerificationForm from 'client/slices/contract/pages/contract-verification/ContractVerificationForm';
import useFormConfigQuery from 'client/slices/contract/pages/contract-verification/useFormConfigQuery';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const ContractVerification = () => {
  const configQuery = useFormConfigQuery(true);

  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <ContractVerificationForm config={ configQuery.data }/>
    );
  })();

  return (
    <>
      <PageTitle title="Verify & publish contract"/>
      { content }
    </>
  );
};

export default ContractVerification;
