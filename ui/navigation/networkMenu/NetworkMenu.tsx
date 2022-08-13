import { Popover, PopoverTrigger, Box, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import networksIcon from 'icons/networks.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import NetworkMenuPopup from './NetworkMenuPopup';

interface Props {
  isCollapsed: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover trigger="hover" openDelay={ 0 } placement="right-start" gutter={ 22 } isOpen>
      <PopoverTrigger>
        <Box display="inline-flex">
          <Icon
            as={ networksIcon }
            width="16px"
            height="16px"
            color={ useColorModeValue('gray.500', 'white') }
            marginLeft={ isCollapsed ? '0px' : '27px' }
            cursor="pointer"
            { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
          />
        </Box>
      </PopoverTrigger>
      <NetworkMenuPopup/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
