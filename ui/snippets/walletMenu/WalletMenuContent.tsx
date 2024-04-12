import { Box, Button, Text, Flex } from '@chakra-ui/react';
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
};

const WalletMenuContent = ({ address, disconnect, isAutoConnectDisabled }: Props) => {
  const { themedBackgroundOrange } = useMenuButtonColors();

  const onAddressClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, { Action: 'Address click' });
  }, []);

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
      <AddressEntity
        address={{ hash: address }}
        noTooltip
        truncation="dynamic"
        fontSize="sm"
        fontWeight={ 700 }
        color="text"
        mb={ 6 }
        onClick={ onAddressClick }
      />
      <Button size="sm" width="full" variant="outline" onClick={ disconnect }>
        Disconnect
      </Button>
    </Box>
  );
};

export default WalletMenuContent;
