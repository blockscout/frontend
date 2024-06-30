import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from '../shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import AspectDetails from 'ui/aspect/AspectDetails';
import TextAd from 'ui/shared/ad/TextAd';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

import AddressTxs from '../address/AddressTxs';
import AspectBindings from '../aspect/AspectBindings';
import AspectProperties from '../aspect/AspectProperties';
import RoutedTabs from '../shared/Tabs/RoutedTabs';

const AddressPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);

  const aspectQuery = useApiQuery('aspects', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
    },
  });

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      { id: 'txs', title: 'Processed Transactions', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
      { id: 'properties', title: 'Properties', component: <AspectProperties aspectQuery={ aspectQuery }/> },
      { id: 'bind', title: 'Bindings', component: <AspectBindings scrollRef={ tabsScrollRef } aspectQuery={ aspectQuery }/> },
    ];
  }, [ aspectQuery ]);

  const tags = (
    <EntityTags
      data={ aspectQuery.data }
      isLoading={ aspectQuery.isPlaceholderData }
      tagsBefore={ [
        { label: 'aspect', display_name: 'ASPECT' },
      ] }
      contentAfter={
        <NetworkExplorers type="address" pathParam={ hash } ml="auto" hideText={ isMobile }/>
      }
    />
  );

  const content = aspectQuery.isError ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Address details"
        backLink={ backLink }
        contentAfter={ tags }
        isLoading={ aspectQuery.isPlaceholderData }
      />
      <AspectDetails aspectQuery={ aspectQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { content }
    </>
  );
};

export default AddressPageContent;
