import { Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

import SettingsAddressFormat from './SettingsAddressFormat';
import SettingsColorTheme from './SettingsColorTheme';
import SettingsIdentIcon from './SettingsIdentIcon';

const Settings = () => {
  // TODO tom2drum refactor to separate hook
  const { open, onOpen, onClose } = useDisclosure();

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  }, [ onOpen, onClose ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start' }}
      lazyMount
      open={ open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <IconButton
          visual="plain"
          color="link.primary"
          _hover={{ color: 'link.primary.hover' }}
          borderRadius="none"
          aria-label="User settings"
        >
          <IconSvg name="gear_slim" boxSize={ 5 } p="1px"/>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="auto" fontSize="sm">
        <PopoverBody>
          <SettingsColorTheme onSelect={ onClose }/>
          <Box borderColor="border.divider" borderWidth="1px" my={ 3 }/>
          <SettingsIdentIcon/>
          <SettingsAddressFormat/>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(Settings);
