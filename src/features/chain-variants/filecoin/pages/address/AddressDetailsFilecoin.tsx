// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import FilecoinActorTag from './FilecoinActorTag';

interface Props {
  data: Pick<schemas['AddressResponse'], 'hash' | 'filecoin'>;
}

const AddressDetailsFilecoin = ({ data }: Props) => {
  const filecoin = data.filecoin;

  if (!filecoin) {
    return null;
  }

  const hasEthereumAddress = (filecoin.actor_type === 'evm' || filecoin.actor_type === 'ethaccount') && Boolean(filecoin.robust);

  return (
    <>
      { filecoin.id && (
        <>
          <DetailedInfo.ItemLabel
            hint="Short identifier of an address that may change with chain state updates"
          >
            ID
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Text>{ filecoin.id }</Text>
            <CopyToClipboard text={ filecoin.id }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { filecoin.actor_type && (
        <>
          <DetailedInfo.ItemLabel
            hint="Identifies the purpose and behavior of the address on the Filecoin network"
          >
            Actor
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <FilecoinActorTag actorType={ filecoin.actor_type }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { hasEthereumAddress && (
        <>
          <DetailedInfo.ItemLabel
            hint="0x-style address to which the Filecoin address is assigned by the Ethereum Address Manager"
          >
            Ethereum Address
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue flexWrap="nowrap">
            <AddressEntity
              address={{ hash: data.hash }}
              noIcon
              noLink
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(AddressDetailsFilecoin);
