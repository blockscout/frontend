import React from 'react';
import ReCaptcha from 'react-google-recaptcha';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import appConfig from 'configs/app/config';

interface Props {
  formApi: UseFormReturn<FormFields>;
}

const CsvExportFormReCaptcha = ({ formApi }: Props) => {

  const ref = React.useRef<ReCaptcha>(null);

  React.useEffect(() => {
    formApi.register('reCaptcha', { required: true, shouldUnregister: true });

    return () => {
      formApi.unregister('reCaptcha');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    ref.current?.reset();
    formApi.trigger('reCaptcha');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formApi.formState.submitCount ]);

  const handleReCaptchaChange = React.useCallback((token: string | null) => {
    if (token) {
      formApi.clearErrors('reCaptcha');
      formApi.setValue('reCaptcha', token, { shouldValidate: true });
    }
  }, [ formApi ]);

  const handleReCaptchaExpire = React.useCallback(() => {
    formApi.resetField('reCaptcha');
    formApi.setError('reCaptcha', { type: 'required' });
  }, [ formApi ]);

  return (
    <ReCaptcha
      ref={ ref }
      sitekey={ appConfig.reCaptcha.siteKey }
      onChange={ handleReCaptchaChange }
      onExpired={ handleReCaptchaExpire }
    />
  );
};

export default CsvExportFormReCaptcha;
