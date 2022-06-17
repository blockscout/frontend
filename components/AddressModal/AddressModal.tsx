import React, { useCallback, useEffect, useState } from 'react';

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
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

import type { TWatchlistItem } from '../../data/watchlist';

const NOTIFICATIONS = [ 'xDAI', 'ERC-20', 'ERC-721, ERC-1155 (NFT)' ];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  getDisclosureProps: () => any;
  data?: TWatchlistItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  // надо чето придумать с формой
  // потом доделаем
  const [ address, setAddress ] = useState<string>();
  const [ tag, setTag ] = useState<string>();
  const [ notification, setNotification ] = useState<boolean>();

  useEffect(() => {
    setAddress(data?.address);
    setTag(data?.tag);
    setNotification(data?.notification);
  }, [ data ]);

  const onAddressChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value), [ setAddress ]);
  const onTagChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTag(event.target.value), [ setTag ]);
  const onNotificationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNotification(event.target.checked), [ setNotification ]);

  const onButtonClick = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log(address, tag, notification);
    onClose()
  }, [ address, tag, notification, onClose ]);

  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500">New Address to Watchlist</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Text lineHeight="30px" marginBottom="40px">
            An Email notification can be sent to you when an address on your watch list sends or receives any transactions.
          </Text>
          <FormControl variant="floating" id="address" marginBottom="20px" isRequired>
            <Input placeholder=" " onChange={ onAddressChange } value={ address || '' }/>
            <FormLabel>Address (0x...)</FormLabel>
          </FormControl>
          <FormControl variant="floating" id="tag" marginBottom="30px" isRequired>
            <Input placeholder=" " onChange={ onTagChange } value={ tag || '' }/>
            <FormLabel>Private tag (max 35 characters)</FormLabel>
          </FormControl>
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
          <Checkbox
            isChecked={ notification }
            colorScheme="green"
            onChange={ onNotificationChange }
          >
            Email notifications
          </Checkbox>
        </ModalBody>

        <ModalFooter justifyContent="flex-start">
          <Button colorScheme="blue" onClick={ onButtonClick }>
            Add address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AddressModal;
