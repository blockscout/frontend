import {
  HStack,
  Box,
  Flex,
  Icon,
  Link,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
  DrawerOverlay,
  //   Modal,
  //   ModalContent,
  //   ModalCloseButton,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import transactionIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxAdditionalInfoButton from 'ui/txs/TxAdditionalInfoButton';
import TxType from 'ui/txs/TxType';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TxsListItem = ({ tx }: {tx: any}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconColor = useColorModeValue('blue.600', 'blue.300');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');

  const link = useLink();

  return (
    <>
      <Box width="100%" borderBottom="1px solid" borderColor="blackAlpha.200" _first={{ borderTop: '1px solid', borderColor: 'blackAlpha.200' }}>
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
          <Text color={ secondaryTextColor } fontWeight="400">{ dayjs(tx.timestamp).fromNow() }</Text>
        </Flex>
        <Flex mt={ 3 }>
          <Text as="span" whiteSpace="pre">Method </Text>
          <Box
            color={ secondaryTextColor }
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            { tx.method }
          </Box>
        </Flex>
        <Box mt={ 2 }>
          <Text as="span">Block </Text>
          <Link href={ link('block', { id: tx.block_num }) }>{ tx.block_num }</Link>
        </Box>
        <Flex alignItems="center" height={ 6 } mt={ 6 }>
          <Address width="calc((100%-40px)/2)">
            <Tooltip label={ tx.address_from.type } shouldWrapChildren>
              <AddressIcon hash={ tx.address_from.hash }/>
            </Tooltip>
            <AddressLink
              hash={ tx.address_from.hash }
              alias={ tx.address_from.alias }
              fontWeight="500"
              ml={ 2 }
              truncation="constant"
            />
          </Address>
          <Icon
            as={ rightArrowIcon }
            boxSize={ 6 }
            mx={ 2 }
            color="gray.500"
          />
          <Address width="calc((100%-40px)/2)">
            <Tooltip label={ tx.address_to.type } shouldWrapChildren>
              <AddressIcon hash={ tx.address_to.hash }/>
            </Tooltip>
            <AddressLink
              hash={ tx.address_to.hash }
              alias={ tx.address_to.alias }
              fontWeight="500"
              ml={ 2 }
              truncation="constant"
            />
          </Address>
        </Flex>
        <Box mt={ 2 }>
          <Text as="span">Value xDAI </Text>
          <Text as="span" color={ secondaryTextColor }>{ tx.amount.value.toFixed(8) }</Text>
        </Box>
        <Box mt={ 2 } mb={ 3 }>
          <Text as="span">Fee xDAI </Text>
          <Text as="span" color={ secondaryTextColor }>{ tx.fee.value.toFixed(8) }</Text>
        </Box>
      </Box>
      { /* <Modal isOpen={ isOpen } onClose={ onClose } size="full">
        <ModalContent paddingTop={ 4 }>
          <ModalCloseButton/>
          <TxAdditionalInfo tx={ tx }/>
        </ModalContent>
      </Modal> */ }
      <Drawer
        isOpen={ isOpen }
        placement="bottom"
        onClose={ onClose }
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerBody p={ 6 }>          <TxAdditionalInfo tx={ tx }/></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default TxsListItem;
