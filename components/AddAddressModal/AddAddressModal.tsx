import React from 'react';

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Checkbox,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';

const NOTIFICATIONS = [ 'xDAI', 'ERC-20', 'ERC-721, ERC-1155 (NFT)' ];

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

const AddAddressModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500">New Address to Watchlist</ModalHeader>
        <ModalCloseButton color="blue.500"/>
        <ModalBody>
          <Text lineHeight="30px" marginBottom="40px">
            An Email notification can be sent to you when an address on your watch list sends or receives any transactions.
          </Text>
          <Input placeholder="Address (0x...)*" marginBottom="20px"/>
          <Input placeholder="Private tag (max 35 characters)*" marginBottom="30px"/>
          <Text color="gray.600" fontSize="14px" marginBottom="32px">
            Please select what types of notifications you will receive:
          </Text>
          <Box marginBottom="32px">
            <Grid templateColumns="repeat(3, max-content)" gap="20px 24px">
              { NOTIFICATIONS.map((notification: string) => {
                return (
                  <>
                    <GridItem>{ notification }</GridItem>
                    <GridItem><Checkbox colorScheme="green">Incoming</Checkbox></GridItem>
                    <GridItem><Checkbox colorScheme="green">Outgoing</Checkbox></GridItem>
                  </>
                )
              }) }
            </Grid>
          </Box>
          <Text color="gray.600" fontSize="14px" marginBottom="20px">Notification methods:</Text>
          <Checkbox defaultChecked colorScheme="green">Email notifications</Checkbox>
        </ModalBody>

        <ModalFooter justifyContent="flex-start">
          <Button colorScheme="blue" onClick={ onClose }>
            Add address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddAddressModal;
