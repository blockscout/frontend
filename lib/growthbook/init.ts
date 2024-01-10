import { GrowthBook } from '@growthbook/growthbook-react';
import mixpanel from 'mixpanel-browser';

import config from 'configs/app';

export const growthBook = (() => {
  const feature = config.features.growthBook;

  if (!feature.isEnabled) {
    return;
  }

  return new GrowthBook({
    apiHost: 'https://cdn.growthbook.io',
    clientKey: feature.clientKey,
    enableDevMode: config.app.isDev,
    trackingCallback: (experiment, result) => {
      mixpanel.track('$experiment_started', {
        'Experiment name': experiment.key,
        'Variant name': result.variationId,
        $source: 'growthbook',
      });
    },
  });
})();
