import { Popover, PopoverTrigger } from '@chakra-ui/react';
import React from 'react';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
interface Props {
  isCollapsed?: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {
  return (
    <Popover openDelay={ 300 } placement="right-start" gutter={ 8 } isLazy>
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <NetworkMenuButton
              marginLeft="auto"
              overflow="hidden"
              width={{ base: 'auto', lg: isCollapsed === false ? 'auto' : '0px', xl: isCollapsed ? '0px' : 'auto' }}
              isActive={ isOpen }
            />
          </PopoverTrigger>
          <NetworkMenuContentDesktop/>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(NetworkMenu);
