import React from 'react';

import type { PublicTagType } from 'types/api/addressMetadata';
import type { FormSubmitResult } from 'ui/publicTags/submit/types';

import appConfig from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import PageTitle from 'ui/shared/Page/PageTitle';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

// Fallback tag types when the metadata service is not configured.
const DEFAULT_TAG_TYPES: Array<PublicTagType> = [
  { id: 'name', type: 'name', description: 'Name or label for the address' },
  { id: 'generic', type: 'generic', description: 'Generic tag' },
  { id: 'classifier', type: 'classifier', description: 'Address classifier (exchange, bridge, etc.)' },
  { id: 'information', type: 'information', description: 'Informational tag' },
  { id: 'note', type: 'note', description: 'Note' },
  { id: 'protocol', type: 'protocol', description: 'Protocol or dApp tag' },
  { id: 'meme', type: 'meme', description: 'Meme token or community project tag' },
  { id: 'exchange', type: 'exchange', description: 'Exchange address tag' },
  { id: 'liquidity_pool', type: 'liquidity_pool', description: 'Liquidity pool contract tag' },
];

const PublicTagsSubmit = () => {
  const [ submitResult, setSubmitResult ] = React.useState<FormSubmitResult>();

  const profileQuery = useProfileQuery();
  const configQuery = useApiQuery('metadata:public_tag_types', {
    queryOptions: {
      enabled: !profileQuery.isLoading && appConfig.features.addressMetadata.isEnabled,
    },
  });

  const handleFormSubmitResult = React.useCallback((result: FormSubmitResult) => {
    setSubmitResult(result);
  }, []);

  const tagTypes = configQuery.data?.tagTypes ?? DEFAULT_TAG_TYPES;

  if (profileQuery.isLoading || (appConfig.features.addressMetadata.isEnabled && configQuery.isPending)) {
    return (
      <>
        <PageTitle title="Request a public tag/label"/>
        <ContentLoader/>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Request a public tag/label"/>
      { submitResult ? (
        <PublicTagsSubmitResult data={ submitResult }/>
      ) : (
        <PublicTagsSubmitForm
          config={{ tagTypes }}
          onSubmitResult={ handleFormSubmitResult }
          userInfo={ profileQuery.data }
        />
      ) }
    </>
  );
};

export default PublicTagsSubmit;
