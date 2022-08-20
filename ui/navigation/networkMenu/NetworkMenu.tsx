import { Popover, PopoverTrigger, Icon, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import networksIcon from 'icons/networks.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import NetworkMenuPopup from './NetworkMenuPopup';

interface Props {
  isCollapsed: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 22 } isLazy>
      <PopoverTrigger>
        <Button variant="unstyled" display="inline-flex" alignSelf="stretch" alignItems="center">
          <Icon
            as={ networksIcon }
            width="16px"
            height="16px"
            color={ useColorModeValue('gray.500', 'gray.400') }
            _hover={{ color: 'blue.400' }}
            marginLeft={ isCollapsed ? '0px' : '27px' }
            cursor="pointer"
            { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
          />
        </Button>
      </PopoverTrigger>
      <NetworkMenuPopup/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
