// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { PaginatedResourceName } from 'src/api/resources';

import type { ApiPaginatedQueryResult, Params } from 'src/shared/pagination/useApiPaginatedQuery';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';

export type InternalTxsResourceName = Extract<
  PaginatedResourceName,
  'core:internal_txs' | 'core:tx_internal_txs' | 'core:address_internal_txs' | 'core:block_internal_txs'
>;

interface ZeroValueControls {
  readonly isZeroValueShown: boolean;
  readonly onZeroValueToggle: (isShown: boolean) => void;
}

// `ApiPaginatedQueryResult` is a union (React Query's result states), which an interface cannot extend
export type InternalTxsPaginatedQueryResult<R extends InternalTxsResourceName> = ApiPaginatedQueryResult<R> & ZeroValueControls;

// The API includes zero-value items unless told otherwise, while the product default is to hide them,
// so the request always carries the flag; the URL only records the opt-in (`include_zero_value=true`).
export function useInternalTxsPaginatedQuery<R extends InternalTxsResourceName>(
  params: Params<R>,
): InternalTxsPaginatedQueryResult<R> {
  const { filters } = usePaginationParams(params.resourceName);
  const isZeroValueShown = String(filters.include_zero_value) === 'true';

  const query = useApiPaginatedQuery({
    ...params,
    queryParams: { ...params.queryParams, include_zero_value: isZeroValueShown },
  });

  const { onFilterChange } = query;
  const onZeroValueToggle = React.useCallback((isShown: boolean) => {
    onFilterChange({ ...filters, include_zero_value: isShown ? true : undefined });
  }, [ onFilterChange, filters ]);

  return React.useMemo(() => ({
    ...query,
    isZeroValueShown,
    onZeroValueToggle,
  }), [ query, isZeroValueShown, onZeroValueToggle ]);
}
