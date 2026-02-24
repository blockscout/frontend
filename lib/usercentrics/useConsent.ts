import React from 'react';

import config from 'configs/app';

async function checkMarketingConsent(): Promise<boolean> {
  if (!window.__ucCmp) {
    return false;
  }
  const details = await window.__ucCmp.getConsentDetails();
  return details.categories?.marketing?.state === 'ALL_ACCEPTED';
}

export default function useUsercentricsMarketingConsent(): boolean {
  const [ hasConsent, setHasConsent ] = React.useState<boolean>(!config.features.usercentrics.isEnabled);

  React.useEffect(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }

    const updateConsent = async() => {
      setHasConsent(await checkMarketingConsent());
    };

    // Get initial consent state
    updateConsent();

    // Re-check on every consent change and on CMP initialization
    window.addEventListener('UC_CONSENT', updateConsent);
    window.addEventListener('UC_UI_INITIALIZED', updateConsent);

    return () => {
      window.removeEventListener('UC_CONSENT', updateConsent);
      window.removeEventListener('UC_UI_INITIALIZED', updateConsent);
    };
  }, []);

  return hasConsent;
}
