import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import config from 'configs/app';

interface Props {
  disabledFeatureMessage?: React.ReactNode;
}

const ReCaptchaInvisible = ({ disabledFeatureMessage }: Props, ref: React.Ref<ReCaptcha>) => {
  if (!config.services.reCaptchaV2.siteKey) {
    return disabledFeatureMessage ?? null;
  }

  return (
    <ReCaptcha
      ref={ ref }
      sitekey={ config.services.reCaptchaV2.siteKey }
      size="invisible"
    />
  );
};

export default React.forwardRef(ReCaptchaInvisible);
