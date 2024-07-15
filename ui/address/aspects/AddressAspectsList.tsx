import { Flex, Tag, Text } from '@chakra-ui/react';
import React from 'react';

import type { AddressAspect } from '../../../types/api/address';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import { convertString } from '../../../configs/app/utils';

interface IProps {
  data: Array<AddressAspect>;
}

const AddressAspectsList = ({ data }: IProps) => {
  return (
    <>
      { data.map((item) => (
        <ListItemMobile rowGap={ 3 } isAnimated key={ item.aspect_hash }>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            lineHeight="24px"
            width="100%"
          >
            <Flex>
              <Icon as={ transactionIcon } boxSize="30px" color="link"/>
              <Address width="100%" ml={ 2 }>
                <AddressLink
                  hash={ item.aspect_hash }
                  type="aspect"
                  fontWeight="700"
                  truncation="constant"
                />
              </Address>
            </Flex>
          </Flex>
          <Flex columnGap={ 2 } w="100%" alignItems="center">
            <Text as="span">Join Points</Text>
            { item.join_points.map(item => (
              <Tag colorScheme="green" isTruncated maxW={{ base: '115px', lg: 'initial' }} style={{ marginRight: '4px' }} key={ item }>
                { convertString(item) }
              </Tag>
            )) }
          </Flex>
          <Flex columnGap={ 2 } w="100%">
            <Text as="span">Version</Text>
            <Text as="span" variant="secondary">
              <span>{ item.version }</span>
            </Text>
          </Flex>
          <Flex columnGap={ 2 } w="100%">
            <Text as="span">Priority</Text>
            <Text as="span" variant="secondary">
              <span>{ item.priority }</span>
            </Text>
          </Flex>
        </ListItemMobile>
      )) }
    </>
  );
};

export default React.memo(AddressAspectsList);
