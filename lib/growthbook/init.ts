import { GrowthBook } from '@growthbook/growthbook-react';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel';

export interface GrowthBookFeatures {
  test_value: string;
}

export const growthBook = (() => {
  const feature = config.features.growthBook;

  if (!feature.isEnabled) {
    return;
  }

  return new GrowthBook<GrowthBookFeatures>({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: feature.clientKey,
    enableDevMode: config.app.isDev,
    attributes: {
      id: mixpanel.getUuid(),
      chain_id: config.chain.id,
    },
    trackingCallback: (experiment, result) => {
      mixpanel.logEvent(mixpanel.EventTypes.EXPERIMENT_STARTED, {
        'Experiment name': experiment.key,
        'Variant name': result.value,
        Source: 'growthbook',
      });
    },
  });
})();
