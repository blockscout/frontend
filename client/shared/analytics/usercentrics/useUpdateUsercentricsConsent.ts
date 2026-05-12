import React from 'react';

import config from 'configs/app';
import { STORAGE_KEY } from 'configs/app/features/usercentrics';

import getConsentStatus from './get-consent-status';

export default function useUpdateUsercentricsConsent() {
  React.useEffect(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }

    const updateConsent = async() => {
      try {
        const consent = await getConsentStatus();
        // eslint-disable-next-line no-console
        console.log('__>__ updateConsent:', consent);
        if (consent) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
          window.location.reload();
        }
      } catch (error) {}
    };

    updateConsent();

    window.addEventListener('UC_CONSENT', updateConsent);

    return () => {
      window.removeEventListener('UC_CONSENT', updateConsent);
    };
  }, []);
}
