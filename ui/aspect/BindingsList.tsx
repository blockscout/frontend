import { Flex, Skeleton, Tag, Text } from '@chakra-ui/react';
import React from 'react';

import type { AspectBinding } from '../../types/api/aspect';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface IProps {
  data: Array<AspectBinding>;
  isLoading?: boolean;
  isPlaceholderData?: boolean;
}

const BindingsList = ({ data, isLoading, isPlaceholderData }: IProps) => {
  return (
    <>
      { data.map((item, index) => (
        <ListItemMobile rowGap={ 3 } isAnimated key={ isPlaceholderData ? index : item.bind_block_number }>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            lineHeight="24px"
            width="100%"
          >
            <Flex>
              <Icon as={ transactionIcon } boxSize="30px" color="link" isLoading={ isLoading }/>
              <Address width="100%" ml={ 2 } isLoading={ isLoading }>
                <AddressLink
                  hash={ item.bind_aspect_transaction_hash }
                  type="transaction"
                  fontWeight="700"
                  truncation="constant"
                  isLoading={ isLoading }
                />
              </Address>
            </Flex>
          </Flex>
          <Flex columnGap={ 2 } w="100%" alignItems="center">
            <Skeleton isLoaded={ !isLoading }>
              <Text as="span">Type</Text>
              <Tag isTruncated maxW={{ base: '115px', lg: 'initial' }}>
                { item.is_smart_contract ? 'Contract' : 'EOA' }
              </Tag>
            </Skeleton>
          </Flex>
          <Flex columnGap={ 2 } w="100%">
            <Skeleton isLoaded={ !isLoading }>
              <Text as="span">Value</Text>
              <Text as="span" variant="secondary">
                <span>{ item.version }</span>
              </Text>
            </Skeleton>
          </Flex>
          <Flex w="100%" columnGap={ 3 }>
            <Address width="100%" flexShrink={ 0 }>
              <AddressIcon
                address={{
                  hash: item.bound_address_hash,
                  is_contract: item.is_smart_contract,
                  implementation_name: '',
                }}
                isLoading={ isLoading }
              />
              <AddressLink
                type="address"
                hash={ item.bound_address_hash }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
                isLoading={ isLoading }
              />
              <CopyToClipboard text={ item.bound_address_hash } isLoading={ isLoading }/>
            </Address>
          </Flex>
        </ListItemMobile>
      )) }
    </>
  );
};

export default React.memo(BindingsList);
