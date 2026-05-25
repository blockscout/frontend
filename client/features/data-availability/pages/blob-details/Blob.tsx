// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import PageTitle from 'client/shell/page/title/PageTitle';

import TextAd from 'client/features/ads/text/components/TextAd';
import AlternativeExplorers from 'client/features/alternative-explorers/components/AlternativeExplorers';
import BlobEntity from 'client/features/data-availability/components/entity/BlobEntity';
import { BLOB } from 'client/features/data-availability/stubs';

import ApiFetchAlert from 'client/shared/alerts/ApiFetchAlert';
import isCustomAppError from 'client/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

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

      return <ApiFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return <BlobInfo data={ data } isLoading={ isPlaceholderData }/>;
  })();

  const titleSecondRow = (
    <>
      <BlobEntity hash={ hash } noLink variant="subheading"/>
      <AlternativeExplorers
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
