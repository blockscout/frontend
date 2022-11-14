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

import type { Transaction } from 'types/api/transaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import getValueWithUnit from 'lib/getValueWithUnit';
import link from 'lib/link/link';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

const TxsListItem = ({ tx, showBlockInfo }: {tx: Transaction; showBlockInfo: boolean}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconColor = useColorModeValue('blue.600', 'blue.300');
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const dataTo = tx.to && tx.to.hash ? tx.to : tx.created_contract;

  return (
    <>
      <Box width="100%" borderBottom="1px solid" borderColor={ borderColor } _first={{ borderTop: '1px solid', borderColor }}>
        <Flex justifyContent="space-between" mt={ 4 }>
          <HStack>
            { tx.tx_types.map(item => <TxType key={ item } type={ item }/>) }
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
          </HStack>
          <AdditionalInfoButton onClick={ onOpen }/>
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
                target="_self"
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
        { showBlockInfo && tx.block !== null && (
          <Box mt={ 2 }>
            <Text as="span">Block </Text>
            <Link href={ link('block', { id: tx.block.toString() }) }>{ tx.block }</Link>
          </Box>
        ) }
        <Flex alignItems="center" height={ 6 } mt={ 6 }>
          <Address width="calc((100%-40px)/2)">
            <AddressIcon hash={ tx.from.hash }/>
            <AddressLink
              hash={ tx.from.hash }
              alias={ tx.from.name }
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
            <AddressIcon hash={ dataTo.hash }/>
            <AddressLink
              hash={ dataTo.hash }
              alias={ dataTo.name }
              fontWeight="500"
              ml={ 2 }
            />
          </Address>
        </Flex>
        <Box mt={ 2 }>
          <Text as="span">Value { appConfig.network.currency.symbol } </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).toFormat() }</Text>
        </Box>
        <Box mt={ 2 } mb={ 3 }>
          <Text as="span">Fee { appConfig.network.currency.symbol } </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).toFormat() }</Text>
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
