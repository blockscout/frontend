import React from 'react';
import ReCaptcha from 'react-google-recaptcha';
import { useFormContext } from 'react-hook-form';

import config from 'configs/app';

interface Props {
  disabledFeatureMessage?: JSX.Element;
}

const FormFieldReCaptcha = ({ disabledFeatureMessage }: Props) => {

  const { register, unregister, trigger, clearErrors, setValue, resetField, setError, formState } = useFormContext();
  const ref = React.useRef<ReCaptcha>(null);

  React.useEffect(() => {
    register('reCaptcha', { required: true, shouldUnregister: true });

    return () => {
      unregister('reCaptcha');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    ref.current?.reset();
    trigger('reCaptcha');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formState.submitCount ]);

  const handleReCaptchaChange = React.useCallback((token: string | null) => {
    if (token) {
      clearErrors('reCaptcha');
      setValue('reCaptcha', token, { shouldValidate: true });
    }
  }, [ clearErrors, setValue ]);

  const handleReCaptchaExpire = React.useCallback(() => {
    resetField('reCaptcha');
    setError('reCaptcha', { type: 'required' });
  }, [ resetField, setError ]);

  if (!config.services.reCaptcha.siteKey) {
    return disabledFeatureMessage ?? null;
  }

  return (
    <ReCaptcha
      className="recaptcha"
      ref={ ref }
      sitekey={ config.services.reCaptcha.siteKey }
      onChange={ handleReCaptchaChange }
      onExpired={ handleReCaptchaExpire }
    />
  );
};

export default FormFieldReCaptcha;
