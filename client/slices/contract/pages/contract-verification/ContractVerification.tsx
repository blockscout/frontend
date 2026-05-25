// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import PageTitle from 'client/shell/page/title/PageTitle';

import ContractVerificationForm from 'client/slices/contract/pages/contract-verification/ContractVerificationForm';
import useFormConfigQuery from 'client/slices/contract/pages/contract-verification/useFormConfigQuery';

import ApiFetchAlert from 'client/shared/alerts/ApiFetchAlert';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

const ContractVerification = () => {
  const configQuery = useFormConfigQuery(true);

  const content = (() => {
    if (configQuery.isError) {
      return <ApiFetchAlert/>;
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
