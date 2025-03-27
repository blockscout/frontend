import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import config from 'configs/app';

interface Props {
  disabledFeatureMessage?: React.ReactNode;
}

const ReCaptchaInvisible = ({ disabledFeatureMessage }: Props, ref: React.Ref<ReCaptcha>) => {
  const [ attempt, setAttempt ] = React.useState(0);

  const handleChange = React.useCallback(() => {
    setAttempt(attempt + 1);
  }, [ attempt ]);

  if (!config.services.reCaptchaV2.siteKey) {
    return disabledFeatureMessage ?? null;
  }

  return (
    <ReCaptcha
      ref={ ref }
      key={ attempt }
      sitekey={ config.services.reCaptchaV2.siteKey }
      size="invisible"
      onChange={ handleChange }
    />
  );
};

export default React.forwardRef(ReCaptchaInvisible);
