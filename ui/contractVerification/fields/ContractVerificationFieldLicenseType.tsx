import { useTranslation } from 'next-i18next';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import { CONTRACT_LICENSES } from 'lib/contracts/licenses';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

const options = CONTRACT_LICENSES.map(({ label, title, type }) => ({ label: `${ title } (${ label })`, value: type }));

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldLicenseType = () => {
  const { t } = useTranslation('common');

  const { formState, control } = useFormContext<FormFields>();
  const isMobile = useIsMobile();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'license_type'>}) => {
    const error = 'license_type' in formState.errors ? formState.errors.license_type : undefined;

    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder={ t('contract_verification_area.Contract_license') }
        isDisabled={ formState.isSubmitting }
        error={ error }
      />
    );
  }, [ formState.errors, formState.isSubmitting, isMobile, t ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="license_type"
        control={ control }
        render={ renderControl }
      />
      <span>
        { t('contract_verification_area.For_best_practices_all_contract_source_code_holders_publishers_') }
      </span>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldLicenseType);
