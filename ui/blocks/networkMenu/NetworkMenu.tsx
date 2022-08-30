import { Popover, PopoverTrigger, Box } from '@chakra-ui/react';
import React from 'react';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
interface Props {
  isCollapsed: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 22 } isLazy>
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Box marginLeft={ isCollapsed ? '0px' : '7px' }>
              <NetworkMenuButton isActive={ isOpen }/>
            </Box>
          </PopoverTrigger>
          <NetworkMenuContentDesktop/>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(NetworkMenu);
