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
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxAdditionalInfoButton from 'ui/txs/TxAdditionalInfoButton';

import TxType from './TxType';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TxsTableItem = ({ tx }: {tx: any}) => {
  const link = useLink();

  const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  const addressFrom = (
    <Address>
      <Tooltip label={ tx.address_from.type } shouldWrapChildren>
        <AddressIcon hash={ tx.address_from.hash }/>
      </Tooltip>
      <AddressLink hash={ tx.address_from.hash } alias={ tx.address_from.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  const addressTo = (
    <Address>
      <Tooltip label={ tx.address_to.type } shouldWrapChildren>
        <AddressIcon hash={ tx.address_to.hash }/>
      </Tooltip>
      <AddressLink hash={ tx.address_to.hash } alias={ tx.address_to.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  const infoBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Tr>
      <Td pl={ 4 }>
        <Popover placement="right-start" openDelay={ 300 }>
          { ({ isOpen }) => (
            <>
              <PopoverTrigger>
                <TxAdditionalInfoButton isOpen={ isOpen }/>
              </PopoverTrigger>
              <PopoverContent border="1px solid" borderColor={ infoBorderColor }>
                <PopoverBody>
                  <TxAdditionalInfo tx={ tx }/>
                </PopoverBody>
              </PopoverContent>
            </>
          ) }
        </Popover>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType type={ tx.txType }/>
          <TxStatus status={ tx.status } errorText={ tx.errorText }/>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
            />
          </Address>
          <Text color="gray.500" fontWeight="400">{ dayjs(tx.timestamp).fromNow() }</Text>
        </VStack>
      </Td>
      <Td>
        <TruncatedTextTooltip label={ tx.method }>
          <Tag
            colorScheme={ tx.method === 'Multicall' ? 'teal' : 'gray' }
          >
            { tx.method }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        <Link href={ link('block', { id: tx.block_num }) }>{ tx.block_num }</Link>
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
        { tx.amount.value.toFixed(8) }
      </Td>
      <Td isNumeric>
        { tx.fee.value.toFixed(8) }
      </Td>
    </Tr>
  );
};

export default TxsTableItem;
