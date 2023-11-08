import { Box, Button, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

type Props = {
  address?: string;
  disconnect?: () => void;
};

const WalletMenuContent = ({ address, disconnect }: Props) => {
  const primaryTextColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight={ 600 }
        mb={ 1 }
        color={ primaryTextColor }
        { ...getDefaultTransitionProps() }
      >
        My wallet
      </Text>
      <Text
        fontSize="sm"
        mb={ 5 }
        fontWeight={ 400 }
        color="gray.500"
        { ...getDefaultTransitionProps() }
      >
        Your wallet is used to interact with apps and contracts in the explorer.
      </Text>
      <AddressEntity
        address={{ hash: address }}
        noLink
        noTooltip
        truncation="dynamic"
        fontSize="sm"
        fontWeight={ 700 }
        color={ primaryTextColor }
        mb={ 6 }
      />
      <Button size="sm" width="full" variant="outline" onClick={ disconnect }>
        Disconnect
      </Button>
    </Box>
  );
};

export default WalletMenuContent;
