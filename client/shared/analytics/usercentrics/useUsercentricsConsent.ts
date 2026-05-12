import React from 'react';

import type { UsercentricsConsent } from './types';

export default function useUsercentricsConsent(): UsercentricsConsent | undefined {
  const [ consentStatus ] = React.useState<UsercentricsConsent | undefined>({
    mixpanel: true,
    googleAnalytics: true,
    rollbar: true,
    growthBook: true,
  });

  // React.useEffect(() => {
  //   if (!config.features.usercentrics.isEnabled) {
  //     return;
  //   }

  //   const updateConsent = async() => {
  //     setConsentStatus(await getConsentStatus());
  //   };

  //   // Get initial consent state
  //   updateConsent();

  //   // Re-check on every consent change and on CMP initialization
  //   window.addEventListener('UC_CONSENT', updateConsent);
  //   window.addEventListener('UC_UI_INITIALIZED', updateConsent);

  //   return () => {
  //     window.removeEventListener('UC_CONSENT', updateConsent);
  //     window.removeEventListener('UC_UI_INITIALIZED', updateConsent);
  //   };
  // }, []);

  // // eslint-disable-next-line no-console
  // console.log('__>__ consentStatus:', consentStatus);

  return consentStatus;
}
