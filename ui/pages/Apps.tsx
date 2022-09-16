import AppList from '~/ui/apps/AppList';
import { TEMPORARY_DEMO_APPS } from '~/ui/apps/contants';
import FilterInput from '~/ui/apps/FilterInput';
import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';

const defaultDisplayedApps = [ ...TEMPORARY_DEMO_APPS ]
  .sort((a, b) => a.title.localeCompare(b.title));

const Apps = () => {
  const [ displayedApps, setDisplayedApps ] = useState(defaultDisplayedApps);

  const filterApps = (q: string) => {
    const apps = displayedApps
      .filter(app => app.title.toLowerCase().includes(q.toLowerCase()));

    setDisplayedApps(apps);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterApps = useCallback(debounce(q => filterApps(q), 500), []);

  return (
    <>
      <FilterInput onChange={ debounceFilterApps }/>
      <AppList apps={ displayedApps }/>
    </>
  );
};

export default Apps;
