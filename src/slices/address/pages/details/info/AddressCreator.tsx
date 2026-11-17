// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import ContractCreationStatus from 'src/slices/contract/components/ContractCreationStatus';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

interface Props {
  data: schemas['AddressResponse'];
  isLoading: boolean | undefined;
}

const AddressCreator = ({ data, isLoading }: Props) => {
  const creatorAddressHash = data.creator_address_hash;

  if (!data.is_contract || !data.creation_transaction_hash || !creatorAddressHash) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Transaction and address of creation"
        isLoading={ isLoading }
      >
        Creator
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity
          address={{
            hash: creatorAddressHash,
            filecoin: data.creator_filecoin_robust_address ? { robust: data.creator_filecoin_robust_address, actor_type: null, id: null } : undefined,
          }}
          truncation="constant"
          noIcon
        />
        <Text whiteSpace="pre"> at txn </Text>
        <TxEntity hash={ data.creation_transaction_hash } truncation="constant" noIcon/>
        { data.creation_status && <ContractCreationStatus status={ data.creation_status } ml={{ base: 0, lg: 2 }}/> }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressCreator);
