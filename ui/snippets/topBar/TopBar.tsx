import { Flex, Divider, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useUnisatWallet from 'lib/useUnisatWallet';

import Settings from './settings/Settings';
import SwapButton from './SwapButton';
import TopBarStats from './TopBarStats';

const feature = config.features.swapButton;

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');
  const { address, connect } = useUnisatWallet();

  return (
    <Flex
      py={ 2 }
      px={ 6 }
      bgColor={ bgColor }
      justifyContent="space-between"
      alignItems="center"
    >
      <TopBarStats/>
      <Flex alignItems="center" gap={ 2 }>
        { feature.isEnabled && (
          <>
            <SwapButton/>
            <Divider
              mr={ 3 }
              ml={{ base: 2, sm: 3 }}
              height={ 4 }
              orientation="vertical"
            />
          </>
        ) }
        <Button
          onClick={ connect }
          fontSize="sm"
          backgroundColor="rgba(0, 0, 0, 1)"
          color="white"
          borderRadius="56px"
          fontWeight="semibold"
          _hover="none"
        >
          { address ? <p>{ address.slice(0, 10) }...</p> : 'Connet Wallet' }
        </Button>
        <Settings/>
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBar);
