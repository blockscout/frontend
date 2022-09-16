import {
  Box,
  Tr,
  Td,
  Tag,
  Link,
  Icon,
  VStack,
  Text,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useBreakpointValue,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import infoIcon from 'icons/info.svg';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxType from './TxType';

const TxsTableItem = (item) => {
  const link = useLink();

  const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  const addressFrom = (
    <Address>
      <Tooltip label={ item.address_from.type } shouldWrapChildren>
        <AddressIcon hash={ item.address_from.hash }/>
      </Tooltip>
      <AddressLink hash={ item.address_from.hash } alias={ item.address_from.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  const addressTo = (
    <Address>
      <Tooltip label={ item.address_to.type } shouldWrapChildren>
        <AddressIcon hash={ item.address_to.hash }/>
      </Tooltip>
      <AddressLink hash={ item.address_to.hash } alias={ item.address_to.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  const infoBgColor = useColorModeValue('blue.50', 'gray.600');
  const infoColor = useColorModeValue('blue.600', 'blue.300');

  const infoBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Tr>
      <Td pl={ 4 }>
        <Popover placement="right-start" openDelay={ 300 }>
          { ({ isOpen }) => (
            <>
              <PopoverTrigger>
                <Center background={ isOpen ? infoBgColor : 'unset' } borderRadius="8px" w="30px" h="30px">
                  <Icon
                    as={ infoIcon }
                    boxSize={ 5 }
                    color={ infoColor }
                    _hover={{ color: 'blue.400' }}
                  />
                </Center>
              </PopoverTrigger>
              <PopoverContent border="1px solid" borderColor={ infoBorderColor }>
                <PopoverBody>
                  <TxAdditionalInfo tx={ item }/>
                </PopoverBody>
              </PopoverContent>
            </>
          ) }
        </Popover>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType type={ item.txType }/>
          <TxStatus status={ item.status } errorText={ item.errorText }/>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ item.hash }
              type="transaction"
              fontWeight="700"
            />
          </Address>
          <Text color="gray.500" fontWeight="400">{ dayjs(item.timestamp).fromNow() }</Text>
        </VStack>
      </Td>
      <Td>
        <TruncatedTextTooltip label={ item.method }>
          <Tag
            colorScheme={ item.method === 'Multicall' ? 'teal' : 'gray' }
          >
            { item.method }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        <Link href={ link('block', { id: item.block_num }) }>{ item.block_num }</Link>
      </Td>
      { isLargeScreen ? (
        <>
          <Td>
            { addressFrom }
          </Td>
          <Td>
            <Icon as={ rightArrowIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
          </Td>
          <Td>
            { addressTo }
          </Td>
        </>
      ) : (
        <Td colSpan={ 3 }>
          <Box>
            { addressFrom }
            <Icon
              as={ rightArrowIcon }
              boxSize={ 6 }
              mt={ 2 }
              mb={ 1 }
              color="gray.500"
              transform="rotate(90deg)"
            />
            { addressTo }
          </Box>
        </Td>
      ) }
      <Td isNumeric>
        { item.amount.value.toFixed(8) }
      </Td>
      <Td isNumeric>
        { item.fee.value.toFixed(8) }
      </Td>
    </Tr>
  );
};

export default TxsTableItem;
