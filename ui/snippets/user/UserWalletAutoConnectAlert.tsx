import { Text, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const UserWalletAutoConnectAlert = () => {
  const bgColor = useColorModeValue('orange.100', 'orange.900');

  return (
    <Flex
      borderRadius="base"
      p={ 3 }
      mb={ 3 }
      alignItems="center"
      bgColor={ bgColor }
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
  );
};

export default React.memo(UserWalletAutoConnectAlert);
