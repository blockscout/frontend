// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SettingsControlVariant } from '../types';

import { BECH_32_SEPARATOR } from 'src/slices/address/utils/bech32';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import type { SwitchProps } from 'src/toolkit/chakra/switch';
import { Switch } from 'src/toolkit/chakra/switch';

import { useSettingsContext } from '../context';
import SettingsSectionTitle from '../parts/SettingsSectionTitle';

interface Props extends Omit<SwitchProps, 'variant'> {
  variant: SettingsControlVariant;
}

const SettingsAddressFormat = ({ variant, ...rest }: Props) => {
  const settingsContext = useSettingsContext();
  const isMobile = useIsMobile();

  if (!settingsContext || config.slices.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;
  const showSectionTitle = !isMobile || variant === 'popover';

  return (
    <div>
      { showSectionTitle && <SettingsSectionTitle variant={ variant } title="Address format"/> }
      <Switch
        id="address-format"
        defaultChecked={ addressFormat === 'bech32' }
        onChange={ toggleAddressFormat }
        direction="rtl"
        justifyContent="space-between"
        w="100%"
        minH="34px"
        overflow="hidden"
        { ...rest }
      >
        Show { config.slices.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
      </Switch>
    </div>
  );
};

export default React.memo(SettingsAddressFormat);
