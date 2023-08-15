import { Alert } from '@chakra-ui/react';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import config from 'configs/app';

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

  const feature = config.features.csvExport;

  if (!feature.isEnabled) {
    return (
      <Alert status="error">
        CSV export is not available at the moment since reCaptcha is not configured for this application.
        Please contact the service maintainer to make necessary changes in the service configuration.
      </Alert>
    );
  }

  return (
    <ReCaptcha
      className="recaptcha"
      ref={ ref }
      sitekey={ feature.reCaptcha.siteKey }
      onChange={ handleReCaptchaChange }
      onExpired={ handleReCaptchaExpire }
    />
  );
};

export default CsvExportFormReCaptcha;
