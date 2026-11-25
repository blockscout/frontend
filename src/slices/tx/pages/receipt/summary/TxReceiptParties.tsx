// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SentenceConnector } from './types';
import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

const ADDRESS_ICON = { marginRight: 1 };

interface PartyProps {
  readonly address: schemas['Address'];
  readonly isLoading: boolean;
}

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
      maxW="200px"
    />
  );
};

interface Props {
  readonly from: schemas['Address'];
  readonly to: schemas['Address'] | null;
  readonly connector: 'to' | SentenceConnector;
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
