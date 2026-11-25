// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
import React from 'react';

import type { ConsentDetails } from './lib-types';
import type { UsercentricsConsentResult } from './types';

import config from 'src/config';

import { STORAGE_KEY } from './consts';
import getConsentStatus from './get-consent-status';
import { CONSENT_RESULT_ALL_ACCEPTED } from './services';

export default function useUpdateUsercentricsConsent() {
  React.useEffect(() => {
    if (!config.services.usercentrics) {
      return;
    }

    const updateConsent = (event: Event) => {

      const details = 'detail' in event && typeof event.detail === 'object' && event.detail !== null ? event.detail as ConsentDetails : undefined;

      if (!details || !details.consent.fromUserAction) {
        return;
      }

      try {
        const consent = getConsentStatus(details);
        if (consent) {
          const currentConsent = window.localStorage.getItem(STORAGE_KEY);
          const parsedConsent = currentConsent ? JSON.parse(currentConsent) as UsercentricsConsentResult : undefined;
          if (!isEqual(parsedConsent, consent)) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
            // With nothing stored the page already runs with everything accepted (./config.ts), so accepting all needs no reload
            if (!isEqual(parsedConsent ?? CONSENT_RESULT_ALL_ACCEPTED, consent)) {
              window.location.reload();
            }
          }
        }
      } catch (error) {}
    };

    window.addEventListener('UC_CONSENT', updateConsent);

    return () => {
      window.removeEventListener('UC_CONSENT', updateConsent);
    };
  }, []);
}
