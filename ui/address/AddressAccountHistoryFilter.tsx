import React from 'react';

import type { NovesHistoryFilterValue } from 'types/api/noves';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import PopoverFilterRadio from 'ui/shared/filters/PopoverFilterRadio';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'received', label: 'Received from' },
  { value: 'sent', label: 'Sent to' },
];

interface Props {
  hasActiveFilter: boolean;
  defaultFilter: NovesHistoryFilterValue;
  onFilterChange: (nextValue: string | Array<string>) => void;
  isLoading?: boolean;
}

const AccountHistoryFilter = ({ onFilterChange, defaultFilter, hasActiveFilter, isLoading }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  return (
    <PopoverFilterRadio
      name="account_history_filter"
      options={ OPTIONS }
      onChange={ onFilterChange }
      hasActiveFilter={ hasActiveFilter }
      isLoading={ isInitialLoading }
      defaultValue={ defaultFilter || OPTIONS[0].value }
    />
  );
};

export default React.memo(AccountHistoryFilter);
