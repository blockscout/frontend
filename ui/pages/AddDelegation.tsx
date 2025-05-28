import React from 'react';

import AddDelegationForm from 'ui/addDelegation/AddDelegationForm';
import useFormConfigQuery from 'ui/contractVerification/useFormConfigQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const AddDelegation = () => {
  const configQuery = useFormConfigQuery(true);

  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (configQuery.isPending) {
      return <ContentLoader/>;
    }

    return (
      <AddDelegationForm/>
    );
  })();

  return (
    <>
      <PageTitle title="Delegate to Validator"/>
      { content }
    </>
  );
};

export default AddDelegation;
