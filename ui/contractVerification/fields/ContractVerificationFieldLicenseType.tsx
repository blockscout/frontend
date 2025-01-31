import React from 'react';

import type { FormFields } from '../types';

import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const options = CONTRACT_LICENSES.map(({ label, title, type }) => ({ label: `${ title } (${ label })`, value: type }));

const ContractVerificationFieldLicenseType = () => {

  return (
    <ContractVerificationFormRow>
      <FormFieldFancySelect<FormFields, 'license_type'>
        name="license_type"
        placeholder="Contract license"
        options={ options }
      />
      <span>
        For best practices, all contract source code holders, publishers and authors are encouraged to also
        specify the accompanying license for their verified contract source code provided.
      </span>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldLicenseType);
