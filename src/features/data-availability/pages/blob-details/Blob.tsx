// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import TextAd from 'src/features/ads/text/components/TextAd';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';
import BlobEntity from 'src/features/data-availability/components/entity/BlobEntity';
import { BLOB } from 'src/features/data-availability/stubs';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

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
