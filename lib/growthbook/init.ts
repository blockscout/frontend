import { GrowthBook } from '@growthbook/growthbook-react';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel';

export const growthBook = (() => {
  const feature = config.features.growthBook;

  if (!feature.isEnabled) {
    return;
  }

  return new GrowthBook({
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
