// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Separator, VStack } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Link } from 'src/toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import SettingsColorTheme from './fields/color-theme/SettingsColorTheme';
import SettingsIdentIcon from './fields/ident-icon/SettingsIdentIcon';
import { useSettingsModalContext } from './modal/context';

const Settings = () => {
  const popover = useDisclosure();
  const tooltip = useDisclosure();
  const settingsModal = useSettingsModalContext();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    open && tooltip.onClose();
    popover.onOpenChange({ open });
  }, [ popover, tooltip ]);

  const handleTooltipOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!popover.open) {
      tooltip.onOpenChange({ open });
    }
  }, [ popover, tooltip ]);

  const handleAdvancedSettingsClick = React.useCallback(() => {
    popover.onClose();
    settingsModal?.open();
  }, [ popover, settingsModal ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end' }}
      open={ popover.open }
      onOpenChange={ handlePopoverOpenChange }
      // should be false to enable auto-switch to default color theme
      lazyMount={ false }
    >
      { /* the tooltip must be fully disabled while the popover is open: the zag tooltip machine can
           self-open a controlled tooltip when another tooltip is visible (the tooltip-group instant-open
           transition is not guarded by isOpenControlled), and since handleTooltipOpenChange rejects opens
           while the popover is up, the controlled prop would never change and never close it back */ }
      <Tooltip
        content="Website settings"
        disableOnMobile
        disabled={ popover.open }
        open={ tooltip.open }
        onOpenChange={ handleTooltipOpenChange }
      >
        <Flex alignItems="center">
          <PopoverTrigger>
            <IconButton
              variant="link"
              size="2xs"
              borderRadius="sm"
              aria-label="User settings"
            >
              <SpriteIcon name="gear"/>
            </IconButton>
          </PopoverTrigger>
        </Flex>
      </Tooltip>
      <PopoverContent overflowY="hidden" w="auto" fontSize="sm">
        <PopoverBody>
          <VStack gap={ 3 } alignItems="stretch" separator={ <Separator my={ 3 }/> }>
            <SettingsColorTheme onSelect={ popover.onClose }/>
            <SettingsIdentIcon/>
            <Link
              display="flex"
              alignItems="center"
              gap={ 2 }
              minH="32px"
              textStyle="sm"
              onClick={ handleAdvancedSettingsClick }
            >
              <SpriteIcon name="gear" boxSize={ 5 }/>
              Advanced settings
            </Link>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(Settings);
