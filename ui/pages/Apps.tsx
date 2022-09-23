import debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';

import type { AppItemOverview } from 'types/client/apps';

import { TEMPORARY_DEMO_APPS } from 'data/apps';
import AppList from 'ui/apps/AppList';
import AppModal from 'ui/apps/AppModal';
import FilterInput from 'ui/shared/FilterInput';

const defaultDisplayedApps = [ ...TEMPORARY_DEMO_APPS ]
  .sort((a, b) => a.title.localeCompare(b.title));

const Apps = () => {
  const [ displayedApps, setDisplayedApps ] = useState<Array<AppItemOverview>>(defaultDisplayedApps);
  const [ displayedAppId, setDisplayedAppId ] = useState<string | null>('component');

  const filterApps = (q: string) => {
    const apps = displayedApps
      .filter(app => app.title.toLowerCase().includes(q.toLowerCase()));

    setDisplayedApps(apps);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterApps = useCallback(debounce(q => filterApps(q), 500), []);

  const clearDisplayedAppId = useCallback(() => setDisplayedAppId(null), []);

  return (
    <>
      <FilterInput onChange={ debounceFilterApps } marginBottom={{ base: '4', lg: '6' }} placeholder="Find app"/>
      <AppList apps={ displayedApps }/>
      <AppModal
        id={ displayedAppId }
        onClose={ clearDisplayedAppId }
      />
    </>
  );
};

export default Apps;
