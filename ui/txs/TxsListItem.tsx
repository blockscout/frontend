import {
  HStack,
  Box,
  Flex,
  Icon,
  Link,
  Modal,
  ModalContent,
  ModalCloseButton,
  Text,
  useColorModeValue,
  useDisclosure } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { txs } from 'data/txs';
import rightArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import useNetwork from 'lib/hooks/useNetwork';
import useLink from 'lib/link/useLink';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxAdditionalInfoButton from 'ui/txs/TxAdditionalInfoButton';
import TxType from 'ui/txs/TxType';

const TxsListItem = ({ tx }: {tx: ArrayElement<typeof txs>}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedNetwork = useNetwork();

  const iconColor = useColorModeValue('blue.600', 'blue.300');
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const link = useLink();

  return (
    <>
      <Box width="100%" borderBottom="1px solid" borderColor={ borderColor } _first={{ borderTop: '1px solid', borderColor: { borderColor } }}>
        <Flex justifyContent="space-between" mt={ 4 }>
          <HStack>
            <TxType type={ tx.txType }/>
            <TxStatus status={ tx.status } errorText={ tx.errorText }/>
          </HStack>
          <TxAdditionalInfoButton onClick={ onOpen }/>
        </Flex>
        <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 }>
          <Flex>
            <Icon
              as={ transactionIcon }
              boxSize="30px"
              mr={ 2 }
              color={ iconColor }
            />
            <Address width="100%">
              <AddressLink
                hash={ tx.hash }
                type="transaction"
                fontWeight="700"
                truncation="constant"
              />
            </Address>
          </Flex>
          <Text variant="secondary" fontWeight="400" fontSize="sm">{ dayjs(tx.timestamp).fromNow() }</Text>
        </Flex>
        <Flex mt={ 3 }>
          <Text as="span" whiteSpace="pre">Method </Text>
          <Text
            as="span"
            variant="secondary"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            { tx.method }
          </Text>
        </Flex>
        <Box mt={ 2 }>
          <Text as="span">Block </Text>
          <Link href={ link('block_index', { id: tx.block_num.toString() }) }>{ tx.block_num }</Link>
        </Box>
        <Flex alignItems="center" height={ 6 } mt={ 6 }>
          <Address width="calc((100%-40px)/2)">
            <AddressIcon hash={ tx.address_from.hash }/>
            <AddressLink
              hash={ tx.address_from.hash }
              alias={ tx.address_from.alias }
              fontWeight="500"
              ml={ 2 }
            />
          </Address>
          <Icon
            as={ rightArrowIcon }
            boxSize={ 6 }
            mx={ 2 }
            color="gray.500"
          />
          <Address width="calc((100%-40px)/2)">
            <AddressIcon hash={ tx.address_to.hash }/>
            <AddressLink
              hash={ tx.address_to.hash }
              alias={ tx.address_to.alias }
              fontWeight="500"
              ml={ 2 }
            />
          </Address>
        </Flex>
        <Box mt={ 2 }>
          <Text as="span">Value { selectedNetwork?.currency } </Text>
          <Text as="span" variant="secondary">{ tx.amount.value.toFixed(8) }</Text>
        </Box>
        <Box mt={ 2 } mb={ 3 }>
          <Text as="span">Fee { selectedNetwork?.currency } </Text>
          <Text as="span" variant="secondary">{ tx.fee.value.toFixed(8) }</Text>
        </Box>
      </Box>
      <Modal isOpen={ isOpen } onClose={ onClose } size="full">
        <ModalContent paddingTop={ 4 }>
          <ModalCloseButton/>
          <TxAdditionalInfo tx={ tx }/>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TxsListItem;
