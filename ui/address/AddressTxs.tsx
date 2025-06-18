import { useRouter } from 'next/router';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import TxsWithAPISorting from 'ui/txs/TxsWithAPISorting';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';
import useAddressTxsQuery from './useAddressTxsQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();
  const isMobile = useIsMobile();
  const currentAddress = getQueryParamString(router.query.hash);

  const { query, filterValue, initialFilterValue, onFilterChange, sort, setSort } = useAddressTxsQuery({
    addressHash: currentAddress,
    enabled: isQueryEnabled,
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const filter = (
    <AddressTxsFilter
      initialValue={ initialFilterValue }
      onFilterChange={ onFilterChange }
      hasActiveFilter={ Boolean(filterValue) }
      isLoading={ query.pagination.isLoading }
    />
  );

  const csvExportLink = (
    <AddressCsvExportLink
      address={ currentAddress }
      params={{ type: 'transactions', filterType: 'address', filterValue }}
      ml="auto"
      isLoading={ query.pagination.isLoading }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar>
          { filter }
          { currentAddress && csvExportLink }
          <Pagination { ...query.pagination } ml={ 8 }/>
        </ActionBar>
      ) }
      <TxsWithAPISorting
        filter={ filter }
        filterValue={ filterValue }
        query={ query }
        currentAddress={ typeof currentAddress === 'string' ? currentAddress : undefined }
        enableTimeIncrement
        socketType="address_txs"
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        sorting={ sort }
        setSort={ setSort }
      />
    </>
  );
};

export default AddressTxs;
