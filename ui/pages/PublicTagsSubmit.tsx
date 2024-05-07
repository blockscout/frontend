import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

type Screen = 'form' | 'result' | 'initializing' | 'error';

const PublicTagsSubmit = () => {

  const [ screen, setScreen ] = React.useState<Screen>('initializing');

  const configQuery = useApiQuery('address_metadata_tag_types');

  React.useEffect(() => {
    if (!configQuery.isPending) {
      setScreen(configQuery.isError ? 'error' : 'form');
    }
  }, [ configQuery.isError, configQuery.isPending ]);

  const content = (() => {
    switch (screen) {
      case 'initializing':
        return <ContentLoader/>;
      case 'error':
        return <DataFetchAlert/>;
      case 'form':
        return <PublicTagsSubmitForm config={ configQuery.data }/>;
      case 'result':
        return <PublicTagsSubmitResult/>;
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
