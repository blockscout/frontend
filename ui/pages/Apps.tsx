import { Icon, Link } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

import type { AppItemOverview } from 'types/client/apps';

import marketplaceApps from 'data/marketplaceApps.json';
import PlusIcon from 'icons/plus.svg';
import useNetwork from 'lib/hooks/useNetwork';
import AppList from 'ui/apps/AppList';
import FilterInput from 'ui/shared/FilterInput';

import { AppListSkeleton } from '../apps/AppListSkeleton';

const Apps = () => {
  const selectedNetwork = useNetwork();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ defaultAppList, setDefaultAppList ] = useState<Array<AppItemOverview>>();
  const [ displayedApps, setDisplayedApps ] = useState<Array<AppItemOverview>>([]);
  const [ displayedAppId, setDisplayedAppId ] = useState<string | null>(null);

  const showAppInfo = useCallback((id: string) => {
    setDisplayedAppId(id);
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterApps = useCallback(debounce(q => filterApps(q), 500), [ defaultAppList ]);
  const clearDisplayedAppId = useCallback(() => setDisplayedAppId(null), []);

  function filterApps(q: string) {
    const apps = defaultAppList
      ?.filter(app => app.title.toLowerCase().includes(q.toLowerCase()));

    setDisplayedApps(apps || []);
  }

  useEffect(() => {
    if (!selectedNetwork) {
      return;
    }

    const defaultDisplayedApps = [ ...marketplaceApps ]
      .filter(item => item.chainId === selectedNetwork?.chainId)
      .sort((a, b) => a.title.localeCompare(b.title));

    setDefaultAppList(defaultDisplayedApps);
    setDisplayedApps(defaultDisplayedApps);
    setIsLoading(false);
  }, [ selectedNetwork ]);

  return (
    <>
      <FilterInput onChange={ debounceFilterApps } marginBottom={{ base: '4', lg: '6' }} placeholder="Find app"/>

      { isLoading ? <AppListSkeleton/> : (
        <AppList
          apps={ displayedApps }
          onAppClick={ showAppInfo }
          displayedAppId={ displayedAppId }
          onModalClose={ clearDisplayedAppId }
        />
      ) }

      { process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM && (
        <Link
          fontWeight="bold"
          display="inline-flex"
          alignItems="baseline"
          marginTop={{ base: 8, sm: 16 }}
          href={ process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM }
          isExternal
        >
          <Icon
            as={ PlusIcon }
            w={ 3 }
            h={ 3 }
            mr={ 2 }
          />

            Submit an App
        </Link>
      ) }
    </>
  );
};

export default Apps;
