// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import BlobEntity from 'client/features/data-availability/components/entity/BlobEntity';
import { BLOB } from 'client/features/data-availability/stubs';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

import BlobInfo from './BlobInfo';

const BlobPageContent = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('general:blob', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: BLOB,
      refetchOnMount: false,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'general:blob', error, isError: true });
      }

      return <DataFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return <BlobInfo data={ data } isLoading={ isPlaceholderData }/>;
  })();

  const titleSecondRow = (
    <>
      <BlobEntity hash={ hash } noLink variant="subheading"/>
      <NetworkExplorers
        type="blob"
        pathParam={ hash }
        ml={{ base: 3, lg: 'auto' }}
      />
    </>
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
