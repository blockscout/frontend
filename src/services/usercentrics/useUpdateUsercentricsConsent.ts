// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
import React from 'react';

import type { ConsentDetails } from './lib-types';

import config from 'src/config';

import { STORAGE_KEY } from './consts';
import getConsentStatus from './get-consent-status';

function readStoredConsent(): unknown {
  const storedConsent = window.localStorage.getItem(STORAGE_KEY);
  if (!storedConsent) {
    return;
  }

  try {
    return JSON.parse(storedConsent);
  } catch {
    return;
  }
}

export default function useUpdateUsercentricsConsent() {
  React.useEffect(() => {
    const runningConsent = config.services.usercentrics?.consent;
    if (!runningConsent) {
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
          if (!isEqual(readStoredConsent(), consent)) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
          }
          if (!isEqual(runningConsent, consent)) {
            window.location.reload();
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
