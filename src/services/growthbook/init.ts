// SPDX-License-Identifier: LicenseRef-Blockscout

import { GrowthBook } from '@growthbook/growthbook-react';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';

import { STORAGE_KEY, STORAGE_LIMIT } from './consts';

export interface GrowthBookFeatures {
  test_value: string;
  txns_view_exp: 'table_view' | 'list_view';
}

export const initGrowthBook = (uuid: string) => {
  if (!config.services.growthBook.clientKey) {
    return;
  }

  return new GrowthBook<GrowthBookFeatures>({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: config.services.growthBook.clientKey,
    enableDevMode: config.app.isDev,
    attributes: {
      id: uuid,
      chain_id: config.chain.id,
    },
    trackingCallback: (experiment, result) => {
      if (isExperimentStarted(experiment.key)) {
        return;
      }

      saveExperimentInStorage(experiment.key);
      mixpanel.logEvent(mixpanel.EventTypes.EXPERIMENT_STARTED, {
        'Experiment name': experiment.key,
        'Variant name': result.value,
        Source: 'growthbook',
      });
    },
  });
};

function getStorageValue(): Array<unknown> | undefined {
  const item = window.localStorage.getItem(STORAGE_KEY);
  if (!item) {
    return;
  }

  try {
    const parsedValue = JSON.parse(item);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }
  } catch {
    return;
  }
}

function isExperimentStarted(key: string): boolean {
  const items = getStorageValue() ?? [];
  return items.some((item) => item === key);
}

function saveExperimentInStorage(key: string) {
  const items = getStorageValue() ?? [];
  const newItems = [ key, ...items ].slice(0, STORAGE_LIMIT);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  } catch (error) {}
}
