// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { mainnet } from 'viem/chains';
import { useEnsName } from 'wagmi';

import type { EntityProps } from 'client/slices/address/components/entity/AddressEntity';
import AddressEntityBase from 'client/slices/address/components/entity/AddressEntity';

function AddressEntity({ address, ...props }: EntityProps) {
  const ensQuery = useEnsName({
    address: address.hash as `0x${ string }`,
    chainId: mainnet.id,
  });

  return <AddressEntityBase address={{ ...address, name: ensQuery.data }} { ...props }/>;
}

export default chakra(AddressEntity);
