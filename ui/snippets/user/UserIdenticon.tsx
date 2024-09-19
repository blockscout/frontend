import { Box, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  address: string;
  isAutoConnectDisabled?: boolean;
};

const UserIdenticon = ({ address, isAutoConnectDisabled }: Props) => {
  const borderColor = useColorModeValue('orange.100', 'orange.900');

  return (
    <Box position="relative">
      <AddressIdenticon size={ 20 } hash={ address }/>
      { isAutoConnectDisabled && (
        <Center
          boxSize="14px"
          position="absolute"
          bottom="-1px"
          right="-3px"
          backgroundColor="rgba(16, 17, 18, 0.80)"
          borderRadius="full"
          border="1px solid"
          borderColor={ borderColor }
        >
          <IconSvg
            name="integration/partial"
            color="white"
            boxSize={ 2 }
          />
        </Center>
      ) }
    </Box>
  );
};

export default React.memo(UserIdenticon);
