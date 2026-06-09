// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { BECH_32_SEPARATOR } from 'src/slices/address/utils/bech32';

import config from 'src/config';

import { Switch } from 'src/toolkit/chakra/switch';

import { useSettingsContext } from './context';

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.slices.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  return (
    <Switch
      id="address-format"
      defaultChecked={ addressFormat === 'bech32' }
      onChange={ toggleAddressFormat }
      mt={ 4 }
      direction="rtl"
      justifyContent="space-between"
      w="100%"
    >
      Show { config.slices.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
