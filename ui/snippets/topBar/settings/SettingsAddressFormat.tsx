import React from 'react';

import config from 'configs/app';
import { BECH_32_SEPARATOR } from 'lib/address/bech32';
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
      onChange={ toggleAddressFormat } mt={ 4 }
      size="md"
      flexDirection="row-reverse"
      justifyContent="space-between"
      w="100%"
      gap={ 2 }
      fontWeight="400"
      color="text.secondary"
    >
      Show { config.UI.views.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
    </Switch>
  );
};

export default React.memo(SettingsAddressFormat);
