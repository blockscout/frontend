import React from 'react';

import AccountBalanceCheckerForm from 'ui/accountBalanceChecker/AccountBalanceCheckerForm';
import useFormConfigQuery from 'ui/contractVerification/useFormConfigQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const AccountBalanceChecker = () => {
  const configQuery = useFormConfigQuery(true);

  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <AccountBalanceCheckerForm/>
    );
  })();

  return (
    <>
      <PageTitle title="Balance Checker (ETH)"/>
      { content }
    </>
  );
};

export default AccountBalanceChecker;
