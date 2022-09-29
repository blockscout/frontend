import React from 'react';

import type { AppItemOverview } from '../../types/client/apps';

import FilterInput from '../shared/FilterInput';
import AppList from './AppList';

type Props = {
  displayedApps: Array<AppItemOverview>;
  onFilterChange: (q: string) => void;
}

const CategoryTabContent = ({ onFilterChange, displayedApps }: Props) => {
  return (
    <>
      <FilterInput
        onChange={ onFilterChange }
        marginBottom={{ base: '4', lg: '6' }}
        placeholder="Find app"
      />

      <AppList
        apps={ displayedApps }
      />
    </>
  );
};

export default CategoryTabContent;
