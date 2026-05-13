import type { ConsentDetails } from './lib-types';
import type { ServiceId, UsercentricsConsentResult } from './types';

import { SERVICES, SERVICES_NAMES } from './services';

export default function getConsentStatus(details: ConsentDetails): UsercentricsConsentResult | undefined {
  try {
    // eslint-disable-next-line no-console
    console.log('__>__ getConsentStatus:', {
      details,
      SERVICES_NAMES,
    });

    const result = Object.values(details?.services || {})
      .map(({ name, consent }) => {
        return {
          name,
          given: consent?.given ?? false,
        };
      })
      .filter(({ name }) => name && SERVICES_NAMES.includes(name))
      .reduce((result, item) => {
        const id = Object.keys(SERVICES).find((key) => SERVICES[key as ServiceId].name === item.name) as keyof typeof SERVICES | undefined;
        if (id) {
          result[id] = item.given;
        }
        return result;
      }, {} as UsercentricsConsentResult);

    return result;
  } catch {
    return;
  }
}
