import { Flex } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import NetworkMenuContent from 'ui/snippets/networkMenu/NetworkMenuContent';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

const NetworkMenu = () => {
  const menu = useNetworkMenu();
  const tooltip = useDisclosure();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    open && tooltip.onClose();
    menu.onOpenChange({ open });
  }, [ menu, tooltip ]);

  const handleTooltipOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!menu.open) {
      tooltip.onOpenChange({ open });
    }
  }, [ menu, tooltip ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ handlePopoverOpenChange }
    >
      <Tooltip content="Chains list" disableOnMobile open={ tooltip.open } onOpenChange={ handleTooltipOpenChange }>
        <Flex alignItems="center">
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
        </Flex>
      </Tooltip>
      <NetworkMenuContent items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
