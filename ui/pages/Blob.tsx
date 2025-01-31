import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOB } from 'stubs/blobs';
import BlobInfo from 'ui/blob/BlobInfo';
import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const BlobPageContent = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('blob', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: BLOB,
      refetchOnMount: false,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'blob', error, isError: true });
      }

      return <DataFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return <BlobInfo data={ data } isLoading={ isPlaceholderData }/>;
  })();

  const titleSecondRow = (
    <BlobEntity hash={ hash } noLink fontWeight={ 500 } fontFamily="heading"/>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Blob details"
        secondRow={ titleSecondRow }
      />
      { content }
    </>
  );
};

export default BlobPageContent;
