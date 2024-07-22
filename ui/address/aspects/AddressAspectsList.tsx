import { Flex, Skeleton, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { AddressAspectResponse } from '../../../types/api/address';
import type { PaginationParams } from '../../shared/pagination/types';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import { convertString } from '../../../configs/app/utils';
import Tag from '../../shared/chakra/Tag';

interface IProps {
  query: UseQueryResult<AddressAspectResponse> & {
    pagination: PaginationParams;
  };
}

const AddressAspectsList = ({ query }: IProps) => {
  return (
    <div>
      { query.data?.items.map((item, index) => (
        <ListItemMobile rowGap={ 3 } isAnimated key={ query.isPlaceholderData ? index : item.aspect_hash }>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            lineHeight="24px"
            width="100%"
          >
            <Flex>
              <Icon as={ transactionIcon } boxSize="30px" color="link" isLoading={ query.isPlaceholderData }/>
              <Address width="100%" ml={ 2 }>
                <AddressLink
                  hash={ item.aspect_hash }
                  type="aspect"
                  fontWeight="700"
                  truncation="constant"
                  isLoading={ query.isPlaceholderData }
                />
              </Address>
            </Flex>
          </Flex>
          <Flex columnGap={ 2 } w="100%" alignItems="center">
            <Text as="span">
              <Skeleton isLoaded={ !query.isPlaceholderData }>
                Join Points
              </Skeleton>
            </Text>
            { item.join_points.map(item => (
              <Tag
                colorScheme="green"
                isTruncated maxW={{ base: '115px', lg: 'initial' }}
                style={{ marginRight: '4px' }} key={ item }
                isLoading={ query.isPlaceholderData }
              >
                { convertString(item) }
              </Tag>
            )) }
          </Flex>
          <Flex columnGap={ 2 } w="100%">
            <Text as="span"><Skeleton isLoaded={ !query.isPlaceholderData }>Version</Skeleton></Text>
            <Text as="span" variant="secondary">
              <Skeleton isLoaded={ !query.isPlaceholderData }>{ item.version }</Skeleton>
            </Text>
          </Flex>
          <Flex columnGap={ 2 } w="100%">
            <Text as="span"><Skeleton isLoaded={ !query.isPlaceholderData }>Priority</Skeleton></Text>
            <Text as="span" variant="secondary">
              <Skeleton isLoaded={ !query.isPlaceholderData }>{ item.priority }</Skeleton>
            </Text>
          </Flex>
        </ListItemMobile>
      )) }
    </div>
  );
};

export default React.memo(AddressAspectsList);
