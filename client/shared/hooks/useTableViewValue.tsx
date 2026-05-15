// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as mixpanel from 'client/shared/analytics/mixpanel';
import useFeatureValue from 'client/shared/feature-flags/useFeatureValue';
import * as cookies from 'client/shared/storage/cookies';

export default function useTableViewValue() {
  const cookieValue = cookies.get(cookies.NAMES.TABLE_VIEW_ON_MOBILE);
  const [ value, setValue ] = React.useState<boolean | undefined>(cookieValue ? cookieValue === 'true' : undefined);
  const { value: featureFlag, isLoading: isFeatureLoading } = useFeatureValue('txns_view_exp', 'list_view');

  const onToggle = React.useCallback(() => {
    setValue((prev) => {
      const nextValue = !prev;
      cookies.set(cookies.NAMES.TABLE_VIEW_ON_MOBILE, nextValue ? 'true' : 'false');
      mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, {
        Type: 'Txn view switch',
        Info: nextValue ? 'Table view' : 'List view',
        Source: 'Address page',
      });
      return nextValue;
    });
  }, []);

  React.useEffect(() => {
    if (!isFeatureLoading) {
      setValue((prev) => {
        if (prev === undefined) {
          return featureFlag === 'table_view';
        }
        return prev;
      });
    }
  }, [ featureFlag, isFeatureLoading ]);

  return React.useMemo(() => {
    if (value !== undefined) {
      return {
        value,
        isLoading: false,
        onToggle,
      };
    }

    return { value: featureFlag === 'table_view', isLoading: isFeatureLoading, onToggle };
  }, [ featureFlag, isFeatureLoading, onToggle, value ]);
}
