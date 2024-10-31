import { FormLabel, FormControl, Switch } from '@chakra-ui/react';
import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';

const SettingsAddressFormat = () => {
  const settingsContext = useSettingsContext();

  if (!settingsContext) {
    return null;
  }

  const { addressFormat, toggleAddressFormat } = settingsContext;

  return (
    <FormControl display="flex" alignItems="center" columnGap={ 2 } mt={ 4 }>
      <FormLabel htmlFor="address-format" m="0" fontWeight={ 400 } fontSize="sm" lineHeight={ 5 }>
        Show Zil1 format
      </FormLabel>
      <Switch id="address-format" defaultChecked={ addressFormat === 'bech32' } onChange={ toggleAddressFormat }/>
    </FormControl>
  );
};

export default React.memo(SettingsAddressFormat);
