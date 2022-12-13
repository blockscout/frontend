import { Popover, PopoverTrigger, Box } from '@chakra-ui/react';
import React from 'react';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
interface Props {
  isCollapsed?: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 22 } isLazy>
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Box
              marginLeft="auto"
              overflow="hidden"
              width={{ base: 'auto', lg: isCollapsed === false ? 'auto' : '0px', xl: isCollapsed ? '0px' : 'auto' }}
            >
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
