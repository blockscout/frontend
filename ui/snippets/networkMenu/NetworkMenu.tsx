import React from 'react';

import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
import useNetworkMenu from './useNetworkMenu';
interface Props {
  isCollapsed?: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {

  const menu = useNetworkMenu();

  return (
    <PopoverRoot
      positioning={{ placement: 'right-start', offset: { crossAxis: 0, mainAxis: 8 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ menu.onOpenChange }
    >
      <PopoverTrigger>
        <NetworkMenuButton
          marginLeft="auto"
          overflow="hidden"
          width={{ base: 'auto', lg: isCollapsed === false ? '36px' : '0px', xl: isCollapsed ? '0px' : '36px' }}
          visibility={{ base: 'visible', lg: isCollapsed === false ? 'visible' : 'hidden', xl: isCollapsed ? 'hidden' : 'visible' }}
          isActive={ menu.open }
          onClick={ menu.onToggle }
        />
      </PopoverTrigger>
      <NetworkMenuContentDesktop items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
