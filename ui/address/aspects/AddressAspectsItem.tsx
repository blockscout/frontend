import { Td, Tr, VStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressAspect } from '../../../types/api/address';

import { convertString } from '../../../configs/app/utils';
import Address from '../../shared/address/Address';
import AddressLink from '../../shared/address/AddressLink';
import Tag from '../../shared/chakra/Tag';

interface IProps {
  data: AddressAspect;
}

export default function AddressAspectsItem({ data }: IProps) {
  return (
    <Tr>
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <Address w="150px">
            <AddressLink
              hash={ data.aspect_hash }
              type="aspect"
              fontWeight="700"
            /></Address>
        </VStack>
      </Td>
      <Td>
        { data.join_points.map(item => (
          <Tag colorScheme="green" isTruncated maxW={{ base: '115px', lg: 'initial' }} key={ item } style={{ marginRight: '4px' }}>
            { convertString(item) }
          </Tag>
        )) }
      </Td>
      <Td>
        <VStack alignItems="start" lineHeight="24px"><span>{ data.version }</span></VStack>
      </Td>
      <Td>
        <VStack alignItems="end" lineHeight="24px"><span>{ data.priority }</span></VStack>
      </Td>
    </Tr>
  );
}
