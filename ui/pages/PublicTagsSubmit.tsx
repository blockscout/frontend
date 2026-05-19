import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { PublicTagType } from 'types/api/addressMetadata';
import type { FormSubmitResult } from 'ui/publicTags/submit/types';

import appConfig from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PublicTagApplicationsList from 'ui/publicTags/list/PublicTagApplicationsList';
import PublicTagsSubmitForm from 'ui/publicTags/submit/PublicTagsSubmitForm';
import PublicTagsSubmitResult from 'ui/publicTags/submit/PublicTagsSubmitResult';
import PageTitle from 'ui/shared/Page/PageTitle';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

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

  const router = useRouter();
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery();
  useRedirectForInvalidAuthToken();

  const configQuery = useApiQuery('metadata:public_tag_types', {
    queryOptions: {
      enabled: !profileQuery.isLoading && appConfig.features.addressMetadata.isEnabled,
    },
  });

  const handleFormSubmitResult = React.useCallback(async(result: FormSubmitResult) => {
    setSubmitResult(result);

    if (result.every((r) => r.error === null)) {
      await queryClient.invalidateQueries({
        queryKey: getResourceKey('admin:public_tag_applications_list', {
          pathParams: { chainId: appConfig.chain.id },
        }),
      });
      router.push(
        { pathname: '/public-tags/submit', query: { tab: 'my-requests' } },
        undefined,
        { shallow: true },
      );
    }
  }, [ queryClient, router ]);

  const tagTypes = configQuery.data?.tagTypes ?? DEFAULT_TAG_TYPES;

  const tabs: Array<TabItemRegular> = React.useMemo(() => [
    {
      id: 'submit-tag',
      title: 'Submit new tag',
      component: submitResult ? (
        <PublicTagsSubmitResult data={ submitResult }/>
      ) : (
        <PublicTagsSubmitForm
          config={{ tagTypes }}
          onSubmitResult={ handleFormSubmitResult }
          userInfo={ profileQuery.data }
        />
      ),
    },
    {
      id: 'my-requests',
      title: 'My requests',
      component: <PublicTagApplicationsList/>,
    },
  ], [ submitResult, tagTypes, handleFormSubmitResult, profileQuery.data ]);

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
      <RoutedTabs
        tabs={ tabs }
        defaultTabId="submit-tag"
      />
    </>
  );
};

export default PublicTagsSubmit;
