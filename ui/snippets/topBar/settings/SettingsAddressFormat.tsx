import { FormLabel, FormControl, Switch } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { BECH_32_SEPARATOR } from 'lib/address/bech32';
import { useSettingsContext } from 'lib/contexts/settings';

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  return (
    <FormControl display="flex" alignItems="center" columnGap={ 2 } mt={ 4 }>
      <FormLabel htmlFor="address-format" m="0" fontWeight={ 400 } fontSize="sm" lineHeight={ 5 }>
        Show { config.UI.views.address.hashFormat.bech32Prefix }{ BECH_32_SEPARATOR } format
      </FormLabel>
      <Switch id="address-format" defaultChecked={ addressFormat === 'bech32' } onChange={ toggleAddressFormat }/>
    </FormControl>
  );
};

export default React.memo(SettingsAddressFormat);
