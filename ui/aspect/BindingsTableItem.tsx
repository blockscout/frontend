import { Skeleton, Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { AspectBinding } from '../../types/api/aspect';

import Address from '../shared/address/Address';
import AddressIcon from '../shared/address/AddressIcon';
import AddressLink from '../shared/address/AddressLink';
import Tag from '../shared/chakra/Tag';
import CopyToClipboard from '../shared/CopyToClipboard';

interface IProps {
  data: AspectBinding;
  isLoading?: boolean;
}

export default function BindingsTableItem({ data, isLoading }: IProps) {
  return (
    <Tr>
      <Td pr={ 4 }>
        <Address w="150px">
          <AddressLink
            hash={ data.bind_aspect_transaction_hash }
            type="transaction"
            fontWeight="700"
            isLoading={ isLoading }
          /></Address>
      </Td>
      <Td>
        <Tag isTruncated maxW={{ base: '115px', lg: 'initial' }} isLoading={ isLoading }>
          { data.is_smart_contract ? 'Contract' : 'EOA' }
        </Tag>
      </Td>
      <Td><Skeleton isLoaded={ !isLoading }>{ data.version }</Skeleton></Td>
      <Td display="flex">
        <Skeleton isLoaded={ !isLoading }>
          <Address w="100%">
            <AddressIcon address={{
              hash: data.bound_address_hash,
              is_contract: data.is_smart_contract,
              implementation_name: '',
            }}/>
            <AddressLink
              type="address"
              hash={ data.bound_address_hash }
              fontWeight="500" ml={ 2 }
              truncation="constant"
            />
            <CopyToClipboard text={ data.bound_address_hash }/>
          </Address>
        </Skeleton></Td>
    </Tr>
  );
}
