// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { BECH_32_SEPARATOR, toBech32Address } from 'client/slices/address/utils/bech32';

import config from 'configs/app';
import { useSettingsContext } from 'lib/contexts/settings';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  isLoading?: boolean;
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
      <DetailedInfo.ItemLabel
        hint={ hint }
        isLoading={ isLoading }
      >
        { label }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity
          address={{ hash: altHash }}
          isLoading={ isLoading }
          noIcon
          noLink
          noAltHash
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressAlternativeFormat);
