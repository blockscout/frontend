import { Box, Button, Text, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import * as mixpanel from 'lib/mixpanel/index';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

import useMenuButtonColors from '../useMenuButtonColors';

type Props = {
  address?: string;
  disconnect?: () => void;
  isAutoConnectDisabled?: boolean;
  openModal: () => void;
  close: () => void;
};

const WalletMenuContent = ({ address, disconnect, isAutoConnectDisabled, openModal, close }: Props) => {
  const { themedBackgroundOrange } = useMenuButtonColors();
  const [ isModalOpening, setIsModalOpening ] = React.useState(false);

  const onAddressClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, { Action: 'Address click' });
  }, []);

  const handleOpenModal = React.useCallback(async() => {
    setIsModalOpening(true);
    await openModal();
    setTimeout(() => {
      setIsModalOpening(false);
      close();
    }, 500);
  }, [ openModal, close ]);

  return (
    <Box>
      { isAutoConnectDisabled && (
        <Flex
          borderRadius="base"
          p={ 3 }
          mb={ 3 }
          alignItems="center"
          backgroundColor={ themedBackgroundOrange }
        >
          <IconSvg
            name="integration/partial"
            color="text"
            boxSize={ 5 }
            flexShrink={ 0 }
            mr={ 2 }
          />
          <Text fontSize="xs" lineHeight="16px">
            Connect your wallet in the app below
          </Text>
        </Flex>
      ) }
      <Text
        fontSize="sm"
        fontWeight={ 600 }
        mb={ 1 }
        { ...getDefaultTransitionProps() }
      >
        My wallet
      </Text>
      <Text
        fontSize="sm"
        mb={ 5 }
        fontWeight={ 400 }
        color="text_secondary"
        { ...getDefaultTransitionProps() }
      >
        Your wallet is used to interact with apps and contracts in the explorer.
      </Text>
      <Flex alignItems="center" mb={ 6 }>
        <AddressEntity
          address={{ hash: address }}
          noTooltip
          truncation="dynamic"
          fontSize="sm"
          fontWeight={ 700 }
          color="text"
          onClick={ onAddressClick }
          flex={ 1 }
        />
        <IconButton
          aria-label="open wallet"
          icon={ <IconSvg name="settings" boxSize={ 5 }/> }
          variant="simple"
          h="20px"
          w="20px"
          ml={ 1 }
          onClick={ handleOpenModal }
          isLoading={ isModalOpening }
        />
      </Flex>
      <Button size="sm" width="full" variant="outline" onClick={ disconnect }>
        Disconnect
      </Button>
    </Box>
  );
};

export default WalletMenuContent;
