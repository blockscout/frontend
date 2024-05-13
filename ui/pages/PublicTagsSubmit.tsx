import React from 'react';

import type { FormSubmitResult } from 'ui/publicTags/submit/types';

import useApiQuery from 'lib/api/useApiQuery';
import * as mocks from 'ui/publicTags/submit/mocks';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

type Screen = 'form' | 'result' | 'initializing' | 'error';

const PublicTagsSubmit = () => {

  const [ screen, setScreen ] = React.useState<Screen>('result');
  const [ submitResult, setSubmitResult ] = React.useState<FormSubmitResult>(mocks.mixedResponses);

  const configQuery = useApiQuery('address_metadata_tag_types');

  React.useEffect(() => {
    if (!configQuery.isPending) {
      setScreen(configQuery.isError ? 'error' : 'result');
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
        return <PublicTagsSubmitForm config={ configQuery.data } onSubmitResult={ handleFormSubmitResult }/>;
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
