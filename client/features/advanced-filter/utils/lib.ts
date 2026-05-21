// SPDX-License-Identifier: LicenseRef-Blockscout

import { castArray } from 'es-toolkit/compat';

import type { AdvancedFilterAge, AdvancedFilterParams } from '../types/api';
import type { ClusterChainConfig } from 'client/features/multichain/types/client';
import { getTokenTypes } from 'client/slices/token/utils/token-types';

import dayjs from 'lib/date/dayjs';
import { HOUR, DAY, MONTH } from 'toolkit/utils/consts';

import { FILTER_PARAM_NAMES } from './consts';

export const getAdvancedFilterTypes = (chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'], withAll = false) => {
  return [
    ...(withAll ? [ {
      id: 'all',
      name: 'All',
    } ] : []),
    {
      id: 'coin_transfer',
      name: 'Coin Transfer',
    },
    ...Object.entries(getTokenTypes(false, chainConfig))
      .map(([ id, name ]) => ({
        id,
        name: `${ name } Transfer`,
      })),
    {
      id: 'contract_creation',
      name: 'Contract Creation',
    },
    {
      id: 'contract_interaction',
      name: 'Contract Interaction',
    },
  ];
};

export function getDurationFromAge(age: AdvancedFilterAge) {
  switch (age) {
    case '1h':
      return HOUR;
    case '24h':
      return DAY;
    case '7d':
      return DAY * 7;
    case '1m':
      return MONTH;
    case '3m':
      return MONTH * 3;
    case '6m':
      return MONTH * 6;
  }
}

function getFilterValueWithNames(values?: Array<string>, names?: Array<string>) {
  if (!names) {
    return castArray(values).join(', ');
  } else if (Array.isArray(names) && Array.isArray(values)) {
    return names.map((n, i) => n ? n : values[i]).join(', ');
  } else {
    return names;
  }
}

export function getFilterTags(filters: AdvancedFilterParams, chainConfig?: ClusterChainConfig['app_config']) {
  const filtersToShow = { ...filters };
  if (filtersToShow.age) {
    filtersToShow.age_from = undefined;
    filtersToShow.age_to = undefined;
  }

  return (Object.entries(filtersToShow) as Array<[keyof AdvancedFilterParams, AdvancedFilterParams[keyof AdvancedFilterParams]]>).map(([ key, value ]) => {
    if (!value) {
      return;
    }
    const name = FILTER_PARAM_NAMES[key as keyof AdvancedFilterParams];
    if (!name) {
      return;
    }
    let valueStr;
    switch (key) {
      case 'methods': {
        valueStr = getFilterValueWithNames(filtersToShow.methods, filtersToShow.methods_names);
        break;
      }
      case 'transaction_types': {
        const advancedFilterTypes = getAdvancedFilterTypes(chainConfig);
        valueStr = castArray(value).map(i => advancedFilterTypes.find(t => t.id === i)?.name).filter(Boolean).join(', ');
        break;
      }
      case 'token_contract_address_hashes_to_exclude': {
        valueStr = getFilterValueWithNames(filtersToShow.token_contract_address_hashes_to_exclude, filtersToShow.token_contract_symbols_to_exclude);
        break;
      }
      case 'token_contract_address_hashes_to_include': {
        valueStr = getFilterValueWithNames(filtersToShow.token_contract_address_hashes_to_include, filtersToShow.token_contract_symbols_to_include);
        break;
      }
      case 'age_from': {
        valueStr = dayjs(filtersToShow.age_from).format('YYYY-MM-DD');
        break;
      }
      case 'age_to': {
        valueStr = dayjs(filtersToShow.age_to).format('YYYY-MM-DD');
        break;
      }
      default: {
        valueStr = castArray(value).join(', ');
      }
    }
    if (!valueStr) {
      return;
    }

    return {
      key: key as keyof AdvancedFilterParams,
      name,
      value: valueStr,
    };
  }).filter(Boolean);
}
