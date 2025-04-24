import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import SettingsAddressFormat from './SettingsAddressFormat';
import SettingsColorTheme from './SettingsColorTheme';
import SettingsIdentIcon from './SettingsIdentIcon';
import SettingsScamTokens from './SettingsScamTokens';

const Settings = () => {
  const { open, onOpenChange, onClose } = useDisclosure();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start' }}
      open={ open }
      onOpenChange={ onOpenChange }
      // should be false to enable auto-switch to default color theme
      lazyMount={ false }
    >
      <PopoverTrigger>
        <IconButton
          variant="link"
          size="2xs"
          borderRadius="sm"
          aria-label="User settings"
        >
          <IconSvg name="gear_slim"/>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="auto" fontSize="sm">
        <PopoverBody>
          <SettingsColorTheme onSelect={ onClose }/>
          <Box borderColor="border.divider" borderTopWidth="1px" my={ 3 }/>
          <SettingsIdentIcon/>
          <SettingsAddressFormat/>
          <SettingsScamTokens/>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(Settings);
