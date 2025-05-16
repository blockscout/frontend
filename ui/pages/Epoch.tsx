import { chakra, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import { useFetchEpochById } from 'lib/getEpochById';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import EpochDetails from 'ui/epoch/EpochDetails';
import Skeleton from 'ui/shared/chakra/Skeleton';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};

const EpochPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();
  const epochId = getQueryParamString(router.query.id);

  const { data, loading } = useFetchEpochById(epochId);

  const tabs: Array<RoutedTab> = React.useMemo(
    () =>
      [
        {
          id: 'index',
          title: 'Details',
          component: !loading && data && (
            <EpochDetails epochData={ data } isLoading={ loading }/>
          ),
        },
      ].filter(Boolean),
    [ data, loading ],
  );

  const backLink = React.useMemo(() => {
    const hasGoBackLink =
      appProps.referrer && appProps.referrer.includes('/blocks');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to blocks list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  throwOnAbsentParamError(epochId);

  const title = (() => `Epoch #${ epochId }`)();

  const titleSecondRow = (
    <>
      <Skeleton
        isLoaded={ !loading }
        fontFamily="heading"
        display="flex"
        minW={ 0 }
        columnGap={ 2 }
        fontWeight={ 100 }
      >
        <chakra.span flexShrink={ 0 }>Epoch status:</chakra.span>
        <Text color="green.600">Sealed</Text>
      </Skeleton>

      <NetworkExplorers
        type="block"
        pathParam={ epochId }
        ml={{
          base: config.UI.views.block.hiddenFields?.miner ? 0 : 3,
          lg: 'auto',
        }}
      />
    </>
  );

  return (
    <>
      <PageTitle
        title={ title }
        backLink={ backLink }
        contentAfter={ <div/> }
        secondRow={ titleSecondRow }
        isLoading={ loading }
      />
      { loading ? (
        <TabsSkeleton tabs={ tabs }/>
      ) : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
          stickyEnabled={ undefined }
        />
      ) }
    </>
  );
};

export default EpochPageContent;
