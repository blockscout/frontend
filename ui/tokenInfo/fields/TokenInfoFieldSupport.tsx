import React from 'react';

import type { Fields } from '../types';

import type { FieldProps } from 'toolkit/chakra/field';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import { validator as emailValidator } from 'ui/shared/forms/validators/email';
import { urlValidator } from 'ui/shared/forms/validators/url';

interface Props {
  readOnly?: boolean;
  size?: FieldProps['size'];
}

const TokenInfoFieldSupport = (props: Props) => {
  const validate = React.useCallback((newValue: string | undefined) => {
    if (typeof newValue !== 'string') {
      return true;
    }

    const urlValidationResult = urlValidator(newValue);
    const emailValidationResult = emailValidator(newValue);

    if (urlValidationResult === true || emailValidationResult === true) {
      return true;
    }

    return 'Invalid format';
  }, []);

  return (
    <FormFieldText<Fields, 'support'>
      name="support"
      placeholder="Support URL or email"
      rules={{ validate }}
      { ...props }
    />
  );
};

export default React.memo(TokenInfoFieldSupport);
