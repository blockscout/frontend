import { IconButton, PopoverTrigger } from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';
import NetworkMenuContentDesktop from 'ui/snippets/networkMenu/NetworkMenuContentDesktop';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const NetworkMenu = () => {
  const menu = useNetworkMenu();

  return (
    <Popover placement="bottom-start" trigger="click" isLazy isOpen={ menu.isOpen } onClose={ menu.onClose }>
      <PopoverTrigger>
        <IconButton
          variant="simple"
          colorScheme="blue"
          aria-label="Network menu"
          icon={ <IconSvg name="networks" boxSize={ 4 }/> }
          p="1px"
          boxSize={ 4 }
          borderRadius="none"
          onClick={ menu.onToggle }
        />
      </PopoverTrigger>
      <NetworkMenuContentDesktop items={ menu.data } tabs={ menu.availableTabs }/>
    </Popover>
  );
};

export default React.memo(NetworkMenu);
