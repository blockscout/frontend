import { Flex, Separator, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';

import DeFiDropdown from './DeFiDropdown';
import Settings from './settings/Settings';
import TopBarChainStatus from './TopBarChainStatus';

const TopBar = () => {
  return (
    <Box background="var(--kda-color-background-semantic-info-subtlest)">
      <Flex
        py={ 2 }
        px={{ base: 3, lg: 6 }}
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
      >
        <TopBarChainStatus/>
        <Flex alignItems="center">
          { config.features.deFiDropdown.isEnabled && (
            <>
              <DeFiDropdown/>
              <Separator mr={ 3 } ml={{ base: 2, sm: 3 }} height={ 4 } orientation="vertical"/>
            </>
          ) }
          <Settings/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
