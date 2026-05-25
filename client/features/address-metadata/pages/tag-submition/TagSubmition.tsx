// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { FormSubmitResult } from './types';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import useProfileQuery from 'client/features/account/hooks/useProfileQuery';

import ApiFetchAlert from 'client/shared/alerts/ApiFetchAlert';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import TagSubmitionForm from './TagSubmitionForm';
import TagSubmitionResult from './TagSubmitionResult';

type Screen = 'form' | 'result' | 'initializing' | 'error';

const TagSubmition = () => {

  const [ screen, setScreen ] = React.useState<Screen>('initializing');
  const [ submitResult, setSubmitResult ] = React.useState<FormSubmitResult>();

  const profileQuery = useProfileQuery();
  const configQuery = useApiQuery('metadata:public_tag_types', { queryOptions: { enabled: !profileQuery.isLoading } });

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
        return <ApiFetchAlert/>;
      case 'form':
        return <TagSubmitionForm config={ configQuery.data } onSubmitResult={ handleFormSubmitResult } userInfo={ profileQuery.data }/>;
      case 'result':
        return <TagSubmitionResult data={ submitResult }/>;
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

export default TagSubmition;
