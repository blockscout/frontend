import React from 'react';

import config from 'configs/app';

export default function useUsercentricsConsent(): boolean {
  const [ hasConsent, setHasConsent ] = React.useState<boolean>(!config.features.usercentrics.isEnabled);

  React.useEffect(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }

    const checkConsent = () => {
      if (window.UC_UI?.isInitialized()) {
        setHasConsent(window.UC_UI.areAllConsentsAccepted());
      }
    };

    // UC_UI fires 'ucEvent' on initial load (stored consent) and on every consent change
    window.addEventListener('ucEvent', checkConsent);

    // Handle the case where UC already loaded before this effect ran
    checkConsent();

    return () => window.removeEventListener('ucEvent', checkConsent);
  }, []);

  return hasConsent;
}
