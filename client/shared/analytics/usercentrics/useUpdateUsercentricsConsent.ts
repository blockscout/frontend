import React from 'react';

import type { ConsentDetails } from './lib-types';

import config from 'configs/app';
import { STORAGE_KEY } from 'configs/app/features/usercentrics';

import getConsentStatus from './get-consent-status';

export default function useUpdateUsercentricsConsent() {
  React.useEffect(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }

    const updateConsent = (event: Event) => {

      const details = 'detail' in event && typeof event.detail === 'object' && event.detail !== null ? event.detail as ConsentDetails : undefined;

      if (!details) {
        return;
      }

      try {
        const consent = getConsentStatus(details);
        // eslint-disable-next-line no-console
        console.log('__>__ updateConsent:', consent);
        if (consent) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
          window.location.reload();
        }
      } catch (error) {}
    };

    window.addEventListener('UC_CONSENT', updateConsent);

    return () => {
      window.removeEventListener('UC_CONSENT', updateConsent);
    };
  }, []);
}
