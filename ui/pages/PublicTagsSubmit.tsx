import React from 'react';

import type { FormSubmitResult } from 'ui/publicTags/submit/types';

import useApiQuery from 'lib/api/useApiQuery';
import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

type Screen = 'form' | 'result' | 'initializing' | 'error';

const PublicTagsSubmit = () => {

  const [ screen, setScreen ] = React.useState<Screen>('initializing');
  const [ submitResult, setSubmitResult ] = React.useState<FormSubmitResult>();

  const userQuery = useFetchProfileInfo();
  const configQuery = useApiQuery('address_metadata_tag_types', { queryOptions: { enabled: !userQuery.isLoading } });

  React.useEffect(() => {
    if (!configQuery.isPending) {
      setScreen(configQuery.isError ? 'error' : 'form');
    }
  }, [ configQuery.isError, configQuery.isPending ]);

  const handleFormSubmitResult = React.useCallback((result: FormSubmitResult) => {
    setSubmitResult(result);
    setScreen('result');
  }, []);

  const content = (() => {
    switch (screen) {
      case 'initializing':
        return <ContentLoader/>;
      case 'error':
        return <DataFetchAlert/>;
      case 'form':
        return <PublicTagsSubmitForm config={ configQuery.data } onSubmitResult={ handleFormSubmitResult } userInfo={ userQuery.data }/>;
      case 'result':
        return <PublicTagsSubmitResult data={ submitResult }/>;
      default:
        return null;
    }
  })();

  return (
    <>
      <PageTitle title="Request a public tag/label"/>
      { content }
    </>
  );
};

export default PublicTagsSubmit;
