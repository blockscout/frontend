// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import NavigationMobile from 'client/shell/navigation/mobile/NavigationMobile';

import NetworkLogo from 'client/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'client/slices/chain/TestnetBadge';

import RollupStageBadge from 'client/features/rollup/common/components/RollupStageBadge';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { IconButton } from 'toolkit/chakra/icon-button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <DrawerRoot
      open={ open }
      onOpenChange={ onOpenChange }
      placement="start"
      lazyMount={ false }
    >
      <DrawerTrigger>
        <IconButton onClick={ onOpen } p={ 2 } aria-label="Menu button">
          <SpriteIcon
            name="burger"
            boxSize={ 6 }
            display="block"
            color={{ _light: 'gray.600', _dark: 'white' }}
          />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto">
          <TestnetBadge alignSelf="flex-start" mb={ 2 }/>
          <RollupStageBadge alignSelf="flex-start" mb={ 2 }/>
          <NetworkLogo/>
          <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
