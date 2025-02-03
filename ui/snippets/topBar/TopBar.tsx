import { Flex, Divider, useColorMode, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  const { setColorMode } = useColorMode();

  React.useEffect(() => {
    window.document.documentElement.style.setProperty('--chakra-colors-black', '#000');
    setColorMode('dark');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box bgColor="black">
      <Flex
        py={ 2 }
        px={ 12 }
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
        mb={ 2 }
        justifyContent="space-between"
        alignItems="center"
      >
        <TopBarStats/>
        <Flex alignItems="center" px={ 12 }>
          { config.features.deFiDropdown.isEnabled && (
            <>
              <DeFiDropdown/>
              <Divider mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
            </>
          ) }
          { config.UI.navigation.layout === 'horizontal' && Boolean(config.UI.navigation.featuredNetworks) && (
            <Box display={{ base: 'none', lg: 'flex' }}>
              <Divider mx={ 3 } height={ 4 } orientation="vertical"/>
              <NetworkMenu/>
            </Box>
          ) }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
