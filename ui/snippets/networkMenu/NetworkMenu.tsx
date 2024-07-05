import { PopoverTrigger } from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
import useNetworkMenu from './useNetworkMenu';
interface Props {
  isCollapsed?: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {

  const menu = useNetworkMenu();

  return (
    <Popover openDelay={ 300 } placement="right-start" isLazy isOpen={ menu.isOpen } onClose={ menu.onClose }>
      <PopoverTrigger>
        <NetworkMenuButton
          marginLeft="auto"
          overflow="hidden"
          width={{ base: 'auto', lg: isCollapsed === false ? 'auto' : '0px', xl: isCollapsed ? '0px' : 'auto' }}
          isActive={ menu.isOpen }
          onClick={ menu.onToggle }
        />
      </PopoverTrigger>
      <NetworkMenuContentDesktop items={ menu.data } tabs={ menu.availableTabs }/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
