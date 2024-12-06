import React from 'react';
import { GoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useFormContext } from 'react-hook-form';

const FormFieldReCaptcha = () => {

  const { register, unregister, clearErrors, setValue, formState } = useFormContext();

  React.useEffect(() => {
    register('reCaptcha', { required: true, shouldUnregister: true });

    return () => {
      unregister('reCaptcha');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReCaptchaChange = React.useCallback((token: string) => {
    clearErrors('reCaptcha');
    setValue('reCaptcha', token, { shouldValidate: true });
  }, [ clearErrors, setValue ]);

  return (
    <GoogleReCaptcha
      onVerify={ handleReCaptchaChange }
      refreshReCaptcha={ formState.submitCount ?? -1 }
    />
  );
};

export default FormFieldReCaptcha;
