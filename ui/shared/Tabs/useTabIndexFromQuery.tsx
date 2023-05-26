import { useRouter } from 'next/router';

import type { RoutedTab } from './types';

import getQueryParamString from 'lib/router/getQueryParamString';

export default function useTabIndexFromQuery(tabs: Array<RoutedTab>) {
  const router = useRouter();
  const tabFromQuery = getQueryParamString(router.query.tab);

  if (!tabFromQuery) {
    return 0;
  }

  const tabIndex = tabs.findIndex(({ id, subTabs }) => id === tabFromQuery || subTabs?.some((id) => id === tabFromQuery));

  if (tabIndex < 0) {
    return 0;
  }

  return tabIndex;
}
