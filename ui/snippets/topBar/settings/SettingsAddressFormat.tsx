// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { BECH_32_SEPARATOR } from 'client/slices/address/utils/bech32';

import config from 'configs/app';
import { useSettingsContext } from 'lib/contexts/settings';
import { Switch } from 'toolkit/chakra/switch';

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
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
      Show { config.UI.views.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
