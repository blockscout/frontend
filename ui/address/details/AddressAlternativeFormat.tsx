import React from 'react';

import config from 'configs/app';
import { BECH_32_SEPARATOR, toBech32Address } from 'lib/address/bech32';
import { useSettingsContext } from 'lib/contexts/settings';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  isLoading: boolean;
  addressHash: string;
}

const AddressAlternativeFormat = ({ isLoading, addressHash }: Props) => {
  const settingsContext = useSettingsContext();

  if (!settingsContext || config.UI.views.address.hashFormat.availableFormats.length < 2) {
    return null;
  }

  const label = settingsContext.addressFormat === 'bech32' ? '0x hash' : `${ config.UI.views.address.hashFormat.bech32Prefix }${ BECH_32_SEPARATOR } hash`;
  const hint = settingsContext.addressFormat === 'bech32' ? 'Address hash encoded in base16 format' : 'Address hash encoded in bech32 format';
  const altHash = settingsContext.addressFormat === 'bech32' ? addressHash : toBech32Address(addressHash);

  return (
    <>
      <DetailsInfoItem.Label
        hint={ hint }
        isLoading={ isLoading }
      >
        { label }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <AddressEntity
          address={{ hash: altHash }}
          isLoading={ isLoading }
          noIcon
          noLink
          noAltHash
        />
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(AddressAlternativeFormat);
