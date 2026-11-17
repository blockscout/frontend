// SPDX-License-Identifier: LicenseRef-Blockscout

import { SEARCH_RESULT_TYPES } from './result-types';
import type { SearchResultFutureBlock, SearchResultItem } from 'src/slices/search/types/client';

import type { ResourcePayload } from 'src/api/resources';

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';

import { BLOCK_HEIGHT } from 'src/toolkit/utils/regexp';

type RedirectCheck = ResourcePayload<'core:search_check_redirect'>;

const isNameServicesEnabled = (): boolean => {
  const feature = config.features.nameServices;
  return feature.isEnabled && feature.ens.isEnabled;
};

const getFeatureGatedRedirectRoute = (type: RedirectCheck['type'], parameter: string): Route | undefined => {
  switch (type) {
    case 'user_operation':
      return config.features.userOps.isEnabled ? { pathname: '/op/[hash]', query: { hash: parameter } } : undefined;
    case 'blob':
      return config.features.dataAvailability.isEnabled ? { pathname: '/blobs/[hash]', query: { hash: parameter } } : undefined;
    case 'ens_domain':
      return isNameServicesEnabled() ? { pathname: '/name-services/domains/[name]', query: { name: parameter } } : undefined;
    default:
      return undefined;
  }
};

export const getRedirectRoute = (data: RedirectCheck | undefined): Route | undefined => {
  if (!data?.redirect || !data.parameter) {
    return undefined;
  }

  switch (data.type) {
    case 'block':
      return { pathname: '/block/[height_or_hash]', query: { height_or_hash: data.parameter } };
    case 'address':
      return { pathname: '/address/[hash]', query: { hash: data.parameter } };
    case 'transaction':
      return { pathname: '/tx/[hash]', query: { hash: data.parameter } };
    default:
      return getFeatureGatedRedirectRoute(data.type, data.parameter);
  }
};

const isResultTypeEnabled = (type: SearchResultItem['type']): boolean => {
  switch (type) {
    case 'user_operation':
      return config.features.userOps.isEnabled;
    case 'blob':
      return config.features.dataAvailability.isEnabled;
    case 'ens_domain':
      return isNameServicesEnabled();
    case 'tac_operation':
      return config.features.tac.isEnabled;
    default:
      return true;
  }
};

export const isDisplayableResultItem = (item: SearchResultItem): boolean =>
  SEARCH_RESULT_TYPES.includes(item.type) && isResultTypeEnabled(item.type);

interface FutureBlockParams {
  readonly searchTerm: string;
  readonly items: Array<SearchResultItem>;
  readonly isFirstPage: boolean;
  readonly isLastPage: boolean;
  readonly isLoading: boolean;
}

export const buildFutureBlockItem = ({ searchTerm, items, isFirstPage, isLastPage, isLoading }: FutureBlockParams): SearchResultFutureBlock | undefined => {
  const isSingleFullPage = !isLoading && isFirstPage && isLastPage;
  const hasNonBlockResults = items.length > 0 && !items.some(({ type }) => type === 'block');

  if (!isSingleFullPage || !hasNonBlockResults || !BLOCK_HEIGHT.test(searchTerm)) {
    return undefined;
  }

  return {
    type: 'block',
    block_type: 'block',
    block_number: searchTerm,
    block_hash: '',
    timestamp: undefined,
  };
};
