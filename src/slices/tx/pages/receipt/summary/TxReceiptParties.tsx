// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import getAddressName from 'src/slices/address/utils/get-address-name';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const ADDRESS_ICON = { marginRight: 1 };

// a constant-truncated hash is already short, so only a name gives way; below 80px it moves to a line of its own
const NAMED_PARTY_SIZE = { flex: '1 1 0', minW: '80px', maxW: 'fit-content' };
const HASH_PARTY_SIZE = { flexShrink: 0 };

interface PartyProps {
  readonly address: schemas['Address'];
  readonly isLoading: boolean;
}

const isNamed = (address: schemas['Address']): boolean => {
  return Boolean(getAddressName(address)) || Boolean(address.implementations?.some((implementation) => implementation.name));
};

const TxReceiptParty = ({ address, isLoading }: PartyProps) => {
  return (
    <AddressEntity
      address={ address }
      isLoading={ isLoading }
      noLink
      noCopy
      truncation="constant"
      icon={ ADDRESS_ICON }
      fontWeight="medium"
      { ...(isNamed(address) ? NAMED_PARTY_SIZE : HASH_PARTY_SIZE) }
    />
  );
};

interface Props {
  readonly from: schemas['Address'];
  readonly to: schemas['Address'] | null;
  readonly connector: 'to' | 'interacted with';
  readonly isLoading: boolean;
}

const TxReceiptParties = ({ from, to, connector, isLoading }: Props) => {
  return (
    <Flex alignItems="center" justifyContent="center" flexWrap="wrap" gap={ 2 } textStyle="sm">
      <TxReceiptParty address={ from } isLoading={ isLoading }/>
      { to && (
        <>
          <Skeleton loading={ isLoading } color="text.secondary" flexShrink={ 0 }>{ connector }</Skeleton>
          <TxReceiptParty address={ to } isLoading={ isLoading }/>
        </>
      ) }
    </Flex>
  );
};

export default React.memo(TxReceiptParties);
