import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

import type { AppItemOverview } from 'types/client/apps';

import { TEMPORARY_DEMO_APPS } from 'data/apps';
import type { RouteName } from 'lib/link/routes';
import CategoryTabContent from 'ui/apps/CategoryTabContent';
import { APP_CATEGORIES } from 'ui/apps/constants';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const defaultDisplayedApps = [ ...TEMPORARY_DEMO_APPS ]
  .sort((a, b) => a.title.localeCompare(b.title));

type Props = {
  activeRoute: RouteName;
  category: string | Array<string>;
}

const Apps = ({ activeRoute, category }: Props) => {
  const [ displayedApps, setDisplayedApps ] = useState<Array<AppItemOverview>>(defaultDisplayedApps);
  const [ filter, setFilter ] = useState<string>('');

  const filterApps = useCallback((q: string) => {
    const apps = defaultDisplayedApps
      .filter(app => app.title.toLowerCase().includes(q.toLowerCase()) && (
        category === 'all' || app.categories.some(c => c.id === category)
      ));

    setDisplayedApps(apps);
  }, [ category ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilterApps = useCallback(debounce(q => {
    setFilter(q);
  }, 500), []);

  useEffect(() => {
    filterApps(filter);
  }, [ category, filter, filterApps ]);

  return (
    <RoutedTabs
      tabs={
        [
          ...APP_CATEGORIES.map(category => ({
            routeName: category.routeName,
            title: category.name,
            component: (
              <CategoryTabContent
                displayedApps={ displayedApps }
                onFilterChange={ debounceFilterApps }
              />
            ),
          })),
        ]
      }

      defaultActiveTab={ activeRoute }
    />
  );
};

export default Apps;
