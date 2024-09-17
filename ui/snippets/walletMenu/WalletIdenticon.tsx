import { Box, Flex, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  address: string;
  isAutoConnectDisabled?: boolean;
  className?: string;
};

const WalletIdenticon = ({ address, isAutoConnectDisabled, className }: Props) => {
  const isMobile = useIsMobile();
  const borderColor = useColorModeValue('orange.100', 'orange.900');

  return (
    <Box className={ className } position="relative">
      <AddressIdenticon size={ 20 } hash={ address }/>
      { isAutoConnectDisabled && (
        <Flex
          alignItems="center"
          justifyContent="center"
          boxSize="14px"
          position="absolute"
          bottom={ isMobile ? '-3px' : '-1px' }
          right={ isMobile ? '-4px' : '-5px' }
          backgroundColor="rgba(16, 17, 18, 0.80)"
          borderRadius="full"
          border="1px solid"
          borderColor={ borderColor }
        >
          <IconSvg
            name="integration/partial"
            color="white"
            boxSize="8px"
          />
        </Flex>
      ) }
    </Box>
  );
};

export default chakra(WalletIdenticon);
