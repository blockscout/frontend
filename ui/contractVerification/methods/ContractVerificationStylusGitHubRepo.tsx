import React from 'react';

import type { FormFields } from '../types';

import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';

import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';

const ContractVerificationStylusGitHubRepo = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Stylus (GitHub repository) ">
      <ContractVerificationFieldCompiler isStylus/>

      <ContractVerificationFormRow>
        <FormFieldUrl<FormFields>
          name="repository_url"
          placeholder="GitHub repository URL"
          isRequired
          size={{ base: 'md', lg: 'lg' }}
        />
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="commit_hash"
          placeholder="Commit hash"
          isRequired
          size={{ base: 'md', lg: 'lg' }}
        />
      </ContractVerificationFormRow>

      <ContractVerificationFormRow>
        <FormFieldText<FormFields>
          name="path_prefix"
          placeholder="Path prefix"
          size={{ base: 'md', lg: 'lg' }}
        />
        <span>
          The crate should be located in the root directory. If it is not the case, please specify the relative path from
          the root to the crate directory.
        </span>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStylusGitHubRepo);
