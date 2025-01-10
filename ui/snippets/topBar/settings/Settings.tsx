import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import SettingsAddressFormat from './SettingsAddressFormat';
import SettingsColorTheme from './SettingsColorTheme';
import SettingsIdentIcon from './SettingsIdentIcon';

const Settings = () => {
  const { open, onOpenChange, onClose } = useDisclosure();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start' }}
      lazyMount
      open={ open }
      onOpenChange={ onOpenChange }
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
