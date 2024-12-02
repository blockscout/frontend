import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import config from 'configs/app';

export const RECAPTCHA_CONTAINER_ID = 'recaptcha-container';

const CONTAINER_PROPS = {
  element: RECAPTCHA_CONTAINER_ID,
  parameters: {
    badge: 'inline' as const,
  },
};

interface Props {
  children: React.ReactNode;
}

const ReCaptchaProvider = ({ children }: Props) => {
  if (!config.services.reCaptchaV3.siteKey) {
    return children;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={ config.services.reCaptchaV3.siteKey }
      container={ CONTAINER_PROPS }
    >
      { children }
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptchaProvider;
