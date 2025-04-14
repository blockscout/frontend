import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';
import NetworkMenuContentDesktop from 'ui/snippets/networkMenu/NetworkMenuContentDesktop';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const NetworkMenu = () => {
  const menu = useNetworkMenu();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ menu.onOpenChange }
    >
      <PopoverTrigger>
        <IconButton
          variant="link"
          boxSize={ 5 }
          aria-label="Network menu"
          borderRadius="sm"
          onClick={ menu.onToggle }
          p={ 0.5 }
        >
          <IconSvg name="networks" boxSize="full"/>
        </IconButton>
      </PopoverTrigger>
      <NetworkMenuContentDesktop items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
